package com.luminarymom.api.Service;

import com.luminarymom.api.Model.SavedQuote;
import java.util.List;

public interface SavedQuoteService {

    List<SavedQuote> getSavedQuotes(String email);

    SavedQuote saveQuote(String email, Long quoteId);

    void unsaveQuote(String email, Long quoteId);

    int getSavedQuoteCount(String email);

}