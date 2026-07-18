package com.luminarymom.api.Agent;

import com.luminarymom.api.Model.Quote;
import com.luminarymom.api.Model.QuoteStatus;
import com.luminarymom.api.Repository.QuoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuoteAgentServiceTest {

    @Mock private QuoteRepository quoteRepository;
    @Mock private QuoteGenerator quoteGenerator;

    private QuoteAgentService service;

    @BeforeEach
    void setUp() {
        // Anchor Aug 2026 -> Motherhood is index 0 that month.
        service = new QuoteAgentService(quoteRepository, quoteGenerator, "2026-08", 50, 20);
    }

    // --- rotation ---

    @Test
    void activeCategory_cyclesThroughSixCategoriesFromTheAnchor() {
        assertThat(service.activeCategory(YearMonth.of(2026, 8))).isEqualTo("motherhood");
        assertThat(service.activeCategory(YearMonth.of(2026, 9))).isEqualTo("healing");
        assertThat(service.activeCategory(YearMonth.of(2026, 10))).isEqualTo("hope");
        assertThat(service.activeCategory(YearMonth.of(2027, 1))).isEqualTo("humor");
        assertThat(service.activeCategory(YearMonth.of(2027, 2))).isEqualTo("motherhood"); // wraps after 6
    }

    // --- generation ---

    @Test
    void generate_savesNonDuplicatesAsPendingWithResolvedAuthor() {
        when(quoteRepository.findByCategory("motherhood")).thenReturn(List.of(
                new Quote(1L, "existing quote", "Someone", "motherhood")));
        when(quoteGenerator.generate(anyString())).thenReturn(List.of(
                new GeneratedQuote("existing quote", "Someone", "known", "dup"), // duplicate -> skipped
                new GeneratedQuote("my own words", null, "in-house", null),      // -> Luminary Mom
                new GeneratedQuote("a real line", "Maya Angelou", "known", "poet - high"),
                new GeneratedQuote("  ", "x", "unknown", "")));                    // blank -> skipped

        int saved = service.generateForCurrentCategory(YearMonth.of(2026, 8));

        assertThat(saved).isEqualTo(2);

        ArgumentCaptor<Quote> captor = ArgumentCaptor.forClass(Quote.class);
        verify(quoteRepository, org.mockito.Mockito.times(2)).save(captor.capture());
        List<Quote> savedQuotes = captor.getAllValues();
        assertThat(savedQuotes).allMatch(q -> q.getStatus() == QuoteStatus.PENDING);
        assertThat(savedQuotes).anyMatch(q -> q.getAuthor().equals("Luminary Mom"));
        assertThat(savedQuotes).anyMatch(q -> q.getAuthor().equals("Maya Angelou"));
    }

    // --- archive checker ---

    @Test
    void archive_retiresOldSet_whenReviewDoneAndNewApprovedExist() {
        YearMonth month = YearMonth.of(2026, 9); // -> healing
        when(quoteRepository.countByCategoryAndStatus("healing", QuoteStatus.PENDING)).thenReturn(0);

        Quote oldApproved = new Quote(1L, "old", "a", "healing");
        oldApproved.setCreatedAt(LocalDateTime.of(2026, 7, 1, 0, 0)); // before this month
        oldApproved.setStatus(QuoteStatus.APPROVED);
        Quote nullDated = new Quote(2L, "seed", "b", "healing"); // null createdAt -> treated as old
        nullDated.setStatus(QuoteStatus.APPROVED);
        Quote newApproved = new Quote(3L, "new", "Luminary Mom", "healing");
        newApproved.setCreatedAt(LocalDateTime.of(2026, 9, 5, 0, 0)); // this cycle
        newApproved.setStatus(QuoteStatus.APPROVED);

        when(quoteRepository.findByCategoryAndStatus("healing", QuoteStatus.APPROVED))
                .thenReturn(List.of(oldApproved, nullDated, newApproved));

        int archived = service.archiveCompletedSwaps(month);

        assertThat(archived).isEqualTo(2);
        assertThat(oldApproved.getStatus()).isEqualTo(QuoteStatus.ARCHIVED);
        assertThat(nullDated.getStatus()).isEqualTo(QuoteStatus.ARCHIVED);
        assertThat(newApproved.getStatus()).isEqualTo(QuoteStatus.APPROVED); // kept
        verify(quoteRepository).saveAll(any());
    }

    @Test
    void archive_doesNothing_whenPendingStillExists() {
        YearMonth month = YearMonth.of(2026, 9);
        when(quoteRepository.countByCategoryAndStatus("healing", QuoteStatus.PENDING)).thenReturn(7);

        int archived = service.archiveCompletedSwaps(month);

        assertThat(archived).isZero();
        verify(quoteRepository, never()).saveAll(any());
    }

    @Test
    void archive_doesNothing_whenNoNewApprovedThisCycle() {
        YearMonth month = YearMonth.of(2026, 9);
        when(quoteRepository.countByCategoryAndStatus("healing", QuoteStatus.PENDING)).thenReturn(0);

        Quote oldApproved = new Quote(1L, "old", "a", "healing");
        oldApproved.setCreatedAt(LocalDateTime.of(2026, 7, 1, 0, 0));
        oldApproved.setStatus(QuoteStatus.APPROVED);
        when(quoteRepository.findByCategoryAndStatus("healing", QuoteStatus.APPROVED))
                .thenReturn(List.of(oldApproved)); // nothing new approved

        int archived = service.archiveCompletedSwaps(month);

        assertThat(archived).isZero();
        assertThat(oldApproved.getStatus()).isEqualTo(QuoteStatus.APPROVED);
        verify(quoteRepository, never()).saveAll(any());
    }
}
