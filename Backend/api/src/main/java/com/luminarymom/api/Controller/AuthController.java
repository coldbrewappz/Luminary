package com.luminarymom.api.Auth;

import com.luminarymom.api.Model.User;
import com.luminarymom.api.Repository.PersonalQuoteRepository;
import com.luminarymom.api.Repository.SavedQuoteRepository;
import com.luminarymom.api.Repository.UserRepository;
import com.luminarymom.api.Security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final SavedQuoteRepository savedQuoteRepository;
    private final PersonalQuoteRepository personalQuoteRepository;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          SavedQuoteRepository savedQuoteRepository,
                          PersonalQuoteRepository personalQuoteRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.savedQuoteRepository = savedQuoteRepository;
        this.personalQuoteRepository = personalQuoteRepository;
    }

    private static final java.util.regex.Pattern EMAIL_PATTERN =
            java.util.regex.Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        // 1. Validate input
        String email = request.getEmail() == null ? null : request.getEmail().trim();
        String password = request.getPassword();

        if (email == null || email.isEmpty() || !EMAIL_PATTERN.matcher(email).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please enter a valid email address.");
        }
        if (password == null || password.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 8 characters.");
        }

        // 2. Check if email already exists
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("An account with this email already exists.");
        }

        // 3. Hash the password
        String hashedPassword = passwordEncoder.encode(password);

        // 4. Create and save the new user
        User user = new User(email, hashedPassword);
        userRepository.save(user);

        // 5. Generate tokens
        String accessToken = jwtUtil.generateAccessToken(email);
        String refreshToken = jwtUtil.generateRefreshToken(email);

        // 6. Return tokens
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(accessToken, refreshToken, email));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RegisterRequest request) {

        // 1. Validate input
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email and password are required.");
        }

        // 2. Find user by email
        var userOptional = userRepository.findByEmail(request.getEmail().trim());

        // 3. User not found
        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        var user = userOptional.get();

        // 4. Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        // 5. Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        // 6. Return tokens
        return ResponseEntity.ok(
                new AuthResponse(accessToken, refreshToken, user.getEmail())
        );
    }

    // POST /api/auth/refresh
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest request) {

        // Accept a JSON body { "refreshToken": "..." }, like register/login.
        String refreshToken = request.getRefreshToken();
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Refresh token is required.");
        }

        try {
            // 1. Extract email from refresh token
            String email = jwtUtil.extractEmail(refreshToken);

            // 2. Check token not expired
            if (jwtUtil.isTokenExpired(refreshToken)) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Refresh token expired. Please log in again.");
            }

            // 3. Confirm user still exists
            if (userRepository.findByEmail(email).isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("User not found.");
            }

            // 4. Generate new tokens
            String newAccessToken = jwtUtil.generateAccessToken(email);
            String newRefreshToken = jwtUtil.generateRefreshToken(email);

            // 5. Return new tokens
            return ResponseEntity.ok(
                    new AuthResponse(newAccessToken, newRefreshToken, email)
            );

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid refresh token.");
        }
    }

    // DELETE /api/auth/me
    // Permanently delete the signed-in user's account. Apple requires in-app
    // account deletion. Removes the user's saved and personal quotes first
    // (their user_id FKs are non-null), then the user — all in one transaction.
    @DeleteMapping("/me")
    @Transactional
    public ResponseEntity<?> deleteAccount(Authentication authentication) {

        String email = authentication.getName();
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOptional.get();
        savedQuoteRepository.deleteByUser(user);
        personalQuoteRepository.deleteByUser(user);
        userRepository.delete(user);

        return ResponseEntity.noContent().build(); // 204
    }

}