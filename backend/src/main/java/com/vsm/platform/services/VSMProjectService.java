package com.vsm.platform.services;

import com.vsm.platform.dto.request.CreateProjectRequest;
import com.vsm.platform.dto.request.UpdateProjectRequest;
import com.vsm.platform.dto.response.ProjectResponse;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class VSMProjectService {
    public List<ProjectResponse> findAllByUser() {
        return new ArrayList<>();
    }
    public ProjectResponse findById(UUID id) {
        ProjectResponse response = new ProjectResponse();
        response.setId(id);
        response.setName("Demo Project");
        response.setDescription("Description");
        return response;
    }
    public ProjectResponse create(CreateProjectRequest req) {
        ProjectResponse response = new ProjectResponse();
        response.setId(UUID.randomUUID());
        response.setName(req.getName());
        response.setDescription(req.getDescription());
        return response;
    }
    public ProjectResponse update(UUID id, UpdateProjectRequest req) {
        return findById(id);
    }
    public void delete(UUID id) {}
}