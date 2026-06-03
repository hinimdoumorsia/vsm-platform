package com.vsm.platform.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "kpi_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KPIResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "diagram_id", nullable = false)
    private UUID diagramId;

    @Column(name = "computed_at", nullable = false)
    private Instant computedAt;

    @Column(name = "lead_time")
    private Double leadTime;

    @Column(name = "total_cycle_time")
    private Double totalCycleTime;

    @Column(name = "value_added_time")
    private Double valueAddedTime;

    @Column(name = "non_value_added_time")
    private Double nonValueAddedTime;

    @Column(name = "process_cycle_efficiency")
    private Double processCycleEfficiency;

    @Column(name = "takt_time")
    private Double taktTime;

    @Column(name = "total_wip")
    private Integer totalWip;

    @Column(name = "bottleneck_node_id")
    private UUID bottleneckNodeId;

    @PrePersist
    void prePersist() { 
        computedAt = Instant.now(); 
    }
}