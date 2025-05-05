package com.example.beerspapasbackend.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private Long productId;
    private Double rating;
    private String comment;
} 