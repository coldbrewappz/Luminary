package com.luminarymom.api.Service;

import com.luminarymom.api.Model.Quote;
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
        return quoteRepository.findAll();
    }

    @Override
    public List<Quote> getQuotesByCategory(String category) {
        return quoteRepository.findByCategory(category);
    }

    @Override
    public Quote getDailyQuote() {
        List<Quote> allQuotes = quoteRepository.findAll();
        if (allQuotes.isEmpty()) return null;
        int dayOfYear = LocalDate.now().getDayOfYear();
        int index = dayOfYear % allQuotes.size();
        return allQuotes.get(index);
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