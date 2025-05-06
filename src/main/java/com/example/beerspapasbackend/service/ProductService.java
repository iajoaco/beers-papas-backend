package com.example.beerspapasbackend.service;

import com.example.beerspapasbackend.model.Product;
import com.example.beerspapasbackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProduct(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByPlace(Long placeId) {
        return productRepository.findByPlacePlaceId(placeId);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryProductCategoryId(categoryId);
    }

    public List<Product> findNearbyProducts(String searchTerm, Double latitude, Double longitude, Double radiusInKm) {
        return productRepository.findNearbyProducts(searchTerm, latitude, longitude, radiusInKm);
    }
} 