package com.example.demo.controllers;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
import com.example.demo.models.Submission;
import com.example.demo.repositories.DailyLogRepository;
import com.example.demo.repositories.UserRepository;

@RestController
@RequestMapping("/api/v1/daily-logs")
public class DailyLogController {

    @Autowired
    private DailyLogRepository dailyLogRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<DailyLog> getAllLogs() {
        return dailyLogRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<DailyLog> createLog(@RequestBody Map<String, Object> payload) {
        DailyLog log = new DailyLog();

        // 1. Parse Hours Worked
        if (payload.get("hoursWorked") != null) {
            log.setHoursWorked(String.valueOf(payload.get("hoursWorked")));
        } else if (payload.get("hours") != null) {
            log.setHoursWorked(String.valueOf(payload.get("hours")));
        } else {
            log.setHoursWorked("8");
        }

        // 2. Parse Tasks Completed 
        Object completedWorkObj = payload.get("completedWork");
        if (completedWorkObj == null) {
            completedWorkObj = payload.get("tasksCompleted");
        }
        log.setTasksCompleted(parseListOrString(completedWorkObj));

        // 3. Parse Challenges
        Object challengesObj = payload.get("challenges");
        if (challengesObj == null) {
            challengesObj = payload.get("blockers");
        }
        log.setChallenges(parseListOrString(challengesObj));

        // 4. Parse Next Day Plan
        Object planObj = payload.get("nextDayPlan");
        if (planObj == null) {
            planObj = payload.get("plan");
        }
        log.setNextDayPlan(parseListOrString(planObj));

        // 5. Parse Status
        if (payload.get("status") != null) {
            log.setStatus(String.valueOf(payload.get("status")));
        } else {
            log.setStatus("Pending Review");
        }

        // 6. Safe Date Parsing
        if (payload.get("date") != null) {
            try {
                String dateStr = String.valueOf(payload.get("date"));
                if (dateStr.contains("T")) {
                    log.setDate(LocalDateTime.parse(dateStr.substring(0, 19)));
                } else if (dateStr.matches("\\d{4}-\\d{2}-\\d{2}")) {
                    log.setDate(LocalDateTime.parse(dateStr + "T00:00:00"));
                } else {
                    log.setDate(LocalDateTime.now());
                }
            } catch (Exception e) {
                log.setDate(LocalDateTime.now());
            }
        } else {
            log.setDate(LocalDateTime.now());
        }

        // 7. Parse & Enrich Intern Details
        if (payload.get("intern") != null && payload.get("intern") instanceof Map) {
            Map<?, ?> internMap = (Map<?, ?>) payload.get("intern");
            Submission.InternSummary internSummary = new Submission.InternSummary();
            if (internMap.get("id") != null) internSummary.setId(String.valueOf(internMap.get("id")));
            if (internMap.get("fullName") != null) internSummary.setFullName(String.valueOf(internMap.get("fullName")));
            if (internMap.get("avatar") != null) internSummary.setAvatar(String.valueOf(internMap.get("avatar")));
            if (internMap.get("role") != null) internSummary.setRole(String.valueOf(internMap.get("role")));
            
            if (internSummary.getId() != null && internSummary.getFullName() == null) {
                userRepository.findById(internSummary.getId()).ifPresent(user -> {
                    internSummary.setFullName(user.getFullName());
                    internSummary.setAvatar(user.getAvatar());
                    internSummary.setRole(user.getRole());
                });
            }
            log.setIntern(internSummary);
        } else if (payload.get("internId") != null) {
            String internId = String.valueOf(payload.get("internId"));
            userRepository.findById(internId).ifPresent(user -> {
                Submission.InternSummary internSummary = new Submission.InternSummary();
                internSummary.setId(user.getId());
                internSummary.setFullName(user.getFullName());
                internSummary.setAvatar(user.getAvatar());
                internSummary.setRole(user.getRole());
                log.setIntern(internSummary);
            });
        }

        DailyLog saved = dailyLogRepository.save(log);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DailyLog> updateLogStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return dailyLogRepository.findById(id).map(log -> {
            if (payload.containsKey("status")) {
                log.setStatus(payload.get("status"));
            }
            if (payload.containsKey("feedback")) {
                log.setFeedback(payload.get("feedback"));
            }
            return ResponseEntity.ok(dailyLogRepository.save(log));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Helper method to convert String or List into List<String>
    private List<String> parseListOrString(Object obj) {
        List<String> list = new ArrayList<>();
        if (obj == null) return list;

        if (obj instanceof List) {
            for (Object item : (List<?>) obj) {
                if (item != null && !String.valueOf(item).trim().isEmpty()) {
                    list.add(String.valueOf(item).trim());
                }
            }
        } else if (obj instanceof String) {
            String str = (String) obj;
            if (!str.trim().isEmpty()) {
                list.add(str.trim());
            }
        }
        return list;
    }
}