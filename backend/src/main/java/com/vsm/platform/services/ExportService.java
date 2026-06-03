package com.vsm.platform.services;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class ExportService {
    
    public Resource exportPDF(UUID diagramId) {
        String content = "PDF Export for diagram: " + diagramId;
        return new ByteArrayResource(content.getBytes());
    }
    
    public Resource exportJSON(UUID diagramId) {
        String json = "{\"diagramId\": \"" + diagramId + "\", \"message\": \"VSM Export\"}";
        return new ByteArrayResource(json.getBytes());
    }
    
    public Resource exportExcel(UUID diagramId) {
        String content = "Excel Export for diagram: " + diagramId;
        return new ByteArrayResource(content.getBytes());
    }
}
