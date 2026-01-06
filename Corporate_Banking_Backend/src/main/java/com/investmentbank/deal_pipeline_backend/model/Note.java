package com.investmentbank.deal_pipeline_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class Note {
    private String userId;
    private String note;
    private Instant timestamp;
}
