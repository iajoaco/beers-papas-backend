package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.dto.RatingRequest;
import com.example.beerspapasbackend.model.Rating;
import com.example.beerspapasbackend.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> createRating(
            @RequestHeader("X-Username") String username,
            @RequestBody RatingRequest ratingRequest) {
        Rating rating = ratingService.createRating(username, ratingRequest);
        return ResponseEntity.ok(rating);
    }
} 