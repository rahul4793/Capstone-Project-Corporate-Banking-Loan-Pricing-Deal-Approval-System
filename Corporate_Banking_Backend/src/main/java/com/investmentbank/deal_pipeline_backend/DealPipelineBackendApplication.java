package com.investmentbank.deal_pipeline_backend;

import com.investmentbank.deal_pipeline_backend.model.Role;
import com.investmentbank.deal_pipeline_backend.model.User;
import com.investmentbank.deal_pipeline_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class DealPipelineBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(DealPipelineBackendApplication.class, args);
    }

    // 🔴 TEMPORARY: auto-create admin user (ONE TIME)
    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            BCryptPasswordEncoder encoder
    ) {
        return args -> {

            if (userRepository.findByUsername("admin").isEmpty()) {

                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@bank.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setActive(true);

                userRepository.save(admin);

                System.out.println("✅ ADMIN USER CREATED");
            } else {
                System.out.println("ℹ️ ADMIN ALREADY EXISTS");
            }
        };
    }
}
