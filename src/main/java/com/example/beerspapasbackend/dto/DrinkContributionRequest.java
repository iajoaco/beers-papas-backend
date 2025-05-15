package com.example.beerspapasbackend.dto;

import lombok.Data;

@Data
public class DrinkContributionRequest {
    private String drinkType; // One of: "Cerveza", "Sidra", "Tinto", "Vino", "Refresco"
    private Double price;
    private String placeName;
    private Double volume; // Optional: Volume in liters (0.2, 0.3, 0.5, 1.0)
    private String volumeLabel; // Descriptive label like "Tercio", "Caña", etc.
    private String subtype; // Optional: Beer type (Rubia, Negra, Tostada, Especial)
} 