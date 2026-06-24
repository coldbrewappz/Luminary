package com.luminarymom.api.Service;

import com.luminarymom.api.Model.Quote;
import java.util.List;

public interface QuoteService {

    List<Quote> getAllQuotes();

    List<Quote> getQuotesByCategory(String category);

    Quote getDailyQuote();

    Quote saveQuote(Quote quote);

    void deleteQuote(Long id);

}