package com.vsm.platform.controller;

import com.vsm.platform.dto.request.CreateProjectRequest;
import com.vsm.platform.dto.request.UpdateProjectRequest;
import com.vsm.platform.dto.response.ProjectResponse;
import com.vsm.platform.services.VSMProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class VSMProjectController {

    private final VSMProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.findAllByUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
        @RequestBody CreateProjectRequest req
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(projectService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
        @PathVariable UUID id,
        @RequestBody UpdateProjectRequest req
    ) {
        return ResponseEntity.ok(projectService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
