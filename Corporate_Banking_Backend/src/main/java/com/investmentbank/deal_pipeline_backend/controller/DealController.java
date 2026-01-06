package com.investmentbank.deal_pipeline_backend.controller;

import com.investmentbank.deal_pipeline_backend.dto.*;
import com.investmentbank.deal_pipeline_backend.mapper.DealMapper;
import com.investmentbank.deal_pipeline_backend.model.Deal;
import com.investmentbank.deal_pipeline_backend.model.DealStage;
import com.investmentbank.deal_pipeline_backend.service.DealService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
//@CrossOrigin(origins = "http://localhost:5173")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    // CREATE
    @PostMapping
    public DealResponseDTO createDeal(
            @RequestBody DealRequestDTO request,
            Authentication auth
    ) {
        Deal saved = dealService.createDeal(
                DealMapper.toEntity(request)
        );
        return DealMapper.toDto(saved, isAdmin(auth));
    }

    //  GET ALL (FILTERABLE)
    @GetMapping
    public List<DealResponseDTO> getDeals(
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) String dealType,
            @RequestParam(required = false) String sector,
            Authentication auth
    ) {
        DealStage stageEnum =
                stage != null ? DealStage.valueOf(stage) : null;

        return dealService
                .getDeals(stageEnum, dealType, sector)
                .stream()
                .map(d -> DealMapper.toDto(d, isAdmin(auth)))
                .toList();
    }

    //  GET BY ID
    @GetMapping("/{id}")
    public DealResponseDTO getDealById(
            @PathVariable String id,
            Authentication auth
    ) {
        return DealMapper.toDto(
                dealService.getDealById(id),
                isAdmin(auth)
        );
    }

    // UPDATE BASIC
    @PutMapping("/{id}")
    public DealResponseDTO updateDeal(
            @PathVariable String id,
            @RequestBody DealRequestDTO request,
            Authentication auth
    ) {
        Deal updated = dealService.updateDeal(
                id,
                DealMapper.toEntity(request)
        );
        return DealMapper.toDto(updated, isAdmin(auth));
    }

    // UPDATE STAGE
    @PatchMapping("/{id}/stage")
    public DealResponseDTO updateStage(
            @PathVariable String id,
            @RequestBody StageUpdateRequest request,
            Authentication auth
    ) {
        Deal updated = dealService.updateStage(
                id,
                DealStage.valueOf(request.getStage())
        );
        return DealMapper.toDto(updated, isAdmin(auth));
    }

    // UPDATE VALUE (ADMIN)
    @PatchMapping("/{id}/value")
    @PreAuthorize("hasRole('ADMIN')")
    public DealResponseDTO updateDealValue(
            @PathVariable String id,
            @RequestBody DealValueUpdateRequest request
    ) {
        return DealMapper.toDto(
                dealService.updateDealValue(id, request.getDealValue()),
                true
        );
    }

    //  ADD NOTE
    @PostMapping("/{id}/notes")
    public DealResponseDTO addNote(
            @PathVariable String id,
            @RequestBody NoteRequest request,
            Authentication auth
    ) {
        Deal updated = dealService.addNote(id, request.getNote());
        return DealMapper.toDto(updated, isAdmin(auth));
    }

    //  DELETE (ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDeal(@PathVariable String id) {
        dealService.deleteDeal(id);
    }
}
