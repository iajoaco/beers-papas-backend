package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.dto.ProductRequest;
import com.example.beerspapasbackend.model.Product;
import com.example.beerspapasbackend.model.Place;
import com.example.beerspapasbackend.model.ProductCategory;
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
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest request) {
        // Verificar que el lugar existe
        Place place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() -> new RuntimeException("Place not found"));

        // Verificar que la categoría existe
        ProductCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setPlace(place);
        product.setCategory(category);

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