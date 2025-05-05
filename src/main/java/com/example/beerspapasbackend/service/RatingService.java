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

        Rating rating = new Rating();
        rating.setUser(user);
        rating.setPlace(place);
        rating.setProduct(product);
        rating.setRating(ratingRequest.getRating());
        rating.setComment(ratingRequest.getComment());

        return ratingRepository.save(rating);
    }
} 