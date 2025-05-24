package com.example.beerspapasbackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BulkLoadRequest {
    private List<PlaceData> places;
    private List<ProductData> products;

    @Data
    public static class PlaceData {
        private String name;
        private String description;
        private String address;
        private Double latitude;
        private Double longitude;
        private String phone;
        private String email;
        private String website;
        private String openingHours;
        private String categoryName;
    }

    @Data
    public static class ProductData {
        private String name;
        private String description;
        private Double price;
        private String placeName;
        private String categoryName;
        private Double latitude;
        private Double longitude;
    }
} 