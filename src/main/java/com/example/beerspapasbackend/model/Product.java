package com.example.beerspapasbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "products", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"place_id", "name"}))
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @ManyToOne
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "product_category_id")
    private ProductCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "DECIMAL(10,2)")
    private Double price;

    @Column(name = "average_rating", columnDefinition = "DECIMAL(3,2)")
    private Double averageRating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(nullable = false, columnDefinition = "DECIMAL(10,8)")
    private Double latitude;

    @Column(nullable = false, columnDefinition = "DECIMAL(11,8)")
    private Double longitude;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 