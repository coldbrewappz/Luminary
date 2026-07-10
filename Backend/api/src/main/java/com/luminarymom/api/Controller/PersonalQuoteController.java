package com.luminarymom.api.Controller;

import com.luminarymom.api.Model.PersonalQuote;
import com.luminarymom.api.Service.PersonalQuoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(origins = "*")
public class PersonalQuoteController {

    private final PersonalQuoteService personalQuoteService;

    public PersonalQuoteController(PersonalQuoteService personalQuoteService) {
        this.personalQuoteService = personalQuoteService;
    }

    // GET /api/personal
    @GetMapping
    public ResponseEntity<List<PersonalQuote>> getPersonalQuotes(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(personalQuoteService.getPersonalQuotes(email));
    }

    // POST /api/personal
    @PostMapping
    public ResponseEntity<?> addPersonalQuote(
            Authentication authentication,
            @RequestBody Map<String, String> body) {
        try {
            String email = authentication.getName();
            String text = body.get("text");
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Text cannot be empty.");
            }
            PersonalQuote saved = personalQuoteService.addPersonalQuote(email, text.trim());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // DELETE /api/personal/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePersonalQuote(
            Authentication authentication,
            @PathVariable Long id) {
        try {
            String email = authentication.getName();
            personalQuoteService.deletePersonalQuote(email, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

}