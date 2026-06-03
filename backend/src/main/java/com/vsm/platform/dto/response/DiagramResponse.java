package com.vsm.platform.dto.response;

import java.util.UUID;

public class DiagramResponse {
    private UUID id;
    private String name;
    private String type;
    
    // Constructeurs
    public DiagramResponse() {}
    
    public DiagramResponse(UUID id, String name, String type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
    
    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    
    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
}