package com.luminarymom.api.Repository;

import com.luminarymom.api.Model.Quote;
import com.luminarymom.api.Model.QuoteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {

    List<Quote> findByStatus(QuoteStatus status);

    List<Quote> findByCategoryAndStatus(String category, QuoteStatus status);

    // All quotes in a category regardless of status — used to de-duplicate generated candidates.
    List<Quote> findByCategory(String category);

    int countByCategoryAndStatus(String category, QuoteStatus status);

}