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
    public ResponseEntity<?> createRating(@RequestBody RatingRequest ratingRequest) {
        try {
            if (ratingRequest.getProductId() == null) {
                return ResponseEntity.badRequest().body("El ID del producto es requerido");
            }

            if (ratingRequest.getRating() == null || ratingRequest.getRating() < 1 || ratingRequest.getRating() > 5) {
                return ResponseEntity.badRequest().body("La valoración debe estar entre 1 y 5");
            }

            Rating rating = ratingService.createRating(ratingRequest);
            return ResponseEntity.ok(rating);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al crear la valoración: " + e.getMessage());
        }
    }
} 