package com.example.beerspapasbackend.service;

import com.example.beerspapasbackend.model.Beer;
import com.example.beerspapasbackend.model.User;
import com.example.beerspapasbackend.repository.BeerRepository;
import com.example.beerspapasbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DataLoadService {

    @Autowired
    private BeerRepository beerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void loadSampleData() {
        // Cargar usuarios de ejemplo
        List<User> users = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            User user = new User();
            user.setUsername("user" + i);
            user.setEmail("user" + i + "@example.com");
            user.setPassword(passwordEncoder.encode("password" + i));
            user.setRole("USER");
            users.add(user);
        }
        userRepository.saveAll(users);

        // Cargar cervezas de ejemplo
        List<Beer> beers = new ArrayList<>();
        String[] beerNames = {"Corona", "Heineken", "Guinness", "Budweiser", "Stella Artois"};
        for (int i = 0; i < beerNames.length; i++) {
            Beer beer = new Beer();
            beer.setName(beerNames[i]);
            beer.setDescription("Descripción de " + beerNames[i]);
            beer.setAlcoholContent(4.0 + (i * 0.5));
            beer.setPrice(2.0 + (i * 0.5));
            beer.setImageUrl(beerNames[i].toLowerCase() + ".jpg");
            beers.add(beer);
        }
        beerRepository.saveAll(beers);
    }

    @Transactional
    public void loadBulkData(int numberOfRecords) {
        List<Beer> beers = new ArrayList<>();
        for (int i = 0; i < numberOfRecords; i++) {
            Beer beer = new Beer();
            beer.setName("Beer " + i);
            beer.setDescription("Description for beer " + i);
            beer.setAlcoholContent(4.0 + (i % 5) * 0.5);
            beer.setPrice(2.0 + (i % 10) * 0.5);
            beer.setImageUrl("beer" + i + ".jpg");
            beers.add(beer);
        }
        beerRepository.saveAll(beers);
    }
} 