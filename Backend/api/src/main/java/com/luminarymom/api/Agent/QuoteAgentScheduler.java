package com.luminarymom.api.Agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

// Fires the agent on a schedule. Both jobs are wrapped so a failure (e.g. missing
// API key, model hiccup) is logged and never crashes the app.
@Component
@ConditionalOnProperty(name = "quote.agent.enabled", havingValue = "true")
public class QuoteAgentScheduler {

    private static final Logger log = LoggerFactory.getLogger(QuoteAgentScheduler.class);

    private final QuoteAgentService quoteAgentService;

    public QuoteAgentScheduler(QuoteAgentService quoteAgentService) {
        this.quoteAgentService = quoteAgentService;
    }

    // 3:00 AM on the 1st of every month — draft the month's candidates into PENDING.
    @Scheduled(cron = "0 0 3 1 * *", zone = "America/Los_Angeles")
    public void monthlyGeneration() {
        try {
            int saved = quoteAgentService.generateForCurrentCategory();
            log.info("Monthly quote generation complete: {} candidates saved.", saved);
        } catch (Exception e) {
            log.error("Monthly quote generation failed", e);
        }
    }

    // 4:00 AM daily — if the review of the active category is done, retire the old set.
    @Scheduled(cron = "0 0 4 * * *", zone = "America/Los_Angeles")
    public void dailyArchiveCheck() {
        try {
            quoteAgentService.archiveCompletedSwaps();
        } catch (Exception e) {
            log.error("Daily archive check failed", e);
        }
    }
}
