package com.example.demo.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DashboardSummaryDTO;
import com.example.demo.models.Project;
import com.example.demo.repositories.ProjectRepository;
import com.example.demo.repositories.TaskRepository;
import com.example.demo.repositories.UserRepository;

@Service
public class AdminDashboardService {

    @Autowired private UserRepository userRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private TaskRepository taskRepository;

    public DashboardSummaryDTO getDashboardSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();

        summary.setActiveInterns(userRepository.countByRoleAndActive("INTERN", true));
        summary.setActiveProjects(projectRepository.countByStatus("IN_PROGRESS"));
        summary.setPendingSubmissions(taskRepository.countByStatus("SUBMITTED"));
        
        summary.setOverdueTasks(taskRepository.countByDeadlineBeforeAndStatusNot(LocalDate.now(), "COMPLETED"));
        summary.setCompletedTasks(taskRepository.countByStatus("COMPLETED"));

        Map<String, Long> taskMap = new HashMap<>();
        taskMap.put("todo", taskRepository.countByStatus("TODO"));
        taskMap.put("inProgress", taskRepository.countByStatus("IN_PROGRESS"));
        taskMap.put("submitted", taskRepository.countByStatus("SUBMITTED"));
        taskMap.put("revisionRequired", taskRepository.countByStatus("REVISION_REQUIRED"));
        taskMap.put("completed", taskRepository.countByStatus("COMPLETED"));
        summary.setTaskOverview(taskMap);

        List<Project> activeProjects = projectRepository.findByStatus("IN_PROGRESS");
        List<DashboardSummaryDTO.ProjectProgressDTO> projectProgressList = new ArrayList<>();

        if (activeProjects != null) {
            for (Project project : activeProjects) {
                long totalTasks = taskRepository.countByProjectId(project.getId());
                long completedTasks = taskRepository.countByProjectIdAndStatus(project.getId(), "COMPLETED");

                int progressPercentage = (totalTasks > 0) ? (int) ((completedTasks * 100) / totalTasks) : 0;

                DashboardSummaryDTO.ProjectProgressDTO dto = new DashboardSummaryDTO.ProjectProgressDTO();
                dto.setName(project.getName());
                dto.setProgress(progressPercentage);
                projectProgressList.add(dto);
            }
        }
        summary.setActiveProjectsProgress(projectProgressList);

        return summary;
    }
}