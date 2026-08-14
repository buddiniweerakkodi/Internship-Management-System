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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Submission;
import com.example.demo.repositories.ProjectRepository;
import com.example.demo.repositories.SubmissionRepository;
import com.example.demo.repositories.TaskRepository;
import com.example.demo.repositories.UserRepository;

@RestController
@RequestMapping("/api/v1/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public List<Submission> getAllSubmissions() {
        List<Submission> submissions = submissionRepository.findAll();
        for (Submission sub : submissions) {
            enrichAndSaveSubmission(sub);
        }
        return submissions;
    }

    @PostMapping
    public Submission createSubmission(@RequestBody Submission submission) {
        submission.setSubmittedAt(LocalDateTime.now());
        if (submission.getStatus() == null) {
            submission.setStatus("PENDING_REVIEW");
        }

        enrichSubmission(submission);

        Submission savedSubmission = submissionRepository.save(submission);

        // Task status update
        if (submission.getTaskId() != null) {
            taskRepository.findById(submission.getTaskId()).ifPresent(task -> {
                task.setStatus("SUBMITTED");
                taskRepository.save(task);
            });
        }

        return savedSubmission;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Submission> updateSubmission(@PathVariable String id, @RequestBody Submission updatedSubmission) {
        return submissionRepository.findById(id).map(existing -> {
            if (updatedSubmission.getGithubUrl() != null) {
                existing.setGithubUrl(updatedSubmission.getGithubUrl());
            }
            if (updatedSubmission.getDocUrl() != null) {
                existing.setDocUrl(updatedSubmission.getDocUrl());
            }
            if (updatedSubmission.getCompletionNotes() != null) {
                existing.setCompletionNotes(updatedSubmission.getCompletionNotes());
            }

            existing.setStatus("PENDING_REVIEW");
            existing.setSubmittedAt(LocalDateTime.now());

            enrichSubmission(existing);

            if (existing.getTaskId() != null) {
                taskRepository.findById(existing.getTaskId()).ifPresent(task -> {
                    task.setStatus("SUBMITTED");
                    taskRepository.save(task);
                });
            }

            Submission saved = submissionRepository.save(existing);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Submission> updateSubmissionStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return submissionRepository.findById(id).map(submission -> {
            String newStatus = payload.get("status");
            submission.setStatus(newStatus);
            submission.setFeedback(payload.get("feedback"));
            
            if (submission.getTaskId() != null && newStatus != null) {
                taskRepository.findById(submission.getTaskId()).ifPresent(task -> {
                    if ("Approved".equalsIgnoreCase(newStatus) || "APPROVED".equalsIgnoreCase(newStatus) || "COMPLETED".equalsIgnoreCase(newStatus)) {
                        task.setStatus("COMPLETED");
                    } else if ("Rejected".equalsIgnoreCase(newStatus) || "REVISION_REQUIRED".equalsIgnoreCase(newStatus)) {
                        task.setStatus("REVISION_REQUIRED");
                    }
                    taskRepository.save(task);
                });
            }

            return ResponseEntity.ok(submissionRepository.save(submission));
        }).orElse(ResponseEntity.notFound().build());
    }

    private boolean enrichSubmission(Submission sub) {
        boolean isModified = false;

        // Fill Intern details if partially present
        if (sub.getIntern() != null && sub.getIntern().getId() != null) {
            userRepository.findById(sub.getIntern().getId()).ifPresent(user -> {
                if (sub.getIntern().getFullName() == null) sub.getIntern().setFullName(user.getFullName());
                if (sub.getIntern().getAvatar() == null) sub.getIntern().setAvatar(user.getAvatar());
                if (sub.getIntern().getRole() == null) sub.getIntern().setRole(user.getRole());
            });
        }

        // Fill Intern details via Task assignee if Intern object is missing
        if (sub.getIntern() == null && sub.getTaskId() != null) {
            taskRepository.findById(sub.getTaskId()).ifPresent(task -> {
                String assigneeId = task.getAssigneeId();
                if (assigneeId != null) {
                    userRepository.findById(assigneeId).ifPresent(user -> {
                        Submission.InternSummary internSummary = new Submission.InternSummary();
                        internSummary.setId(user.getId());
                        internSummary.setFullName(user.getFullName());
                        internSummary.setAvatar(user.getAvatar());
                        internSummary.setRole(user.getRole());
                        sub.setIntern(internSummary);
                    });
                }
            });
            isModified = true;
        }

        // Fill Project details
        if (sub.getTaskId() != null && (sub.getProject() == null || sub.getProject().getName() == null)) {
            taskRepository.findById(sub.getTaskId()).ifPresent(task -> {
                if (task.getProjectId() != null) {
                    projectRepository.findById(task.getProjectId()).ifPresent(proj -> {
                        Submission.ProjectSummary projSummary = sub.getProject() != null ? sub.getProject() : new Submission.ProjectSummary();
                        projSummary.setId(proj.getId());
                        projSummary.setName(proj.getName() != null ? proj.getName() : proj.getTitle());
                        sub.setProject(projSummary);
                    });
                }
                if (sub.getTaskTitle() == null) {
                    sub.setTaskTitle(task.getTitle());
                }
            });
            isModified = true;
        }

        return isModified;
    }

    private void enrichAndSaveSubmission(Submission sub) {
        if (enrichSubmission(sub)) {
            submissionRepository.save(sub); 
        }
    }
}