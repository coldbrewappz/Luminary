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

}