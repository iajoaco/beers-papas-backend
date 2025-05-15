package com.example.beerspapasbackend.repository;

import com.example.beerspapasbackend.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByCategoryCategoryId(Long categoryId);
    Optional<Place> findByName(String name);
} 