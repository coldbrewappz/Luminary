package com.luminarymom.api.Controller;

import com.luminarymom.api.Model.Quote;
import com.luminarymom.api.Service.QuoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quotes")
@CrossOrigin(origins = "*")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    // GET /api/quotes
    @GetMapping
    public ResponseEntity<List<Quote>> getAllQuotes() {
        return ResponseEntity.ok(quoteService.getAllQuotes());
    }

    // GET /api/quotes/daily
    @GetMapping("/daily")
    public ResponseEntity<Quote> getDailyQuote() {
        Quote daily = quoteService.getDailyQuote();
        if (daily == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(daily);
    }

    // GET /api/quotes/category/{category}
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Quote>> getQuotesByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(quoteService.getQuotesByCategory(category));
    }

    // POST /api/quotes
    @PostMapping
    public ResponseEntity<Quote> createQuote(@RequestBody Quote quote) {
        return ResponseEntity.ok(quoteService.saveQuote(quote));
    }

    // DELETE /api/quotes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuote(@PathVariable Long id) {
        quoteService.deleteQuote(id);
        return ResponseEntity.noContent().build();
    }

}