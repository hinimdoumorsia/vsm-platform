package com.vsm.platform.controller;

import com.vsm.platform.dto.request.SimulationConfigRequest;
import com.vsm.platform.dto.response.SimulationRunResponse;
import com.vsm.platform.services.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;

    @PostMapping("/run/{diagramId}")
    public ResponseEntity<SimulationRunResponse> runSimulation(
        @PathVariable UUID diagramId,
        @RequestBody SimulationConfigRequest config
    ) {
        return ResponseEntity.ok(simulationService.run(diagramId, config));
    }

    @GetMapping("/results/{runId}")
    public ResponseEntity<SimulationRunResponse> getResults(@PathVariable String runId) {
        return ResponseEntity.ok(simulationService.getResults(runId));
    }
}