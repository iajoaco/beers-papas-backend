package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.dto.LoginRequest;
import com.example.beerspapasbackend.dto.LoginResponse;
import com.example.beerspapasbackend.model.User;
import com.example.beerspapasbackend.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private static final String SECRET_KEY = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 horas

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            logger.debug("Intentando login para usuario: {}", loginRequest.getUsername());
            
            if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                logger.warn("Intento de login con credenciales nulas");
                return ResponseEntity.badRequest().body("Username and password are required");
            }

            User user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            if (user != null) {
                String token = generateToken(user);
                logger.debug("Token generado exitosamente para usuario: {}", user.getUsername());
                return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getUserId()));
            }

            logger.warn("Intento de login fallido para usuario: {}", loginRequest.getUsername());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            logger.error("Error durante el proceso de login", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "An error occurred during login");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    private String generateToken(User user) {
        logger.debug("Generando token para usuario: {}", user.getUsername());
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("userId", user.getUserId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }
} 