package com.vsm.platform.services;

import com.vsm.platform.dto.request.SaveDiagramRequest;
import com.vsm.platform.dto.response.DiagramResponse;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class VSMDiagramService {
    public List<DiagramResponse> findByProject(UUID projectId) {
        return new ArrayList<>();
    }
    public DiagramResponse findById(UUID id) {
        DiagramResponse response = new DiagramResponse();
        response.setId(id);
        response.setName("Demo Diagram");
        response.setType("CURRENT_STATE");
        return response;
    }
    public DiagramResponse save(SaveDiagramRequest req) {
        DiagramResponse response = new DiagramResponse();
        response.setId(UUID.randomUUID());
        response.setName(req.getName());
        response.setType(req.getType());
        return response;
    }
    public DiagramResponse duplicate(UUID id, String name) {
        DiagramResponse response = new DiagramResponse();
        response.setId(UUID.randomUUID());
        response.setName(name);
        return response;
    }
    public void delete(UUID id) {}
}
