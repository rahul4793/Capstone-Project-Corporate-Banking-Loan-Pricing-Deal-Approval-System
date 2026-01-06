package com.investmentbank.deal_pipeline_backend.controller;

import com.investmentbank.deal_pipeline_backend.dto.LoginRequestDTO;
import com.investmentbank.deal_pipeline_backend.dto.LoginResponseDTO;
import com.investmentbank.deal_pipeline_backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }
}
