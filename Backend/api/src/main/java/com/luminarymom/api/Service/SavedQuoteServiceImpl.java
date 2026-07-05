package com.luminarymom.api.Service;

import com.luminarymom.api.Model.Quote;
import com.luminarymom.api.Model.SavedQuote;
import com.luminarymom.api.Model.User;
import com.luminarymom.api.Repository.QuoteRepository;
import com.luminarymom.api.Repository.SavedQuoteRepository;
import com.luminarymom.api.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SavedQuoteServiceImpl implements SavedQuoteService {

    private final SavedQuoteRepository savedQuoteRepository;
    private final UserRepository userRepository;
    private final QuoteRepository quoteRepository;

    private static final int QUOTE_CAP = 20;

    public SavedQuoteServiceImpl(SavedQuoteRepository savedQuoteRepository,
                                 UserRepository userRepository,
                                 QuoteRepository quoteRepository) {
        this.savedQuoteRepository = savedQuoteRepository;
        this.userRepository = userRepository;
        this.quoteRepository = quoteRepository;
    }

    @Override
    public List<SavedQuote> getSavedQuotes(String email) {
        User user = getUserByEmail(email);
        return savedQuoteRepository.findByUser(user);
    }

    @Override
    public SavedQuote saveQuote(String email, Long quoteId) {
        User user = getUserByEmail(email);

        // Enforce 20 quote cap
        if (savedQuoteRepository.countByUser(user) >= QUOTE_CAP) {
            throw new RuntimeException("Quote cap reached. Maximum " + QUOTE_CAP + " quotes allowed.");
        }

        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + quoteId));

        // Check if already saved
        if (savedQuoteRepository.existsByUserAndQuote(user, quote)) {
            throw new RuntimeException("Quote already saved.");
        }

        SavedQuote savedQuote = new SavedQuote(user, quote);
        return savedQuoteRepository.save(savedQuote);
    }

    @Override
    @Transactional
    public void unsaveQuote(String email, Long quoteId) {
        User user = getUserByEmail(email);

        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new RuntimeException("Quote not found with id: " + quoteId));

        savedQuoteRepository.deleteByUserAndQuote(user, quote);
    }

    @Override
    public int getSavedQuoteCount(String email) {
        User user = getUserByEmail(email);
        return savedQuoteRepository.countByUser(user);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

}