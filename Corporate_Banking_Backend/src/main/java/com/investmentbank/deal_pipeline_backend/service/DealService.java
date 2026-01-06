package com.investmentbank.deal_pipeline_backend.service;

import com.investmentbank.deal_pipeline_backend.model.Deal;
import com.investmentbank.deal_pipeline_backend.model.DealStage;
import com.investmentbank.deal_pipeline_backend.model.Note;
import com.investmentbank.deal_pipeline_backend.repository.DealRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DealService {

    private final DealRepository dealRepository;

    public DealService(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    //  CREATE
    public Deal createDeal(Deal deal) {
        deal.setCreatedAt(Instant.now());
        deal.setUpdatedAt(Instant.now());

        if (deal.getCurrentStage() == null) {
            deal.setCurrentStage(DealStage.Prospect);
        }

        if (deal.getNotes() == null) {
            deal.setNotes(new ArrayList<>());
        }

        return dealRepository.save(deal);
    }

    // GET ALL
    public List<Deal> getDeals(
            DealStage stage,
            String dealType,
            String sector
    ) {
        List<Deal> deals = dealRepository.findAll();

        return deals.stream()
                .filter(d -> stage == null || d.getCurrentStage() == stage)
                .filter(d -> dealType == null || d.getDealType().equalsIgnoreCase(dealType))
                .filter(d -> sector == null || d.getSector().equalsIgnoreCase(sector))
                .collect(Collectors.toList());
    }

    //  GET BY ID
    public Deal getDealById(String id) {
        return dealRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Deal not found with id: " + id));
    }

    //  UPDATE BASIC
    public Deal updateDeal(String id, Deal updatedDeal) {
        Deal existing = getDealById(id);

        if (updatedDeal.getClientName() != null)
            existing.setClientName(updatedDeal.getClientName());

        if (updatedDeal.getDealType() != null)
            existing.setDealType(updatedDeal.getDealType());

        if (updatedDeal.getSector() != null)
            existing.setSector(updatedDeal.getSector());

        if (updatedDeal.getSummary() != null)
            existing.setSummary(updatedDeal.getSummary());

        existing.setUpdatedAt(Instant.now());
        return dealRepository.save(existing);
    }

    // UPDATE STAGE
    public Deal updateStage(String id, DealStage stage) {
        Deal deal = getDealById(id);
        deal.setCurrentStage(stage);
        deal.setUpdatedAt(Instant.now());
        return dealRepository.save(deal);
    }

    //  UPDATE VALUE (ADMIN)
    public Deal updateDealValue(String id, Long dealValue) {
        Deal deal = getDealById(id);
        deal.setDealValue(dealValue);
        deal.setUpdatedAt(Instant.now());
        return dealRepository.save(deal);
    }

    // ADD NOTE
    public Deal addNote(String id, String noteText) {
        Deal deal = getDealById(id);

        deal.getNotes().add(
                new Note(null, noteText, Instant.now())
        );

        deal.setUpdatedAt(Instant.now());
        return dealRepository.save(deal);
    }

    //  DELETE
    public void deleteDeal(String id) {
        if (!dealRepository.existsById(id)) {
            throw new RuntimeException("Deal not found with id: " + id);
        }
        dealRepository.deleteById(id);
    }
}
