package com.example.beerspapasbackend.dto;

import lombok.Data;

@Data
public class NearbyProductResponse {
    private Long productId;
    private String name;
    private String description;
    private Double price;
    private Double averageRating;
    private Integer ratingCount;
    private String placeName;
    private String placeAddress;
    private Double distanceInKm;
    private Double latitude;
    private Double longitude;
    private String categoryName;
} 