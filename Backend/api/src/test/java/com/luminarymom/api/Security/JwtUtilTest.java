package com.luminarymom.api.Security;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // HS256 requires a key of at least 256 bits (32 bytes).
        ReflectionTestUtils.setField(jwtUtil, "secret",
                "test-secret-key-that-is-long-enough-for-hs256-algorithm-abc");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 3600000L);
    }

    @Test
    void generateAccessToken_thenExtractEmail_roundTrips() {
        String token = jwtUtil.generateAccessToken("mom@example.com");

        assertThat(jwtUtil.extractEmail(token)).isEqualTo("mom@example.com");
    }

    @Test
    void freshToken_isNotExpired() {
        String token = jwtUtil.generateAccessToken("mom@example.com");

        assertThat(jwtUtil.isTokenExpired(token)).isFalse();
    }

    @Test
    void validateToken_trueForMatchingEmail_falseForDifferentEmail() {
        String token = jwtUtil.generateAccessToken("mom@example.com");

        assertThat(jwtUtil.validateToken(token, "mom@example.com")).isTrue();
        assertThat(jwtUtil.validateToken(token, "someone@else.com")).isFalse();
    }

    @Test
    void expiredToken_throwsExpiredJwtExceptionWhenParsed() {
        // Negative expiration produces a token whose expiry is already in the past.
        ReflectionTestUtils.setField(jwtUtil, "expiration", -10000L);
        String expired = jwtUtil.generateAccessToken("mom@example.com");

        // Note: JJWT throws on parse for an expired token, so isTokenExpired()
        // surfaces the exception rather than returning true.
        assertThatThrownBy(() -> jwtUtil.isTokenExpired(expired))
                .isInstanceOf(ExpiredJwtException.class);
    }
}
