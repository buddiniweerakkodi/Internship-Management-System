package com.example.demo.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;

@RestController
@RequestMapping("/api/v1/interns")
@CrossOrigin(origins = "http://localhost:3000")
public class InternController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // 1. Get all interns
    @GetMapping
    public ResponseEntity<List<User>> getAllInterns() {
        List<User> interns = userRepository.findByRole("INTERN");
        return ResponseEntity.ok(interns);
    }

    // 2. Add new intern
    @PostMapping
    public ResponseEntity<?> addIntern(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        User intern = new User();
        intern.setFullName(payload.get("fullName"));
        intern.setEmail(email);
        intern.setPassword(passwordEncoder.encode(payload.get("password")));
        intern.setRole("INTERN");
        intern.setActive(true);
        intern.setAssignedProjectId(payload.get("projectId"));

        userRepository.save(intern);
        return ResponseEntity.ok(intern);
    }

    // 3. Update existing intern
    @PutMapping("/{id}")
    public ResponseEntity<?> updateIntern(@PathVariable String id, @RequestBody Map<String, String> payload) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User intern = optionalUser.get();
        intern.setFullName(payload.get("fullName"));
        intern.setEmail(payload.get("email"));
        if (payload.get("password") != null && !payload.get("password").trim().isEmpty()) {
            intern.setPassword(passwordEncoder.encode(payload.get("password")));
        }
        intern.setAssignedProjectId(payload.get("projectId"));

        userRepository.save(intern);
        return ResponseEntity.ok(intern);
    }

    // 4. Toggle Active/Inactive Status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable String id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User intern = optionalUser.get();
        intern.setActive(!intern.isActive());
        userRepository.save(intern);
        return ResponseEntity.ok(intern);
    }
}