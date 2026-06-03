package com.vsm.platform.dto.request;

import lombok.Data;

@Data
public class SaveDiagramRequest {
    private String name;
    private String type;
    private Object nodes;
    private Object edges;
    
    // Getters
    public String getName() { return name; }
    public String getType() { return type; }
    public Object getNodes() { return nodes; }
    public Object getEdges() { return edges; }
    
    // Setters
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setNodes(Object nodes) { this.nodes = nodes; }
    public void setEdges(Object edges) { this.edges = edges; }
}