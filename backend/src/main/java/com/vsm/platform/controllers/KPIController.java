package com.vsm.platform.controller;

import com.vsm.platform.dto.response.KPIResultResponse;
import com.vsm.platform.services.KPIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/kpi")
@RequiredArgsConstructor
public class KPIController {

    private final KPIService kpiService;

    @PostMapping("/compute/{diagramId}")
    public ResponseEntity<KPIResultResponse> computeKPIs(
        @PathVariable UUID diagramId
    ) {
        return ResponseEntity.ok(kpiService.compute(diagramId));
    }

    @GetMapping("/history/{diagramId}")
    public ResponseEntity<?> getKPIHistory(@PathVariable UUID diagramId) {
        return ResponseEntity.ok(kpiService.getHistory(diagramId));
    }

    @GetMapping("/compare")
    public ResponseEntity<?> compareStates(
        @RequestParam UUID currentId,
        @RequestParam UUID futureId
    ) {
        return ResponseEntity.ok(kpiService.compare(currentId, futureId));
    }
}