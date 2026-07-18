package com.luminarymom.api.Controller;

import com.luminarymom.api.Agent.QuoteAgentService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

// Manual triggers so the agent can be tested on demand instead of waiting for the
// scheduled run. Requires authentication (SecurityConfig: anyRequest().authenticated()).
@RestController
@RequestMapping("/api/admin/agent")
@ConditionalOnProperty(name = "quote.agent.enabled", havingValue = "true")
public class QuoteAgentController {

    private final QuoteAgentService quoteAgentService;

    public QuoteAgentController(QuoteAgentService quoteAgentService) {
        this.quoteAgentService = quoteAgentService;
    }

    // Draft this month's candidates now (into PENDING).
    @PostMapping("/generate")
    public ResponseEntity<?> generate() {
        String category = quoteAgentService.currentCategory();
        int generated = quoteAgentService.generateForCurrentCategory();
        return ResponseEntity.ok(Map.of("category", category, "generated", generated));
    }

    // Run the gap-free archive check now.
    @PostMapping("/archive-check")
    public ResponseEntity<?> archiveCheck() {
        int archived = quoteAgentService.archiveCompletedSwaps();
        return ResponseEntity.ok(Map.of("archived", archived));
    }
}
