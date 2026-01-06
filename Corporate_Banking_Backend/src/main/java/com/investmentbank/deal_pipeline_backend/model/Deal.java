package com.investmentbank.deal_pipeline_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "deals")
public class Deal {

    @Id
    private String id;

    private String clientName;
    private String dealType;
    private String sector;
    private String summary;

    private Long dealValue; // ADMIN ONLY

    private DealStage currentStage = DealStage.Prospect;

    private List<Note> notes = new ArrayList<>();

    private String createdBy;
    private String assignedTo;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
}
