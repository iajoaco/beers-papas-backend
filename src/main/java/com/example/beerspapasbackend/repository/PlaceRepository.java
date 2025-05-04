package com.example.beerspapasbackend.repository;

import com.example.beerspapasbackend.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByCategoryCategoryId(Long categoryId);
} 