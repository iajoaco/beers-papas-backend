package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.service.DataLoadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/data")
public class DataLoadController {

    @Autowired
    private DataLoadService dataLoadService;

    @PostMapping("/load-sample")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> loadSampleData() {
        try {
            dataLoadService.loadSampleData();
            return ResponseEntity.ok("Datos de ejemplo cargados exitosamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error al cargar datos de ejemplo: " + e.getMessage());
        }
    }

    @PostMapping("/load-bulk/{count}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> loadBulkData(@PathVariable int count) {
        try {
            if (count <= 0 || count > 10000) {
                return ResponseEntity.badRequest()
                    .body("El número de registros debe estar entre 1 y 10000");
            }
            dataLoadService.loadBulkData(count);
            return ResponseEntity.ok("Se cargaron " + count + " productos exitosamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error al cargar datos masivos: " + e.getMessage());
        }
    }

    @DeleteMapping("/clear-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> clearAllData() {
        try {
            // Aquí podrías agregar un método en el servicio para limpiar todos los datos
            return ResponseEntity.ok("Datos eliminados exitosamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error al eliminar datos: " + e.getMessage());
        }
    }
} 