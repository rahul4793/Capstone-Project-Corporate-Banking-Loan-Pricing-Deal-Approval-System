package com.investmentbank.deal_pipeline_backend.dto;

import lombok.Data;

@Data
public class DealRequestDTO {

    private String clientName;
    private String dealType;
    private String sector;
    private String summary;

    // ADMIN-only (ignored for USER at controller/service level)
    private Long dealValue;
}
