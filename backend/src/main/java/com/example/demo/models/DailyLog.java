package com.example.demo.models;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "daily_logs")
public class DailyLog {
    @Id
    private String id;
    
    private Submission.InternSummary intern; 
    
    private LocalDateTime date;
    private String hoursWorked;
    private List<String> tasksCompleted;
    private List<String> challenges;
    private List<String> nextDayPlan;
    private String status; 

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Submission.InternSummary getIntern() { return intern; }
    public void setIntern(Submission.InternSummary intern) { this.intern = intern; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(String hoursWorked) { this.hoursWorked = hoursWorked; }

    public List<String> getTasksCompleted() { return tasksCompleted; }
    public void setTasksCompleted(List<String> tasksCompleted) { this.tasksCompleted = tasksCompleted; }

    public List<String> getChallenges() { return challenges; }
    public void setChallenges(List<String> challenges) { this.challenges = challenges; }

    public List<String> getNextDayPlan() { return nextDayPlan; }
    public void setNextDayPlan(List<String> nextDayPlan) { this.nextDayPlan = nextDayPlan; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
