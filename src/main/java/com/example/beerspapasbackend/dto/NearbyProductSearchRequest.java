package com.example.beerspapasbackend.dto;

import lombok.Data;

@Data
public class NearbyProductSearchRequest {
    private String searchTerm;
    private Double latitude;
    private Double longitude;
    private Double radiusInKm;
    private Double minPrice;
    private Double maxPrice;
    private Long categoryId;
} 