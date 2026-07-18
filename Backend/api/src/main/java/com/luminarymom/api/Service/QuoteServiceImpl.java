package com.luminarymom.api.Service;

import com.luminarymom.api.Model.Quote;
import com.luminarymom.api.Model.QuoteStatus;
import com.luminarymom.api.Repository.QuoteRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDate;

@Service
public class QuoteServiceImpl implements QuoteService {

    private final QuoteRepository quoteRepository;

    public QuoteServiceImpl(QuoteRepository quoteRepository) {
        this.quoteRepository = quoteRepository;
    }

    @Override
    public List<Quote> getAllQuotes() {
        return quoteRepository.findByStatus(QuoteStatus.APPROVED);
    }

    @Override
    public List<Quote> getQuotesByCategory(String category) {
        return quoteRepository.findByCategoryAndStatus(category, QuoteStatus.APPROVED);
    }

    @Override
    public Quote getDailyQuote() {
        List<Quote> approved = quoteRepository.findByStatus(QuoteStatus.APPROVED);
        if (approved.isEmpty()) return null;
        int dayOfYear = LocalDate.now().getDayOfYear();
        int index = dayOfYear % approved.size();
        return approved.get(index);
    }

    @Override
    public Quote saveQuote(Quote quote) {
        return quoteRepository.save(quote);
    }

    @Override
    public void deleteQuote(Long id) {
        quoteRepository.deleteById(id);
    }

}