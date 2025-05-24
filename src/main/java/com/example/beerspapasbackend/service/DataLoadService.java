package com.example.beerspapasbackend.service;

import com.example.beerspapasbackend.model.*;
import com.example.beerspapasbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class DataLoadService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Transactional
    public void loadSampleData() {
        // Cargar categorías de productos
        List<ProductCategory> categories = createProductCategories();
        productCategoryRepository.saveAll(categories);

        // Cargar usuarios de ejemplo
        List<User> users = createSampleUsers();
        userRepository.saveAll(users);

        // Cargar lugares de ejemplo
        List<Place> places = createSamplePlaces();
        placeRepository.saveAll(places);

        // Cargar productos de ejemplo
        List<Product> products = createSampleProducts(places, categories);
        productRepository.saveAll(products);
    }

    private List<ProductCategory> createProductCategories() {
        List<ProductCategory> categories = new ArrayList<>();
        String[][] categoryData = {
            {"Cervezas", "Diferentes tipos de cervezas artesanales y comerciales"},
            {"Comidas", "Platos y snacks para acompañar las bebidas"},
            {"Bebidas", "Otras bebidas no alcohólicas"},
            {"Postres", "Dulces y postres"},
            {"Snacks", "Aperitivos y snacks"}
        };

        for (String[] data : categoryData) {
            ProductCategory category = new ProductCategory();
            category.setName(data[0]);
            category.setDescription(data[1]);
            categories.add(category);
        }
        return categories;
    }

    private List<User> createSampleUsers() {
        List<User> users = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            User user = new User();
            user.setUsername("user" + i);
            user.setEmail("user" + i + "@example.com");
            user.setPassword(passwordEncoder.encode("password" + i));
            user.setRole("USER");
            users.add(user);
        }
        return users;
    }

    private List<Place> createSamplePlaces() {
        List<Place> places = new ArrayList<>();
        String[][] placeData = {
            {"Bar Central", "Bar en el centro de la ciudad", 40.4168, -3.7038},
            {"Pub Moderno", "Pub con ambiente moderno", 40.4178, -3.7048},
            {"Restaurante Gourmet", "Restaurante de alta cocina", 40.4188, -3.7058}
        };

        for (String[] data : placeData) {
            Place place = new Place();
            place.setName(data[0]);
            place.setDescription(data[1]);
            place.setLatitude(Double.parseDouble(data[2]));
            place.setLongitude(Double.parseDouble(data[3]));
            places.add(place);
        }
        return places;
    }

    private List<Product> createSampleProducts(List<Place> places, List<ProductCategory> categories) {
        List<Product> products = new ArrayList<>();
        String[][] productData = {
            {"Corona Extra", "Cerveza lager clara y refrescante", "Cervezas", 2.50},
            {"Heineken", "Cerveza lager premium", "Cervezas", 2.80},
            {"Hamburguesa Clásica", "Hamburguesa con queso y bacon", "Comidas", 8.50},
            {"Nachos", "Nachos con queso y guacamole", "Snacks", 6.50},
            {"Coca-Cola", "Refresco de cola", "Bebidas", 2.00},
            {"Tiramisú", "Postre italiano", "Postres", 5.50}
        };

        for (String[] data : productData) {
            for (Place place : places) {
                Product product = new Product();
                product.setName(data[0]);
                product.setDescription(data[1]);
                product.setPlace(place);
                product.setCategory(categories.stream()
                    .filter(c -> c.getName().equals(data[2]))
                    .findFirst()
                    .orElse(categories.get(0)));
                product.setPrice(Double.parseDouble(data[3]));
                product.setLatitude(place.getLatitude());
                product.setLongitude(place.getLongitude());
                products.add(product);
            }
        }
        return products;
    }

    @Transactional
    public void loadBulkData(int numberOfRecords) {
        // Primero asegurarnos de que tenemos categorías
        List<ProductCategory> categories = productCategoryRepository.findAll();
        if (categories.isEmpty()) {
            categories = createProductCategories();
            productCategoryRepository.saveAll(categories);
        }

        // Obtener lugares existentes o crear uno por defecto
        List<Place> places = placeRepository.findAll();
        if (places.isEmpty()) {
            Place defaultPlace = new Place();
            defaultPlace.setName("Lugar por defecto");
            defaultPlace.setDescription("Lugar creado para carga masiva");
            defaultPlace.setLatitude(40.4168);
            defaultPlace.setLongitude(-3.7038);
            places = List.of(placeRepository.save(defaultPlace));
        }

        // Crear productos masivamente
        List<Product> products = new ArrayList<>();
        String[] productTypes = {"Producto", "Item", "Artículo", "Mercancía"};
        String[] adjectives = {"Premium", "Clásico", "Especial", "Gourmet", "Deluxe"};

        for (int i = 0; i < numberOfRecords; i++) {
            Product product = new Product();
            String type = productTypes[i % productTypes.length];
            String adjective = adjectives[i % adjectives.length];
            product.setName(type + " " + adjective + " " + i);
            product.setDescription("Descripción para " + product.getName());
            product.setPlace(places.get(i % places.size()));
            product.setCategory(categories.get(i % categories.size()));
            product.setPrice(5.0 + (random.nextDouble() * 20.0));
            product.setLatitude(product.getPlace().getLatitude());
            product.setLongitude(product.getPlace().getLongitude());
            products.add(product);
        }

        productRepository.saveAll(products);
    }
} 