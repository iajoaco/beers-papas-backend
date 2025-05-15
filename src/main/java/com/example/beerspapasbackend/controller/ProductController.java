package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.dto.DrinkContributionRequest;
import com.example.beerspapasbackend.dto.NearbyProductResponse;
import com.example.beerspapasbackend.dto.NearbyProductSearchRequest;
import com.example.beerspapasbackend.dto.ProductRequest;
import com.example.beerspapasbackend.model.Product;
import com.example.beerspapasbackend.model.Place;
import com.example.beerspapasbackend.model.ProductCategory;
import com.example.beerspapasbackend.repository.ProductRepository;
import com.example.beerspapasbackend.repository.PlaceRepository;
import com.example.beerspapasbackend.repository.ProductCategoryRepository;
import com.example.beerspapasbackend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository productRepository;
    private final PlaceRepository placeRepository;
    private final ProductCategoryRepository categoryRepository;
    private static final List<String> VALID_DRINK_TYPES = Arrays.asList(
        "Cerveza", "Sidra", "Tinto", "Vino"
    );

    @Autowired
    private ProductService productService;

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
        product.setLatitude(request.getLatitude());
        product.setLongitude(request.getLongitude());

        return ResponseEntity.ok(productRepository.save(product));
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productService.getProduct(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<Product>> getProductsByPlace(@PathVariable Long placeId) {
        return ResponseEntity.ok(productService.getProductsByPlace(placeId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @PostMapping("/nearby")
    public ResponseEntity<List<NearbyProductResponse>> searchNearbyProducts(
            @RequestBody NearbyProductSearchRequest request) {
        System.out.println("Buscando productos cercanos con parámetros: " + request);
        
        // Validar parámetros de precio
        if (request.getMinPrice() != null && request.getMaxPrice() != null 
            && request.getMinPrice() > request.getMaxPrice()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Product> products = productService.findNearbyProducts(
            request.getSearchTerm(),
            request.getLatitude(),
            request.getLongitude(),
            request.getRadiusInKm(),
            request.getMinPrice(),
            request.getMaxPrice(),
            request.getCategoryId()
        );
        
        System.out.println("Productos encontrados: " + products.size());

        List<NearbyProductResponse> response = products.stream()
            .map(product -> {
                NearbyProductResponse nearbyProduct = new NearbyProductResponse();
                nearbyProduct.setProductId(product.getProductId());
                nearbyProduct.setName(product.getName());
                nearbyProduct.setDescription(product.getDescription());
                nearbyProduct.setPrice(product.getPrice());
                nearbyProduct.setAverageRating(product.getAverageRating());
                nearbyProduct.setRatingCount(product.getRatingCount());
                nearbyProduct.setPlaceName(product.getPlace().getName());
                nearbyProduct.setPlaceAddress(product.getPlace().getAddress());
                nearbyProduct.setLatitude(product.getLatitude());
                nearbyProduct.setLongitude(product.getLongitude());
                nearbyProduct.setCategoryName(product.getCategory().getName());
                
                // Calcular distancia
                double distance = calculateDistance(
                    request.getLatitude(),
                    request.getLongitude(),
                    product.getLatitude(),
                    product.getLongitude()
                );
                nearbyProduct.setDistanceInKm(distance);
                
                return nearbyProduct;
            })
            .collect(Collectors.toList());

        System.out.println("Respuesta preparada con " + response.size() + " productos");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> getProductsByNameAndPlace(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String place) {
        if (name != null && place != null) {
            return ResponseEntity.ok(productRepository.findByNameAndPlaceName(name, place));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ProductCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/contribute")
    public ResponseEntity<?> contributeDrinkPrice(@RequestBody DrinkContributionRequest request) {
        // Validate drink type
        if (!VALID_DRINK_TYPES.contains(request.getDrinkType())) {
            return ResponseEntity.badRequest().body("Invalid drink type. Must be one of: " + VALID_DRINK_TYPES);
        }

        // Find the place by name
        Place place = placeRepository.findByName(request.getPlaceName())
                .orElseThrow(() -> new RuntimeException("Place not found"));

        // Get the drinks category
        ProductCategory drinksCategory = categoryRepository.findByName("Bebidas")
                .orElseThrow(() -> new RuntimeException("Drinks category not found"));

        // Format product name with volume
        String productName = String.format("%s(%s)", request.getDrinkType(), request.getVolume());

        // Check if product already exists
        List<Product> existingProducts = productRepository.findByNameAndPlaceName(productName, request.getPlaceName());
        
        if (!existingProducts.isEmpty()) {
            // Update existing product price
            Product existingProduct = existingProducts.get(0);
            existingProduct.setPrice(request.getPrice());
            // Update description with subtype and volume
            if (request.getSubtype() != null) {
                existingProduct.setDescription(String.format("%s %sL", request.getSubtype(), request.getVolume()));
            }
            return ResponseEntity.ok(productRepository.save(existingProduct));
        } else {
            // Create new product
            Product newProduct = new Product();
            newProduct.setName(productName);
            newProduct.setPrice(request.getPrice());
            newProduct.setPlace(place);
            newProduct.setCategory(drinksCategory);
            newProduct.setLatitude(place.getLatitude());
            newProduct.setLongitude(place.getLongitude());
            
            // Set description with subtype and volume
            if (request.getSubtype() != null) {
                newProduct.setDescription(String.format("%s %sL", request.getSubtype(), request.getVolume()));
            }
            
            return ResponseEntity.ok(productRepository.save(newProduct));
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radio de la Tierra en kilómetros

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
} 