package com.vsm.platform.domain.model;

import com.vsm.platform.domain.enums.DiagramType;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vsm_diagrams")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VSMDiagram {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private VSMProject project;

    @Column(nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DiagramType type;

    @OneToMany(mappedBy = "diagram", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VSMNode> nodes;

    @Lob
    @Column(name = "viewport", columnDefinition = "TEXT")
    private String viewport;

    @Column(name = "takt_time")
    private Double taktTime;

    @Column(name = "customer_demand")
    private Integer customerDemand;

    @Column(name = "working_time_seconds")
    private Integer workingTimeSeconds;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    void prePersist() { 
        createdAt = Instant.now(); 
        updatedAt = Instant.now(); 
    }
    
    @PreUpdate
    void preUpdate() { 
        updatedAt = Instant.now(); 
    }
}