package com.example.beerspapasbackend.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Long placeId;
    private Long categoryId;
} 