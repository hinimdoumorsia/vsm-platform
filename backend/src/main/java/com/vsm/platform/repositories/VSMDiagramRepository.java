package com.vsm.platform.repository;

import com.vsm.platform.domain.model.VSMDiagram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;

public interface VSMDiagramRepository extends JpaRepository<VSMDiagram, UUID> {
    
    @Query("SELECT d FROM VSMDiagram d LEFT JOIN FETCH d.nodes WHERE d.id = :id")
    Optional<VSMDiagram> findByIdWithNodes(@Param("id") UUID id);
}
