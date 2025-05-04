package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.model.Product;
import com.example.beerspapasbackend.repository.ProductRepository;
import com.example.beerspapasbackend.repository.PlaceRepository;
import com.example.beerspapasbackend.repository.ProductCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository productRepository;
    private final PlaceRepository placeRepository;
    private final ProductCategoryRepository categoryRepository;

    public ProductController(ProductRepository productRepository,
                           PlaceRepository placeRepository,
                           ProductCategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.placeRepository = placeRepository;
        this.categoryRepository = categoryRepository;
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Verificar que el lugar existe
        if (!placeRepository.existsById(product.getPlace().getPlaceId())) {
            return ResponseEntity.badRequest().build();
        }

        // Verificar que la categoría existe si se proporciona
        if (product.getCategory() != null && 
            !categoryRepository.existsById(product.getCategory().getProductCategoryId())) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<Product>> getProductsByPlace(@PathVariable Long placeId) {
        return ResponseEntity.ok(productRepository.findByPlacePlaceId(placeId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productRepository.findByCategoryProductCategoryId(categoryId));
    }
} 