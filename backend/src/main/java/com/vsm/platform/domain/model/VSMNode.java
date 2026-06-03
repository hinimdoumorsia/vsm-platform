package com.vsm.platform.domain.model;

import com.vsm.platform.domain.enums.VSMNodeType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "vsm_nodes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VSMNode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diagram_id", nullable = false)
    private VSMDiagram diagram;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private VSMNodeType type;

    @Column(length = 255)
    private String name;

    @Embedded
    private ProcessDataJson processData;

    public boolean hasProcessData() {
        return processData != null;
    }
}
