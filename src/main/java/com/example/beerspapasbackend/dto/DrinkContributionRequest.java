package com.example.beerspapasbackend.dto;

import lombok.Data;

@Data
public class DrinkContributionRequest {
    private String drinkType; // One of: "Tercio", "Botellin", "Doble", "Caña", "Copa de vino", "Tinto de Verano", "Refrescos", "Sidra"
    private Double price;
    private String placeName;
    private Double volume; // Optional: Volume in liters (0.2, 0.3, 0.5, 1.0)
    private String volumeLabel; // Descriptive label like "Tercio", "Caña", etc.
    private String subtype; // Optional: Beer type (Rubia, Negra, Tostada, Especial)
} 