package com.luminarymom.api.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_quotes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "quote_id"}))
public class SavedQuote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "quote_id", nullable = false)
    private Quote quote;

    @Column(name = "saved_at")
    private LocalDateTime savedAt;

    @PrePersist
    protected void onCreate() {
        savedAt = LocalDateTime.now();
    }

    public SavedQuote() {}

    public SavedQuote(User user, Quote quote) {
        this.user = user;
        this.quote = quote;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Quote getQuote() { return quote; }
    public void setQuote(Quote quote) { this.quote = quote; }

    public LocalDateTime getSavedAt() { return savedAt; }
    public void setSavedAt(LocalDateTime savedAt) { this.savedAt = savedAt; }

}