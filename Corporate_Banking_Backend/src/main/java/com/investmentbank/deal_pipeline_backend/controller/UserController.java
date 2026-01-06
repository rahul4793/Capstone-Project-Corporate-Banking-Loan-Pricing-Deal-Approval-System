package com.investmentbank.deal_pipeline_backend.controller;

import com.investmentbank.deal_pipeline_backend.dto.UserResponseDTO;
import com.investmentbank.deal_pipeline_backend.model.User;
import com.investmentbank.deal_pipeline_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ GET LOGGED-IN USER PROFILE
    @GetMapping("/me")
    public UserResponseDTO getMyProfile(Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive()
        );
    }
}
