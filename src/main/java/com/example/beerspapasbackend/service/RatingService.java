package com.example.beerspapasbackend.service;

import com.example.beerspapasbackend.dto.RatingRequest;
import com.example.beerspapasbackend.model.*;
import com.example.beerspapasbackend.repository.PlaceRepository;
import com.example.beerspapasbackend.repository.ProductRepository;
import com.example.beerspapasbackend.repository.RatingRepository;
import com.example.beerspapasbackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final PlaceRepository placeRepository;
    private final ProductRepository productRepository;

    public RatingService(RatingRepository ratingRepository,
                        UserRepository userRepository,
                        PlaceRepository placeRepository,
                        ProductRepository productRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.placeRepository = placeRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Rating createRating(RatingRequest ratingRequest) {
        // Obtener el usuario del token JWT
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(ratingRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Obtener el lugar del producto
        Place place = product.getPlace();

        // Buscar si ya existe una valoración de este usuario para este producto
        Rating rating = ratingRepository.findByUserAndProduct(user, product)
                .orElseGet(() -> {
                    Rating r = new Rating();
                    r.setUser(user);
                    r.setPlace(place);
                    r.setProduct(product);
                    return r;
                });
        rating.setRating(ratingRequest.getRating());
        rating.setComment(ratingRequest.getComment());

        Rating savedRating = ratingRepository.save(rating);

        // --- Actualizar producto ---
        Double avgProduct = ratingRepository.findAll().stream()
            .filter(r -> r.getProduct().getProductId().equals(product.getProductId()))
            .mapToDouble(Rating::getRating).average().orElse(0.0);
        long countProduct = ratingRepository.findAll().stream()
            .filter(r -> r.getProduct().getProductId().equals(product.getProductId())).count();
        product.setAverageRating(avgProduct);
        product.setRatingCount((int) countProduct);
        productRepository.save(product);

        // --- Actualizar local (place) ---
        Double avgPlace = ratingRepository.findAll().stream()
            .filter(r -> r.getPlace().getPlaceId().equals(place.getPlaceId()))
            .mapToDouble(Rating::getRating).average().orElse(0.0);
        long countPlace = ratingRepository.findAll().stream()
            .filter(r -> r.getPlace().getPlaceId().equals(place.getPlaceId())).count();
        place.setAverageRating(avgPlace);
        place.setRatingCount((int) countPlace);

        // rated_products_count: productos distintos valorados en este local
        long ratedProducts = ratingRepository.findAll().stream()
            .filter(r -> r.getPlace().getPlaceId().equals(place.getPlaceId()))
            .map(r -> r.getProduct().getProductId())
            .distinct().count();
        place.setRatedProductsCount((int) ratedProducts);
        placeRepository.save(place);

        // --- Actualizar usuario ---
        long countUser = ratingRepository.findAll().stream()
            .filter(r -> r.getUser().getUserId().equals(user.getUserId())).count();
        user.setRatingCount((int) countUser);

        // rated_places_count: lugares distintos valorados por el usuario
        long ratedPlaces = ratingRepository.findAll().stream()
            .filter(r -> r.getUser().getUserId().equals(user.getUserId()))
            .map(r -> r.getPlace().getPlaceId())
            .distinct().count();
        user.setRatedPlacesCount((int) ratedPlaces);
        userRepository.save(user);

        return savedRating;
    }
} 