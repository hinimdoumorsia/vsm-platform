package com.vsm.platform.services;

import com.vsm.platform.dto.request.SimulationConfigRequest;
import com.vsm.platform.dto.response.SimulationRunResponse;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class SimulationService {
    
    public SimulationRunResponse run(UUID diagramId, SimulationConfigRequest config) {
        SimulationRunResponse response = new SimulationRunResponse();
        response.setRunId(UUID.randomUUID().toString());
        response.setStatus("COMPLETED");
        return response;
    }
    
    public SimulationRunResponse getResults(String runId) {
        SimulationRunResponse response = new SimulationRunResponse();
        response.setRunId(runId);
        response.setStatus("COMPLETED");
        return response;
    }
}