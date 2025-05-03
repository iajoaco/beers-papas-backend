package com.example.beerspapasbackend.repository;

import com.example.beerspapasbackend.model.Rating;
import com.example.beerspapasbackend.model.User;
import com.example.beerspapasbackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);
} 