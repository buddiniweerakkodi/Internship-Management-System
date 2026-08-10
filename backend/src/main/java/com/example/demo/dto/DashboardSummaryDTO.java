package com.example.demo.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDTO {
    private long activeInterns;
    private long activeProjects;
    private long pendingSubmissions;
    private long overdueTasks;
    private long completedTasks;
    private Map<String, Long> taskOverview;
    private List<ProjectProgressDTO> activeProjectsProgress;
    private List<ActivityDTO> recentActivities;

    public long getActiveInterns() { return activeInterns; }
    public void setActiveInterns(long activeInterns) { this.activeInterns = activeInterns; }

    public long getActiveProjects() { return activeProjects; }
    public void setActiveProjects(long activeProjects) { this.activeProjects = activeProjects; }

    public long getPendingSubmissions() { return pendingSubmissions; }
    public void setPendingSubmissions(long pendingSubmissions) { this.pendingSubmissions = pendingSubmissions; }

    public long getOverdueTasks() { return overdueTasks; }
    public void setOverdueTasks(long overdueTasks) { this.overdueTasks = overdueTasks; }

    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }

    public Map<String, Long> getTaskOverview() { return taskOverview; }
    public void setTaskOverview(Map<String, Long> taskOverview) { this.taskOverview = taskOverview; }

    public List<ProjectProgressDTO> getActiveProjectsProgress() { return activeProjectsProgress; }
    public void setActiveProjectsProgress(List<ProjectProgressDTO> activeProjectsProgress) { this.activeProjectsProgress = activeProjectsProgress; }

    public List<ActivityDTO> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<ActivityDTO> recentActivities) { this.recentActivities = recentActivities; }

    public static class ProjectProgressDTO {
        private String name;
        private int progress;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public int getProgress() { return progress; }
        public void setProgress(int progress) { this.progress = progress; }
    }

    public static class ActivityDTO {
        private String user;
        private String action;
        private String project;
        private String timeAgo;

        public String getUser() { return user; }
        public void setUser(String user) { this.user = user; }

        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }

        public String getProject() { return project; }
        public void setProject(String project) { this.project = project; }

        public String getTimeAgo() { return timeAgo; }
        public void setTimeAgo(String timeAgo) { this.timeAgo = timeAgo; }
    }
}