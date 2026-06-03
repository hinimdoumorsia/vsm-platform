package com.vsm.platform.dto.request;

import lombok.Data;

@Data
public class SimulationConfigRequest {
    private int durationSeconds;
    private int speedMultiplier;
    
    // Getters
    public int getDurationSeconds() { return durationSeconds; }
    public int getSpeedMultiplier() { return speedMultiplier; }
    
    // Setters
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public void setSpeedMultiplier(int speedMultiplier) { this.speedMultiplier = speedMultiplier; }
}