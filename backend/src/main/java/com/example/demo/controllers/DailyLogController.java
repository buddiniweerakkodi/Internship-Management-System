package com.example.demo.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.DailyLog;
import com.example.demo.repositories.DailyLogRepository;

@RestController
@RequestMapping("/api/v1/daily-logs")
public class DailyLogController {

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @GetMapping
    public List<DailyLog> getAllLogs() {
        return dailyLogRepository.findAll();
    }

    @PostMapping
    public DailyLog createLog(@RequestBody DailyLog log) {
        if (log.getDate() == null) {
            log.setDate(LocalDateTime.now());
        }
        if (log.getStatus() == null) {
            log.setStatus("Pending Review");
        }
        return dailyLogRepository.save(log);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DailyLog> updateLogStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return dailyLogRepository.findById(id).map(log -> {
            log.setStatus(payload.get("status"));
            return ResponseEntity.ok(dailyLogRepository.save(log));
        }).orElse(ResponseEntity.notFound().build());
    }
}