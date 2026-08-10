package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Project;
import com.example.demo.repositories.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project createProject(Project project) {
        if (project.getStatus() == null || project.getStatus().isEmpty()) {
            project.setStatus("In Progress");
        }
        if (project.getProgress() == null) {
            project.setProgress(0);
        }
        return projectRepository.save(project);
    }

    public Project updateProject(String id, Project projectDetails) {
        return projectRepository.findById(id).map(existingProject -> {
            existingProject.setTitle(projectDetails.getTitle());
            existingProject.setDescription(projectDetails.getDescription());
            existingProject.setTechStack(projectDetails.getTechStack());
            existingProject.setDeadline(projectDetails.getDeadline());
            existingProject.setAssignedInterns(projectDetails.getAssignedInterns());
            existingProject.setStatus(projectDetails.getStatus());
            if (projectDetails.getProgress() != null) {
                existingProject.setProgress(projectDetails.getProgress());
            }
            return projectRepository.save(existingProject);
        }).orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
}