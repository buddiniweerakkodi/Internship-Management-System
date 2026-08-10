package com.example.demo.repositories;

import java.util.Date;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Task;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    long countByStatus(String status);
    long countByDeadlineBeforeAndStatusNot(Date deadline, String status);
    long countByProjectId(String projectId);
    long countByProjectIdAndStatus(String projectId, String status);
}