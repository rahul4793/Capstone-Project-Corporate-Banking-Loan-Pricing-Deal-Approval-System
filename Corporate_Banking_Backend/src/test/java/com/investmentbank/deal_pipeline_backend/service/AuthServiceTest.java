package com.investmentbank.deal_pipeline_backend.service;

import com.investmentbank.deal_pipeline_backend.dto.LoginRequestDTO;
import com.investmentbank.deal_pipeline_backend.exception.UnauthorizedException;
import com.investmentbank.deal_pipeline_backend.model.Role;
import com.investmentbank.deal_pipeline_backend.model.User;
import com.investmentbank.deal_pipeline_backend.repository.UserRepository;
import com.investmentbank.deal_pipeline_backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_success() {

        User user = new User();
        user.setUsername("john");
        user.setPassword("encoded");
        user.setRole(Role.USER);     // ✅ FIXED
        user.setActive(true);

        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("john");
        request.setPassword("123");

        when(userRepository.findByUsername("john"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123", "encoded"))
                .thenReturn(true);
        when(jwtUtil.generateToken("john", "USER"))
                .thenReturn("jwt-token");

        var response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
    }

    @Test
    void login_fails_when_user_inactive() {

        User user = new User();
        user.setActive(false);

        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("john");

        when(userRepository.findByUsername("john"))
                .thenReturn(Optional.of(user));

        assertThrows(UnauthorizedException.class,
                () -> authService.login(request));
    }

    @Test
    void login_fails_when_password_wrong() {

        User user = new User();
        user.setActive(true);
        user.setPassword("encoded");

        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsername("john");
        request.setPassword("wrong");

        when(userRepository.findByUsername("john"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded"))
                .thenReturn(false);

        assertThrows(UnauthorizedException.class,
                () -> authService.login(request));
    }
}
