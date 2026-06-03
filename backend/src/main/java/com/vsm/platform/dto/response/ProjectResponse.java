package com.vsm.platform.dto.response;

import java.util.UUID;

public class ProjectResponse {
    private UUID id;
    private String name;
    private String description;
    
    // Constructeurs
    public ProjectResponse() {}
    
    public ProjectResponse(UUID id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    
    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    
    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
}