package com.luminarymom.api.Service;

import com.luminarymom.api.Model.PersonalQuote;
import java.util.List;

public interface PersonalQuoteService {

    List<PersonalQuote> getPersonalQuotes(String email);

    PersonalQuote addPersonalQuote(String email, String text);

    void deletePersonalQuote(String email, Long id);

}