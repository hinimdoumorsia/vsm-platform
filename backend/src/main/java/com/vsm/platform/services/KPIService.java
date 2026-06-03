// ============================================================
// VSM Platform — KPI Service (Spring Boot)
// ============================================================
package com.vsm.platform.services;

import com.vsm.platform.domain.model.KPIResult;
import com.vsm.platform.domain.model.VSMDiagram;
import com.vsm.platform.domain.model.VSMNode;
import com.vsm.platform.dto.response.KPIResultResponse;
import com.vsm.platform.repository.KPIResultRepository;
import com.vsm.platform.repository.VSMDiagramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KPIService {

    private final VSMDiagramRepository diagramRepository;
    private final KPIResultRepository kpiResultRepository;

    private static final Set<String> VALUE_ADDED = Set.of("PROCESS");
    private static final Set<String> NON_VSM = Set.of(
        "SUPPLIER", "CUSTOMER", "ELECTRONIC_FLOW", "MANUAL_FLOW",
        "PUSH_ARROW", "PULL_ARROW"
    );

    @Transactional
    public KPIResultResponse compute(UUID diagramId) {
        VSMDiagram diagram = diagramRepository.findByIdWithNodes(diagramId)
            .orElseThrow(() -> new IllegalArgumentException("Diagram not found: " + diagramId));

        double taktTime = computeTaktTime(diagram);
        List<VSMNode> processNodes = diagram.getNodes().stream()
            .filter(n -> !NON_VSM.contains(n.getType().name()))
            .filter(n -> n.getProcessData() != null)
            .toList();

        double totalCycleTime = processNodes.stream()
            .mapToDouble(n -> n.getProcessData().cycleTime())
            .sum();

        double valueAddedTime = processNodes.stream()
            .filter(n -> VALUE_ADDED.contains(n.getType().name()))
            .mapToDouble(n -> n.getProcessData().cycleTime())
            .sum();

        double inventoryTime = computeInventoryTime(diagram, taktTime);
        double leadTime = totalCycleTime + inventoryTime;
        double nvat = leadTime - valueAddedTime;
        double pce = leadTime > 0 ? (valueAddedTime / leadTime) * 100.0 : 0.0;
        int wip = computeWIP(diagram);

        UUID bottleneck = processNodes.stream()
            .max(Comparator.comparingDouble(n -> n.getProcessData().cycleTime()))
            .map(VSMNode::getId)
            .orElse(null);

        KPIResult entity = KPIResult.builder()
            .diagramId(diagramId)
            .leadTime(leadTime)
            .totalCycleTime(totalCycleTime)
            .valueAddedTime(valueAddedTime)
            .nonValueAddedTime(nvat)
            .processCycleEfficiency(Math.round(pce * 10.0) / 10.0)
            .taktTime(taktTime)
            .totalWip(wip)
            .bottleneckNodeId(bottleneck)
            .build();

        kpiResultRepository.save(entity);
        return KPIResultResponse.from(entity);
    }

    public List<KPIResultResponse> getHistory(UUID diagramId) {
        return kpiResultRepository.findByDiagramIdOrderByComputedAtDesc(diagramId)
            .stream().map(KPIResultResponse::from).toList();
    }

    public Map<String, Object> compare(UUID currentId, UUID futureId) {
        KPIResult current = kpiResultRepository
            .findFirstByDiagramIdOrderByComputedAtDesc(currentId)
            .orElseThrow();
        KPIResult future = kpiResultRepository
            .findFirstByDiagramIdOrderByComputedAtDesc(futureId)
            .orElseThrow();

        return Map.of(
            "current", KPIResultResponse.from(current),
            "future", KPIResultResponse.from(future),
            "improvements", Map.of(
                "leadTimeReduction", current.getLeadTime() - future.getLeadTime(),
                "pceGain", future.getProcessCycleEfficiency() - current.getProcessCycleEfficiency(),
                "wipReduction", current.getTotalWip() - future.getTotalWip()
            )
        );
    }

    // ---- Private helpers ----

    private double computeTaktTime(VSMDiagram d) {
        if (d.getWorkingTimeSeconds() == null || d.getCustomerDemand() == null
                || d.getCustomerDemand() == 0) return 0;
        return (double) d.getWorkingTimeSeconds() / d.getCustomerDemand();
    }

    private double computeInventoryTime(VSMDiagram d, double taktTime) {
        if (taktTime == 0) return 0;
        return d.getNodes().stream()
            .filter(n -> n.getType().name().equals("INVENTORY")
                      || n.getType().name().equals("SUPERMARKET"))
            .mapToDouble(n -> {
                int qty = n.getProcessData() != null
                    && n.getProcessData().inventory() != null
                    ? n.getProcessData().inventory() : 0;
                return qty * taktTime;
            })
            .sum();
    }

    private int computeWIP(VSMDiagram d) {
        return d.getNodes().stream()
            .filter(n -> n.getType().name().equals("INVENTORY")
                      || n.getType().name().equals("SUPERMARKET"))
            .mapToInt(n -> n.getProcessData() != null
                && n.getProcessData().inventory() != null
                ? n.getProcessData().inventory() : 0)
            .sum();
    }
}