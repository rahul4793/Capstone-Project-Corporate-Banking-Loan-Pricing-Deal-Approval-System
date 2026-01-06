package com.investmentbank.deal_pipeline_backend.dto;

import com.investmentbank.deal_pipeline_backend.model.DealStage;
import com.investmentbank.deal_pipeline_backend.model.Note;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class DealResponseDTO {

    private String id;
    private String clientName;
    private String dealType;
    private String sector;
    private String summary;

    private DealStage currentStage;

    // 🔒 ADMIN ONLY (set conditionally in mapper)
    private Long dealValue;

    private List<Note> notes;

    private String createdBy;
    private String assignedTo;

    private Instant createdAt;
    private Instant updatedAt;
}
