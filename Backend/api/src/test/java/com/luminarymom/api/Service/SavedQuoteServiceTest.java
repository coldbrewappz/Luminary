package com.luminarymom.api.Service;

import com.luminarymom.api.Model.Quote;
import com.luminarymom.api.Model.SavedQuote;
import com.luminarymom.api.Model.User;
import com.luminarymom.api.Repository.QuoteRepository;
import com.luminarymom.api.Repository.SavedQuoteRepository;
import com.luminarymom.api.Repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SavedQuoteServiceTest {

    @Mock private SavedQuoteRepository savedQuoteRepository;
    @Mock private UserRepository userRepository;
    @Mock private QuoteRepository quoteRepository;

    @InjectMocks private SavedQuoteServiceImpl service;

    private User user;
    private Quote quote;

    @BeforeEach
    void setUp() {
        user = new User("mom@example.com", "hashed");
        quote = new Quote(1L, "You are enough", "Unknown", "Motherhood");
    }

    @Test
    void saveQuote_savesAndReturns_whenUnderCapAndNotAlreadySaved() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        when(savedQuoteRepository.countByUser(user)).thenReturn(3);
        when(quoteRepository.findById(1L)).thenReturn(Optional.of(quote));
        when(savedQuoteRepository.existsByUserAndQuote(user, quote)).thenReturn(false);
        SavedQuote persisted = new SavedQuote(user, quote);
        when(savedQuoteRepository.save(any(SavedQuote.class))).thenReturn(persisted);

        SavedQuote result = service.saveQuote("mom@example.com", 1L);

        assertThat(result).isSameAs(persisted);
        verify(savedQuoteRepository).save(any(SavedQuote.class));
    }

    @Test
    void saveQuote_throws_whenAtCap() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        when(savedQuoteRepository.countByUser(user)).thenReturn(20);

        assertThatThrownBy(() -> service.saveQuote("mom@example.com", 1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("cap");
        verify(savedQuoteRepository, never()).save(any());
    }

    @Test
    void saveQuote_throws_whenQuoteNotFound() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        when(savedQuoteRepository.countByUser(user)).thenReturn(0);
        when(quoteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.saveQuote("mom@example.com", 99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Quote not found");
    }

    @Test
    void saveQuote_throws_whenAlreadySaved() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        when(savedQuoteRepository.countByUser(user)).thenReturn(0);
        when(quoteRepository.findById(1L)).thenReturn(Optional.of(quote));
        when(savedQuoteRepository.existsByUserAndQuote(user, quote)).thenReturn(true);

        assertThatThrownBy(() -> service.saveQuote("mom@example.com", 1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("already saved");
        verify(savedQuoteRepository, never()).save(any());
    }

    @Test
    void unsaveQuote_deletesByUserAndQuote() {
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        when(quoteRepository.findById(1L)).thenReturn(Optional.of(quote));

        service.unsaveQuote("mom@example.com", 1L);

        verify(savedQuoteRepository).deleteByUserAndQuote(user, quote);
    }

    @Test
    void getSavedQuotes_throws_whenUserNotFound() {
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getSavedQuotes("ghost@example.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }
}
