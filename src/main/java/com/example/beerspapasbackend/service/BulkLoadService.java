package com.example.beerspapasbackend.service;

import com.example.beerspapasbackend.dto.BulkLoadRequest;
import com.example.beerspapasbackend.model.*;
import com.example.beerspapasbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BulkLoadService {

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PlaceCategoryRepository placeCategoryRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Transactional
    public Map<String, Object> loadBulkData(BulkLoadRequest request) {
        Map<String, Object> result = new HashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        // Procesar lugares
        Map<String, Place> processedPlaces = new HashMap<>();
        if (request.getPlaces() != null && !request.getPlaces().isEmpty()) {
            for (BulkLoadRequest.PlaceData placeData : request.getPlaces()) {
                try {
                    Place place = processPlace(placeData);
                    processedPlaces.put(place.getName(), place);
                } catch (Exception e) {
                    errors.add("Error procesando lugar " + placeData.getName() + ": " + e.getMessage());
                }
            }
        }

        // Procesar productos
        int productsProcessed = 0;
        if (request.getProducts() != null && !request.getProducts().isEmpty()) {
            for (BulkLoadRequest.ProductData productData : request.getProducts()) {
                try {
                    if (processProduct(productData, processedPlaces)) {
                        productsProcessed++;
                    } else {
                        warnings.add("No se pudo procesar el producto " + productData.getName() + 
                                   " - Lugar no encontrado: " + productData.getPlaceName());
                    }
                } catch (Exception e) {
                    errors.add("Error procesando producto " + productData.getName() + ": " + e.getMessage());
                }
            }
        }

        result.put("placesProcessed", processedPlaces.size());
        result.put("productsProcessed", productsProcessed);
        result.put("errors", errors);
        result.put("warnings", warnings);

        return result;
    }

    private Place processPlace(BulkLoadRequest.PlaceData placeData) {
        // Verificar si el lugar ya existe
        Optional<Place> existingPlace = placeRepository.findByName(placeData.getName());
        if (existingPlace.isPresent()) {
            return existingPlace.get();
        }

        // Obtener o crear la categoría del lugar
        PlaceCategory category = placeCategoryRepository.findByName(placeData.getCategoryName())
                .orElseGet(() -> {
                    PlaceCategory newCategory = new PlaceCategory();
                    newCategory.setName(placeData.getCategoryName());
                    newCategory.setDescription("Categoría creada automáticamente");
                    return placeCategoryRepository.save(newCategory);
                });

        // Crear nuevo lugar
        Place place = new Place();
        place.setName(placeData.getName());
        place.setDescription(placeData.getDescription());
        place.setAddress(placeData.getAddress());
        place.setLatitude(placeData.getLatitude());
        place.setLongitude(placeData.getLongitude());
        place.setPhone(placeData.getPhone());
        place.setEmail(placeData.getEmail());
        place.setWebsite(placeData.getWebsite());
        place.setOpeningHours(placeData.getOpeningHours());
        place.setCategory(category);

        return placeRepository.save(place);
    }

    private boolean processProduct(BulkLoadRequest.ProductData productData, Map<String, Place> processedPlaces) {
        // Verificar si el lugar existe
        Place place = processedPlaces.get(productData.getPlaceName());
        if (place == null) {
            return false;
        }

        // Obtener o crear la categoría del producto
        ProductCategory category = productCategoryRepository.findByName(productData.getCategoryName())
                .orElseGet(() -> {
                    ProductCategory newCategory = new ProductCategory();
                    newCategory.setName(productData.getCategoryName());
                    newCategory.setDescription("Categoría creada automáticamente");
                    return productCategoryRepository.save(newCategory);
                });

        // Verificar si el producto ya existe en el lugar
        List<Product> existingProducts = productRepository.findByNameAndPlaceName(
            productData.getName(), productData.getPlaceName());
        
        if (!existingProducts.isEmpty()) {
            // Actualizar producto existente
            Product existingProduct = existingProducts.get(0);
            existingProduct.setDescription(productData.getDescription());
            existingProduct.setPrice(productData.getPrice());
            existingProduct.setCategory(category);
            if (productData.getLatitude() != null && productData.getLongitude() != null) {
                existingProduct.setLatitude(productData.getLatitude());
                existingProduct.setLongitude(productData.getLongitude());
            }
            productRepository.save(existingProduct);
        } else {
            // Crear nuevo producto
            Product product = new Product();
            product.setName(productData.getName());
            product.setDescription(productData.getDescription());
            product.setPrice(productData.getPrice());
            product.setPlace(place);
            product.setCategory(category);
            product.setLatitude(productData.getLatitude() != null ? 
                productData.getLatitude() : place.getLatitude());
            product.setLongitude(productData.getLongitude() != null ? 
                productData.getLongitude() : place.getLongitude());
            productRepository.save(product);
        }

        return true;
    }
} 