package com.luminarymom.api.Service;

import com.luminarymom.api.Model.PersonalQuote;
import com.luminarymom.api.Model.User;
import com.luminarymom.api.Repository.PersonalQuoteRepository;
import com.luminarymom.api.Repository.SavedQuoteRepository;
import com.luminarymom.api.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonalQuoteServiceImpl implements PersonalQuoteService {

    private final PersonalQuoteRepository personalQuoteRepository;
    private final SavedQuoteRepository savedQuoteRepository;
    private final UserRepository userRepository;

    private static final int QUOTE_CAP = 20;

    public PersonalQuoteServiceImpl(PersonalQuoteRepository personalQuoteRepository,
                                    SavedQuoteRepository savedQuoteRepository,
                                    UserRepository userRepository) {
        this.personalQuoteRepository = personalQuoteRepository;
        this.savedQuoteRepository = savedQuoteRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<PersonalQuote> getPersonalQuotes(String email) {
        User user = getUserByEmail(email);
        return personalQuoteRepository.findByUser(user);
    }

    @Override
    public PersonalQuote addPersonalQuote(String email, String text) {
        User user = getUserByEmail(email);

        // Cap counts BOTH saved quotes AND personal quotes combined
        int savedCount = savedQuoteRepository.countByUser(user);
        int personalCount = personalQuoteRepository.countByUser(user);

        if (savedCount + personalCount >= QUOTE_CAP) {
            throw new RuntimeException("Quote cap reached. Maximum " + QUOTE_CAP + " total quotes allowed.");
        }

        PersonalQuote personalQuote = new PersonalQuote(user, text);
        return personalQuoteRepository.save(personalQuote);
    }

    @Override
    @Transactional
    public void deletePersonalQuote(String email, Long id) {
        User user = getUserByEmail(email);
        personalQuoteRepository.deleteByIdAndUser(id, user);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

}