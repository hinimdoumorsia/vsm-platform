package com.vsm.platform.controller;

import com.vsm.platform.dto.request.SaveDiagramRequest;
import com.vsm.platform.dto.response.DiagramResponse;
import com.vsm.platform.services.VSMDiagramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/diagrams")
@RequiredArgsConstructor
public class VSMDiagramController {

    private final VSMDiagramService diagramService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<DiagramResponse>> getDiagramsByProject(
        @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(diagramService.findByProject(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiagramResponse> getDiagram(@PathVariable UUID id) {
        return ResponseEntity.ok(diagramService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DiagramResponse> saveDiagram(
        @RequestBody SaveDiagramRequest req
    ) {
        return ResponseEntity.ok(diagramService.save(req));
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<DiagramResponse> duplicateDiagram(
        @PathVariable UUID id,
        @RequestParam String name
    ) {
        return ResponseEntity.ok(diagramService.duplicate(id, name));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiagram(@PathVariable UUID id) {
        diagramService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
