package com.example.beerspapasbackend.controller;

import com.example.beerspapasbackend.dto.BulkLoadRequest;
import com.example.beerspapasbackend.service.BulkLoadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bulk-load")
public class BulkLoadController {

    @Autowired
    private BulkLoadService bulkLoadService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> loadBulkData(@RequestBody BulkLoadRequest request) {
        Map<String, Object> result = bulkLoadService.loadBulkData(request);
        return ResponseEntity.ok(result);
    }
} 