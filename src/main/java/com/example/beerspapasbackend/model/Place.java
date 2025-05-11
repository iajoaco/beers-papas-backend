package com.example.beerspapasbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "places")
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "place_id")
    private Long placeId;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private PlaceCategory category;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false, columnDefinition = "DECIMAL(10,8)")
    private Double latitude;

    @Column(nullable = false, columnDefinition = "DECIMAL(11,8)")
    private Double longitude;

    private String phone;
    private String email;
    private String website;

    @Column(name = "opening_hours", columnDefinition = "TEXT")
    private String openingHours;

    @Column(name = "rated_products_count")
    private Integer ratedProductsCount = 0;

    @Column(name = "average_rating", columnDefinition = "DECIMAL(3,2)")
    private Double averageRating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 