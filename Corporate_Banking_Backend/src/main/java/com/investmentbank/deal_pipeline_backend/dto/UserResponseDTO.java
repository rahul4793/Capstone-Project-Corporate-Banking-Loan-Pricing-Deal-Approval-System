package com.investmentbank.deal_pipeline_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDTO {

    private String id;
    private String username;
    private String email;
    private String role;
    private boolean active;
}
