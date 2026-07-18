package com.luminarymom.api.Service;

import com.luminarymom.api.Model.PersonalQuote;
import com.luminarymom.api.Model.User;
import com.luminarymom.api.Repository.PersonalQuoteRepository;
import com.luminarymom.api.Repository.SavedQuoteRepository;
import com.luminarymom.api.Repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PersonalQuoteServiceTest {

    @Mock private PersonalQuoteRepository personalQuoteRepository;
    @Mock private SavedQuoteRepository savedQuoteRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private PersonalQuoteServiceImpl service;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("mom@example.com", "hashed");
    }

    @Test
    void addPersonalQuote_savesAndReturns_whenUnderCombinedCap() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        when(savedQuoteRepository.countByUser(user)).thenReturn(5);
        when(personalQuoteRepository.countByUser(user)).thenReturn(4);
        PersonalQuote persisted = new PersonalQuote(user, "keep going");
        when(personalQuoteRepository.save(any(PersonalQuote.class))).thenReturn(persisted);

        PersonalQuote result = service.addPersonalQuote("mom@example.com", "keep going");

        assertThat(result).isSameAs(persisted);
    }

    @Test
    void addPersonalQuote_throws_whenSavedPlusPersonalAtCap() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        when(savedQuoteRepository.countByUser(user)).thenReturn(15);
        when(personalQuoteRepository.countByUser(user)).thenReturn(5); // 20 total

        assertThatThrownBy(() -> service.addPersonalQuote("mom@example.com", "one more"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("cap");
        verify(personalQuoteRepository, never()).save(any());
    }

    @Test
    void addPersonalQuote_succeeds_whenJustUnderCombinedCap() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        when(savedQuoteRepository.countByUser(user)).thenReturn(15);
        when(personalQuoteRepository.countByUser(user)).thenReturn(4); // 19 total
        PersonalQuote persisted = new PersonalQuote(user, "almost full");
        when(personalQuoteRepository.save(any(PersonalQuote.class))).thenReturn(persisted);

        PersonalQuote result = service.addPersonalQuote("mom@example.com", "almost full");

        assertThat(result).isSameAs(persisted);
    }

    @Test
    void deletePersonalQuote_delegatesToRepository() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));

        service.deletePersonalQuote("mom@example.com", 7L);

        verify(personalQuoteRepository).deleteByIdAndUser(7L, user);
    }

    @Test
    void getPersonalQuotes_returnsUsersQuotes() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        List<PersonalQuote> quotes = List.of(
                new PersonalQuote(user, "a"),
                new PersonalQuote(user, "b"));
        when(personalQuoteRepository.findByUser(user)).thenReturn(quotes);

        assertThat(service.getPersonalQuotes("mom@example.com")).hasSize(2);
    }
}
