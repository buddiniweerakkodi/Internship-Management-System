package com.example.demo.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String title;
    private String name;
    private String description;
    private List<String> techStack;
    private String deadline;
    private List<String> assignedInterns;
    private String status;
    private Integer progress = 0;

    public Project() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title != null ? title : name; }
    public void setTitle(String title) { 
        this.title = title; 
        this.name = title; 
    }

    public String getName() { return getTitle(); }
    public void setName(String name) { 
        this.name = name; 
        this.title = name; 
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getTechStack() { return techStack; }
    public void setTechStack(List<String> techStack) { this.techStack = techStack; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public List<String> getAssignedInterns() { return assignedInterns; }
    public void setAssignedInterns(List<String> assignedInterns) { this.assignedInterns = assignedInterns; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
}