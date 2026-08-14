package com.example.demo.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Task;
import com.example.demo.repositories.TaskRepository;

@RestController
@RequestMapping("/api/v1/tasks")
@CrossOrigin(origins = "http://localhost:3000") 
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task taskDetails) {
        return taskRepository.findById(id).map(task -> {
            if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
            if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription()); 
            if (taskDetails.getStatus() != null) task.setStatus(taskDetails.getStatus());
            if (taskDetails.getPriority() != null) task.setPriority(taskDetails.getPriority()); 
            if (taskDetails.getProjectId() != null) task.setProjectId(taskDetails.getProjectId());
            if (taskDetails.getAssigneeId() != null) task.setAssigneeId(taskDetails.getAssigneeId()); 
            if (taskDetails.getDeadline() != null) task.setDeadline(taskDetails.getDeadline());

            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable String id, @RequestBody Map<String, String> statusUpdate) {
        return taskRepository.findById(id).map(task -> {
            if (statusUpdate.containsKey("status")) {
                task.setStatus(statusUpdate.get("status"));
            }
            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}