package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.model.PlaceCategory;
import com.example.beerspapasbackend.repository.PlaceCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/place-categories")
public class PlaceCategoryController {
    private final PlaceCategoryRepository categoryRepository;

    public PlaceCategoryController(PlaceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @PostMapping
    public ResponseEntity<PlaceCategory> createCategory(@RequestBody PlaceCategory category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @GetMapping
    public ResponseEntity<List<PlaceCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaceCategory> getCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 