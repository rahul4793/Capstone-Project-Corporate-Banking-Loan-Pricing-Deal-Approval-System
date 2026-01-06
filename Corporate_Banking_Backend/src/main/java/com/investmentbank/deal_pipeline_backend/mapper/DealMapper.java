package com.investmentbank.deal_pipeline_backend.mapper;

import com.investmentbank.deal_pipeline_backend.dto.DealRequestDTO;
import com.investmentbank.deal_pipeline_backend.dto.DealResponseDTO;
import com.investmentbank.deal_pipeline_backend.model.Deal;

public class DealMapper {

    /* ================= ENTITY → RESPONSE DTO ================= */
    public static DealResponseDTO toDto(Deal deal, boolean isAdmin) {

        DealResponseDTO dto = new DealResponseDTO();

        dto.setId(deal.getId());
        dto.setClientName(deal.getClientName());
        dto.setDealType(deal.getDealType());
        dto.setSector(deal.getSector());
        dto.setSummary(deal.getSummary());
        dto.setCurrentStage(deal.getCurrentStage());
        dto.setNotes(deal.getNotes());

        dto.setCreatedBy(deal.getCreatedBy());
        dto.setAssignedTo(deal.getAssignedTo());
        dto.setCreatedAt(deal.getCreatedAt());
        dto.setUpdatedAt(deal.getUpdatedAt());

        // 🔒 ROLE-BASED
        if (isAdmin) {
            dto.setDealValue(deal.getDealValue());
        }

        return dto;
    }

    /* ================= REQUEST DTO → ENTITY ================= */
    public static Deal toEntity(DealRequestDTO dto) {

        Deal deal = new Deal();

        deal.setClientName(dto.getClientName());
        deal.setDealType(dto.getDealType());
        deal.setSector(dto.getSector());
        deal.setSummary(dto.getSummary());

        // dealValue handled separately (ADMIN only)
        deal.setDealValue(dto.getDealValue());

        return deal;
    }
}
