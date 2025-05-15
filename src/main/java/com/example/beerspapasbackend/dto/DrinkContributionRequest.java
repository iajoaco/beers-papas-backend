package com.example.beerspapasbackend.dto;

import lombok.Data;

@Data
public class DrinkContributionRequest {
    private String drinkType; // One of: "Tercio", "Botellin", "Doble", "Caña", "Copa de vino", "Tinto de Verano", "Refrescos", "Sidra"
    private Double price;
    private String placeName;
} 