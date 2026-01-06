package com.investmentbank.deal_pipeline_backend.service;

import com.investmentbank.deal_pipeline_backend.model.Deal;
import com.investmentbank.deal_pipeline_backend.model.DealStage;
import com.investmentbank.deal_pipeline_backend.model.Note;
import com.investmentbank.deal_pipeline_backend.repository.DealRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DealServiceTest {

    @Mock
    private DealRepository dealRepository;

    @InjectMocks
    private DealService dealService;

    private Deal deal;

    @BeforeEach
    void setup() {
        deal = new Deal();
        deal.setId("1");
        deal.setClientName("Acme Corp");
        deal.setDealType("M&A");
        deal.setSector("Finance");
        deal.setSummary("Initial summary");
        deal.setDealValue(1_000_000L);
        deal.setCurrentStage(DealStage.Prospect);
        deal.setNotes(new ArrayList<>());
    }

    // ================= CREATE =================

    @Test
    void createDeal_setsDefaults_whenStageAndNotesNull() {
        deal.setCurrentStage(null);
        deal.setNotes(null);

        when(dealRepository.save(any())).thenReturn(deal);

        Deal saved = dealService.createDeal(deal);

        assertEquals(DealStage.Prospect, saved.getCurrentStage());
        assertNotNull(saved.getNotes());
        assertNotNull(saved.getCreatedAt());
        assertNotNull(saved.getUpdatedAt());
    }

    // ================= GET DEALS (BRANCH HEAVY) =================

    @Test
    void getDeals_noFilters_returnsAll() {
        when(dealRepository.findAll()).thenReturn(List.of(deal));

        List<Deal> result = dealService.getDeals(null, null, null);

        assertEquals(1, result.size());
    }

    @Test
    void getDeals_filtersByStage_match() {
        when(dealRepository.findAll()).thenReturn(List.of(deal));

        List<Deal> result = dealService.getDeals(DealStage.Prospect, null, null);

        assertEquals(1, result.size());
    }

    @Test
    void getDeals_filtersByStage_noMatch() {
        when(dealRepository.findAll()).thenReturn(List.of(deal));

        List<Deal> result = dealService.getDeals(DealStage.Closed, null, null);

        assertTrue(result.isEmpty());
    }

    @Test
    void getDeals_filtersByDealType_noMatch() {
        when(dealRepository.findAll()).thenReturn(List.of(deal));

        List<Deal> result = dealService.getDeals(null, "IPO", null);

        assertTrue(result.isEmpty());
    }

    @Test
    void getDeals_filtersBySector_noMatch() {
        when(dealRepository.findAll()).thenReturn(List.of(deal));

        List<Deal> result = dealService.getDeals(null, null, "IT");

        assertTrue(result.isEmpty());
    }

    @Test
    void getDeals_filtersByAllFields_noMatch() {
        when(dealRepository.findAll()).thenReturn(List.of(deal));

        List<Deal> result = dealService.getDeals(
                DealStage.Closed,
                "IPO",
                "IT"
        );

        assertTrue(result.isEmpty());
    }

    // ================= GET BY ID =================

    @Test
    void getDealById_success() {
        when(dealRepository.findById("1")).thenReturn(Optional.of(deal));

        Deal found = dealService.getDealById("1");

        assertEquals("Acme Corp", found.getClientName());
    }

    @Test
    void getDealById_throwsException_whenMissing() {
        when(dealRepository.findById("1")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> dealService.getDealById("1"));
    }

    // ================= UPDATE DEAL =================

    @Test
    void updateDeal_updatesOnlyProvidedFields() {
        when(dealRepository.findById("1")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any())).thenReturn(deal);

        Deal update = new Deal();
        update.setSector("Technology");

        Deal updated = dealService.updateDeal("1", update);

        assertEquals("Technology", updated.getSector());
    }

    @Test
    void updateDeal_allFieldsNull_noChanges() {
        when(dealRepository.findById("1")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any())).thenReturn(deal);

        Deal updated = dealService.updateDeal("1", new Deal());

        assertEquals("Acme Corp", updated.getClientName());
    }

    @Test
    void updateDeal_allFieldsUpdated() {
        when(dealRepository.findById("1")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any())).thenReturn(deal);

        Deal update = new Deal();
        update.setClientName("New Client");
        update.setDealType("IPO");
        update.setSector("Tech");
        update.setSummary("Updated summary");

        Deal updated = dealService.updateDeal("1", update);

        assertEquals("New Client", updated.getClientName());
        assertEquals("IPO", updated.getDealType());
    }

    // ================= STAGE =================

    @Test
    void updateStage_updatesStage() {
        when(dealRepository.findById("1")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any())).thenReturn(deal);

        Deal updated = dealService.updateStage("1", DealStage.Closed);

        assertEquals(DealStage.Closed, updated.getCurrentStage());
    }

    // ================= VALUE =================

    @Test
    void updateDealValue_updatesValue() {
        when(dealRepository.findById("1")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any())).thenReturn(deal);

        Deal updated = dealService.updateDealValue("1", 5_000_000L);

        assertEquals(5_000_000L, updated.getDealValue());
    }

    // ================= NOTES =================

    @Test
    void addNote_addsNote() {
        when(dealRepository.findById("1")).thenReturn(Optional.of(deal));
        when(dealRepository.save(any())).thenReturn(deal);

        Deal updated = dealService.addNote("1", "Initial discussion");

        assertEquals(1, updated.getNotes().size());
        assertEquals("Initial discussion",
                updated.getNotes().get(0).getNote());
    }

    // ================= DELETE =================

    @Test
    void deleteDeal_success() {
        when(dealRepository.existsById("1")).thenReturn(true);

        dealService.deleteDeal("1");

        verify(dealRepository).deleteById("1");
    }

    @Test
    void deleteDeal_throwsException_whenNotExists() {
        when(dealRepository.existsById("1")).thenReturn(false);

        assertThrows(RuntimeException.class,
                () -> dealService.deleteDeal("1"));
    }
}
