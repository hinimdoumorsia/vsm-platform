package com.vsm.platform.dto.response;

import com.vsm.platform.domain.model.KPIResult;
import lombok.Data;

@Data
public class KPIResultResponse {
    private Double leadTime;
    private Double totalCycleTime;
    private Double valueAddedTime;
    private Double nonValueAddedTime;
    private Double processCycleEfficiency;
    private Double taktTime;
    private Integer totalWip;
    private java.util.UUID bottleneckNodeId;
    private java.time.Instant computedAt;
    
    public static KPIResultResponse from(KPIResult result) {
        KPIResultResponse response = new KPIResultResponse();
        response.setLeadTime(result.getLeadTime());
        response.setTotalCycleTime(result.getTotalCycleTime());
        response.setValueAddedTime(result.getValueAddedTime());
        response.setNonValueAddedTime(result.getNonValueAddedTime());
        response.setProcessCycleEfficiency(result.getProcessCycleEfficiency());
        response.setTaktTime(result.getTaktTime());
        response.setTotalWip(result.getTotalWip());
        response.setBottleneckNodeId(result.getBottleneckNodeId());
        response.setComputedAt(result.getComputedAt());
        return response;
    }
}