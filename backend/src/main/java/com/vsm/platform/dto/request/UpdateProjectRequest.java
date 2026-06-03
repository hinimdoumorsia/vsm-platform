package com.vsm.platform.dto.request;

import lombok.Data;

@Data
public class UpdateProjectRequest {
    private String name;
    private String description;
    
    // Getters
    public String getName() { return name; }
    public String getDescription() { return description; }
    
    // Setters
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
}