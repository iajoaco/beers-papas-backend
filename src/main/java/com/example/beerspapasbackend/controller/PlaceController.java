package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.model.Place;
import com.example.beerspapasbackend.repository.PlaceRepository;
import com.example.beerspapasbackend.repository.PlaceCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
public class PlaceController {
    private final PlaceRepository placeRepository;
    private final PlaceCategoryRepository categoryRepository;

    public PlaceController(PlaceRepository placeRepository,
                         PlaceCategoryRepository categoryRepository) {
        this.placeRepository = placeRepository;
        this.categoryRepository = categoryRepository;
    }

    @PostMapping
    public ResponseEntity<Place> createPlace(@RequestBody Place place) {
        // Verificar que la categoría existe
        if (!categoryRepository.existsById(place.getCategory().getCategoryId())) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(placeRepository.save(place));
    }

    @GetMapping
    public ResponseEntity<List<Place>> getAllPlaces() {
        return ResponseEntity.ok(placeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlace(@PathVariable Long id) {
        return placeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Place>> getPlacesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(placeRepository.findByCategoryCategoryId(categoryId));
    }
} 