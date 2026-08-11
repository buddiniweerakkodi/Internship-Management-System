package com.example.demo.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.DailyLog;

@Repository
public interface DailyLogRepository extends MongoRepository<DailyLog, String> {
}