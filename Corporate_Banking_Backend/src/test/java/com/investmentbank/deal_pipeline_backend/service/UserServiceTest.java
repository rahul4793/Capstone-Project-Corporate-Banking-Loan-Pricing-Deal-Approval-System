package com.investmentbank.deal_pipeline_backend.service;

import com.investmentbank.deal_pipeline_backend.exception.ResourceNotFoundException;
import com.investmentbank.deal_pipeline_backend.model.User;
import com.investmentbank.deal_pipeline_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
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
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId("1");
        user.setUsername("john");
        user.setPassword("plain");
        user.setActive(true);
    }

    // ================= CREATE =================

    @Test
    void createUser_encodesPassword() {
        when(passwordEncoder.encode("plain"))
                .thenReturn("encoded");

        when(userRepository.save(any()))
                .thenReturn(user);

        User saved = userService.createUser(user);

        verify(passwordEncoder).encode("plain");
        verify(userRepository).save(user);
        assertNotNull(saved);
    }

    // ================= TOGGLE =================

    @Test
    void toggleStatus_flipsActiveFlag() {
        when(userRepository.findById("1"))
                .thenReturn(Optional.of(user));

        when(userRepository.save(any()))
                .thenReturn(user);

        User updated = userService.toggleStatus("1");

        assertFalse(updated.isActive());
    }

    @Test
    void toggleStatus_throwsException_whenNotFound() {
        when(userRepository.findById("1"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.toggleStatus("1"));
    }

    // ================= GET BY USERNAME =================

    @Test
    void getByUsername_success() {
        when(userRepository.findByUsername("john"))
                .thenReturn(Optional.of(user));

        User found = userService.getByUsername("john");

        assertEquals("john", found.getUsername());
    }

    @Test
    void getByUsername_throwsException() {
        when(userRepository.findByUsername("john"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.getByUsername("john"));
    }
}
