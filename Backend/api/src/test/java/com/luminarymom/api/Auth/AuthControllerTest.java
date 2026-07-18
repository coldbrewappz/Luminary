package com.luminarymom.api.Auth;

import com.luminarymom.api.Model.User;
import com.luminarymom.api.Repository.UserRepository;
import com.luminarymom.api.Security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private AuthController controller;

    private RegisterRequest request(String email, String password) {
        RegisterRequest r = new RegisterRequest();
        r.setEmail(email);
        r.setPassword(password);
        return r;
    }

    @Test
    void register_rejectsMalformedEmail() {
        ResponseEntity<?> response = controller.register(request("notanemail", "password123"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void register_rejectsShortPassword() {
        ResponseEntity<?> response = controller.register(request("mom@example.com", "short"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void register_rejectsDuplicateEmail() {
        when(userRepository.existsByEmail("mom@example.com")).thenReturn(true);

        ResponseEntity<?> response = controller.register(request("mom@example.com", "password123"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void register_succeeds_forValidNewUser() {
        when(userRepository.existsByEmail("mom@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(jwtUtil.generateAccessToken("mom@example.com")).thenReturn("access");
        when(jwtUtil.generateRefreshToken("mom@example.com")).thenReturn("refresh");

        ResponseEntity<?> response = controller.register(request("mom@example.com", "password123"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isInstanceOf(AuthResponse.class);
        assertThat(((AuthResponse) response.getBody()).getEmail()).isEqualTo("mom@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void login_rejectsBlankFields() {
        ResponseEntity<?> response = controller.login(request(null, null));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void login_rejectsWrongPassword() {
        User user = new User("mom@example.com", "hashed");
        when(userRepository.findByEmail("mom@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "hashed")).thenReturn(false);

        ResponseEntity<?> response = controller.login(request("mom@example.com", "wrongpass"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
