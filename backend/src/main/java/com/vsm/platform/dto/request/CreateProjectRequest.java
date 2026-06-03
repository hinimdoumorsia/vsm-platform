package com.vsm.platform.dto.request;

import lombok.Data;

@Data
public class CreateProjectRequest {
    private String name;
    private String description;
    private String product;
    
    // Getters
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getProduct() { return product; }
    
    // Setters
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setProduct(String product) { this.product = product; }
}