package com.example.beerspapasbackend.repository;

import com.example.beerspapasbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRatingCountGreaterThan(Integer count);
    List<User> findByRatedPlacesCountGreaterThan(Integer count);
} 