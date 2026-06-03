package com.vsm.platform.repository;

import com.vsm.platform.domain.model.KPIResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface KPIResultRepository extends JpaRepository<KPIResult, UUID> {
    
    List<KPIResult> findByDiagramIdOrderByComputedAtDesc(UUID diagramId);
    
    Optional<KPIResult> findFirstByDiagramIdOrderByComputedAtDesc(UUID diagramId);
}
