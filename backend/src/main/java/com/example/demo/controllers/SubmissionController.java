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

import com.example.demo.models.Submission;
import com.example.demo.repositories.SubmissionRepository;
import com.example.demo.repositories.TaskRepository;

@RestController
@RequestMapping("/api/v1/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    @PostMapping
    public Submission createSubmission(@RequestBody Submission submission) {
        submission.setSubmittedAt(LocalDateTime.now());
        if (submission.getStatus() == null) {
            submission.setStatus("Pending Review");
        }
        return submissionRepository.save(submission);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Submission> updateSubmissionStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return submissionRepository.findById(id).map(submission -> {
            String newStatus = payload.get("status");
            submission.setStatus(newStatus);
            submission.setFeedback(payload.get("feedback"));
            
            if ("Approved".equalsIgnoreCase(newStatus) && submission.getTaskId() != null) {
                taskRepository.findById(submission.getTaskId()).ifPresent(task -> {
                    task.setStatus("COMPLETED");
                    taskRepository.save(task);
                });
            }

            return ResponseEntity.ok(submissionRepository.save(submission));
        }).orElse(ResponseEntity.notFound().build());
    }
}