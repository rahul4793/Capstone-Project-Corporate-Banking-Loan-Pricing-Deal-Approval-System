package com.investmentbank.deal_pipeline_backend.service;

import com.investmentbank.deal_pipeline_backend.dto.LoginRequestDTO;
import com.investmentbank.deal_pipeline_backend.dto.LoginResponseDTO;
import com.investmentbank.deal_pipeline_backend.exception.UnauthorizedException;
import com.investmentbank.deal_pipeline_backend.model.User;
import com.investmentbank.deal_pipeline_backend.repository.UserRepository;
import com.investmentbank.deal_pipeline_backend.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       JwtUtil jwtUtil,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new UnauthorizedException("Invalid username or password"));

        if (!user.isActive()) {
            throw new UnauthorizedException("User account is deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        System.out.println("✅ Login success for user: " + user.getUsername());

        return new LoginResponseDTO(
                token,
                user.getUsername(),
                user.getRole().name(),
                user.isActive()

        );
    }
}
