package com.example.beerspapasbackend.repository;

import com.example.beerspapasbackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByPlacePlaceId(Long placeId);
    List<Product> findByCategoryProductCategoryId(Long categoryId);
    
    @Query(value = """
        SELECT p.* FROM products p
        WHERE (:searchTerm IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
        AND (:categoryId IS NULL OR p.product_category_id = :categoryId)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND (
            6371 * acos(
                cos(radians(:latitude)) * 
                cos(radians(p.latitude)) * 
                cos(radians(p.longitude) - radians(:longitude)) + 
                sin(radians(:latitude)) * 
                sin(radians(p.latitude))
            )
        ) <= :radiusInKm
        ORDER BY p.price ASC
    """, nativeQuery = true)
    List<Product> findNearbyProducts(
        @Param("searchTerm") String searchTerm,
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("radiusInKm") Double radiusInKm,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice,
        @Param("categoryId") Long categoryId
    );

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND LOWER(p.place.name) LIKE LOWER(CONCAT('%', :place, '%'))")
    List<Product> findByNameAndPlaceName(@Param("name") String name, @Param("place") String place);
} 