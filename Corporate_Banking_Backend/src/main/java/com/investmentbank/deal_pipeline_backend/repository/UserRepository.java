package com.investmentbank.deal_pipeline_backend.repository;

import com.investmentbank.deal_pipeline_backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
}
