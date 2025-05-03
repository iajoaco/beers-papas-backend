package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.dto.LoginRequest;
import com.example.beerspapasbackend.model.User;
import com.example.beerspapasbackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.findByUsername(loginRequest.getUsername());
        return ResponseEntity.ok(user);
    }
} 