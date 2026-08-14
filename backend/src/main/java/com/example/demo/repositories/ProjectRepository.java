package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Project;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    long countByStatus(String status);
    List<Project> findByStatus(String status);
    
    List<Project> findByAssignedInternsContaining(String internId);
}