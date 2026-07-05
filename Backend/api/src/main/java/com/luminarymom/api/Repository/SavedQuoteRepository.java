package com.luminarymom.api.Repository;

import com.luminarymom.api.Model.SavedQuote;
import com.luminarymom.api.Model.User;
import com.luminarymom.api.Model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedQuoteRepository extends JpaRepository<SavedQuote, Long> {

    // Get all saved quotes for a user
    List<SavedQuote> findByUser(User user);

    // Find a specific saved quote for a user
    Optional<SavedQuote> findByUserAndQuote(User user, Quote quote);

    // Count how many quotes a user has saved
    int countByUser(User user);

    // Check if a user already saved a specific quote
    boolean existsByUserAndQuote(User user, Quote quote);

    // Delete a specific saved quote for a user
    void deleteByUserAndQuote(User user, Quote quote);

}