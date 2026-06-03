package com.vsm.platform.domain.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessDataJson {
    private double cycleTime;
    private double changeoverTime;
    private double uptime;
    private int operators;
    private int batchSize;
    private Integer inventory;
    private Integer shiftTime;
    private Integer shifts;
    private Double defectRate;

    public double cycleTime() { return cycleTime; }
    public Integer inventory() { return inventory; }
}
