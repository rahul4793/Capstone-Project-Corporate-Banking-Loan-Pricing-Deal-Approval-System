package com.investmentbank.deal_pipeline_backend.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiError {

    private Instant timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}
