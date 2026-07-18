package com.luminarymom.api.Service;

import com.luminarymom.api.Model.Quote;
import com.luminarymom.api.Model.QuoteStatus;
import com.luminarymom.api.Repository.QuoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuoteServiceTest {

    @Mock private QuoteRepository quoteRepository;

    @InjectMocks private QuoteServiceImpl service;

    private Quote q(long id) {
        return new Quote(id, "quote " + id, "Luminary Mom", "Healing");
    }

    @Test
    void getAllQuotes_returnsOnlyApproved() {
        List<Quote> approved = List.of(q(1), q(2));
        when(quoteRepository.findByStatus(QuoteStatus.APPROVED)).thenReturn(approved);

        assertThat(service.getAllQuotes()).isSameAs(approved);
        verify(quoteRepository).findByStatus(QuoteStatus.APPROVED);
    }

    @Test
    void getQuotesByCategory_filtersByCategoryAndApproved() {
        List<Quote> approved = List.of(q(1));
        when(quoteRepository.findByCategoryAndStatus("Healing", QuoteStatus.APPROVED))
                .thenReturn(approved);

        assertThat(service.getQuotesByCategory("Healing")).isSameAs(approved);
        verify(quoteRepository).findByCategoryAndStatus("Healing", QuoteStatus.APPROVED);
    }

    @Test
    void getDailyQuote_picksFromApprovedPoolByDayOfYear() {
        List<Quote> approved = List.of(q(1), q(2), q(3));
        when(quoteRepository.findByStatus(QuoteStatus.APPROVED)).thenReturn(approved);
        int expectedIndex = LocalDate.now().getDayOfYear() % approved.size();

        assertThat(service.getDailyQuote()).isSameAs(approved.get(expectedIndex));
    }

    @Test
    void getDailyQuote_returnsNull_whenNoApprovedQuotes() {
        when(quoteRepository.findByStatus(QuoteStatus.APPROVED)).thenReturn(List.of());

        assertThat(service.getDailyQuote()).isNull();
    }
}
