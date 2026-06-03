package com.vsm.platform.controller;

import com.vsm.platform.services.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;

    @GetMapping("/{diagramId}/pdf")
    public ResponseEntity<Resource> exportPDF(@PathVariable UUID diagramId) {
        Resource resource = exportService.exportPDF(diagramId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"vsm.pdf\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(resource);
    }

    @GetMapping("/{diagramId}/json")
    public ResponseEntity<Resource> exportJSON(@PathVariable UUID diagramId) {
        Resource resource = exportService.exportJSON(diagramId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"vsm.json\"")
            .contentType(MediaType.APPLICATION_JSON)
            .body(resource);
    }

    @GetMapping("/{diagramId}/excel")
    public ResponseEntity<Resource> exportExcel(@PathVariable UUID diagramId) {
        Resource resource = exportService.exportExcel(diagramId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"vsm-kpi.xlsx\"")
            .contentType(MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(resource);
    }
}
