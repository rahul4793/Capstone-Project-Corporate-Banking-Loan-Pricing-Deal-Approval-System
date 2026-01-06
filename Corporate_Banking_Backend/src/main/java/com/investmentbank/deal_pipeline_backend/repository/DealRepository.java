package com.investmentbank.deal_pipeline_backend.repository;

import com.investmentbank.deal_pipeline_backend.model.Deal;
import com.investmentbank.deal_pipeline_backend.model.DealStage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DealRepository extends MongoRepository<Deal, String> {

    List<Deal> findByCurrentStage(DealStage stage);

    List<Deal> findByDealType(String dealType);

    List<Deal> findBySector(String sector);

    List<Deal> findByCurrentStageAndDealTypeAndSector(
            DealStage stage,
            String dealType,
            String sector
    );
}
