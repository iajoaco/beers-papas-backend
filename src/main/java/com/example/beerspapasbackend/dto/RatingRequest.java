package com.example.beerspapasbackend.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private Long placeId;
    private Long productId;
    private Integer score;
    private String comment;
} 