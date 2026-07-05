package com.luminarymom.api.Controller;

import com.luminarymom.api.Model.SavedQuote;
import com.luminarymom.api.Service.SavedQuoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loves")
@CrossOrigin(origins = "*")
public class SavedQuoteController {

    private final SavedQuoteService savedQuoteService;

    public SavedQuoteController(SavedQuoteService savedQuoteService) {
        this.savedQuoteService = savedQuoteService;
    }

    // GET /api/loves
    @GetMapping
    public ResponseEntity<List<SavedQuote>> getSavedQuotes(Authentication authentication) {
        String email = authentication.getName();
        List<SavedQuote> savedQuotes = savedQuoteService.getSavedQuotes(email);
        return ResponseEntity.ok(savedQuotes);
    }

    // POST /api/loves
    @PostMapping
    public ResponseEntity<?> saveQuote(
            Authentication authentication,
            @RequestBody Map<String, Long> body) {
        try {
            String email = authentication.getName();
            Long quoteId = body.get("quoteId");
            SavedQuote saved = savedQuoteService.saveQuote(email, quoteId);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // DELETE /api/loves/{quoteId}
    @DeleteMapping("/{quoteId}")
    public ResponseEntity<?> unsaveQuote(
            Authentication authentication,
            @PathVariable Long quoteId) {
        try {
            String email = authentication.getName();
            savedQuoteService.unsaveQuote(email, quoteId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // GET /api/loves/count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getCount(Authentication authentication) {
        String email = authentication.getName();
        int count = savedQuoteService.getSavedQuoteCount(email);
        return ResponseEntity.ok(Map.of("count", count));
    }

}