package com.luminarymom.api.Agent;

import com.luminarymom.api.Model.Quote;
import com.luminarymom.api.Model.QuoteStatus;
import com.luminarymom.api.Repository.QuoteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

// The monthly quote agent:
//  - generateForCurrentCategory(): drafts new candidates into PENDING (nothing goes live)
//  - archiveCompletedSwaps(): once the user has cleared the pending batch for the active
//    category (0 pending, some newly-approved), retires the previous set to ARCHIVED.
// Category cycles motherhood -> healing -> hope -> strength -> not-alone -> humor, one per month.
@Service
@ConditionalOnProperty(name = "quote.agent.enabled", havingValue = "true")
public class QuoteAgentService {

    private static final Logger log = LoggerFactory.getLogger(QuoteAgentService.class);

    // DB category slugs, in cycle order (index 0 is the anchor month's category).
    static final List<String> CATEGORY_ORDER =
            List.of("motherhood", "healing", "hope", "strength", "not-alone", "humor");

    private static final Map<String, String> DISPLAY_NAMES = Map.of(
            "motherhood", "Motherhood",
            "healing", "Healing",
            "hope", "Hope",
            "strength", "Strength",
            "not-alone", "You Are Not Alone",
            "humor", "A Little Humor");

    private final QuoteRepository quoteRepository;
    private final QuoteGenerator quoteGenerator;
    private final YearMonth anchor;
    private final int batchSize;
    private final int maxInHouse;

    public QuoteAgentService(
            QuoteRepository quoteRepository,
            QuoteGenerator quoteGenerator,
            @Value("${quote.agent.anchor-month:2026-08}") String anchorMonth,
            @Value("${quote.agent.batch-size:50}") int batchSize,
            @Value("${quote.agent.max-in-house:20}") int maxInHouse) {
        this.quoteRepository = quoteRepository;
        this.quoteGenerator = quoteGenerator;
        this.anchor = YearMonth.parse(anchorMonth);
        this.batchSize = batchSize;
        this.maxInHouse = maxInHouse;
    }

    public String currentCategory() {
        return activeCategory(YearMonth.now());
    }

    // Which category is refreshed in the given month.
    String activeCategory(YearMonth month) {
        long months = ChronoUnit.MONTHS.between(anchor, month);
        int size = CATEGORY_ORDER.size();
        int idx = (int) (((months % size) + size) % size);
        return CATEGORY_ORDER.get(idx);
    }

    public int generateForCurrentCategory() {
        return generateForCurrentCategory(YearMonth.now());
    }

    int generateForCurrentCategory(YearMonth month) {
        String category = activeCategory(month);
        List<Quote> existing = quoteRepository.findByCategory(category);
        Set<String> existingTexts = existing.stream()
                .map(q -> q.getText() == null ? "" : q.getText().trim())
                .collect(Collectors.toCollection(HashSet::new));

        String prompt = buildPrompt(category, existingTexts);
        List<GeneratedQuote> candidates = quoteGenerator.generate(prompt);

        int saved = 0;
        for (GeneratedQuote candidate : candidates) {
            if (candidate.text() == null || candidate.text().isBlank()) {
                continue;
            }
            String text = candidate.text().trim();
            if (!existingTexts.add(text)) {
                continue; // duplicate of an existing or already-generated quote
            }
            Quote quote = new Quote();
            quote.setText(text);
            quote.setAuthor(resolveAuthor(candidate));
            quote.setCategory(category);
            quote.setStatus(QuoteStatus.PENDING);
            quote.setReviewNote(buildReviewNote(candidate));
            quoteRepository.save(quote);
            saved++;
        }
        log.info("Quote agent generated {} pending quotes for category '{}'", saved, category);
        return saved;
    }

    public int archiveCompletedSwaps() {
        return archiveCompletedSwaps(YearMonth.now());
    }

    @Transactional
    int archiveCompletedSwaps(YearMonth month) {
        String category = activeCategory(month);

        // Review not finished yet — leave everything as-is.
        if (quoteRepository.countByCategoryAndStatus(category, QuoteStatus.PENDING) > 0) {
            return 0;
        }

        List<Quote> approved = quoteRepository.findByCategoryAndStatus(category, QuoteStatus.APPROVED);
        LocalDateTime firstOfMonth = month.atDay(1).atStartOfDay();

        List<Quote> newBatch = approved.stream()
                .filter(q -> q.getCreatedAt() != null && !q.getCreatedAt().isBefore(firstOfMonth))
                .toList();
        List<Quote> oldBatch = approved.stream()
                .filter(q -> q.getCreatedAt() == null || q.getCreatedAt().isBefore(firstOfMonth))
                .toList();

        // Only retire the old set once the new set has actually been approved,
        // so the category is never left empty.
        if (newBatch.isEmpty() || oldBatch.isEmpty()) {
            return 0;
        }

        oldBatch.forEach(q -> q.setStatus(QuoteStatus.ARCHIVED));
        quoteRepository.saveAll(oldBatch);
        log.info("Quote agent archived {} old quotes for category '{}' after review", oldBatch.size(), category);
        return oldBatch.size();
    }

    private String resolveAuthor(GeneratedQuote candidate) {
        if ("in-house".equalsIgnoreCase(candidate.type())) {
            return "Luminary Mom";
        }
        if (candidate.author() == null || candidate.author().isBlank()) {
            return "Unknown";
        }
        return candidate.author().trim();
    }

    private String buildReviewNote(GeneratedQuote candidate) {
        String type = candidate.type() == null ? "?" : candidate.type();
        String hint = candidate.sourceHint() == null ? "" : candidate.sourceHint();
        return ("[" + type + "] " + hint).trim();
    }

    private String buildPrompt(String categorySlug, Set<String> existingTexts) {
        String display = DISPLAY_NAMES.getOrDefault(categorySlug, categorySlug);
        String existing = existingTexts.isEmpty()
                ? "(none)"
                : existingTexts.stream().map(t -> "- " + t).collect(Collectors.joining("\n"));

        return """
                You are the quote curator for Luminary Mom, a website offering comfort and \
                encouragement to new and postpartum mothers who often feel isolated, exhausted, \
                and unsure of their new identity. Every quote should feel like a small, steady \
                light to a mother in the hardest chapter of her life.

                Generate exactly %d short quotes for the "%s" category.

                Mix requirements:
                - At most %d may be ORIGINAL quotes you write yourself. Attribute those to \
                "Luminary Mom" and set "type" to "in-house".
                - The remaining quotes must be REAL, pre-existing quotes. The MAJORITY should be \
                from KNOWN authors (set "type" to "known"); the rest may be traditional or \
                anonymous sayings (set "type" to "unknown", author "Unknown").
                - Favor widely-documented, verifiable quotes. Do NOT attribute quotes to living \
                private individuals. Quotes from any era are welcome.
                - Do NOT alter the wording of real quotes. Only in-house quotes may be your own words.
                - For every "known" quote, put a brief source hint and your confidence in the \
                "sourceHint" field (e.g. "Rumi, 13th-century Persian poet - high confidence").

                Do not repeat any of these existing quotes:
                %s

                Return ONLY a JSON array, with no prose and no markdown fences. Each element must be \
                an object of the form:
                {"text": "...", "author": "...", "type": "in-house|known|unknown", "sourceHint": "..."}
                """.formatted(batchSize, display, maxInHouse, existing);
    }
}
