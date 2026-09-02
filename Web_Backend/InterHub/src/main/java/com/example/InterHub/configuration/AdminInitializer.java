package com.example.InterHub.configuration;

import com.example.InterHub.entity.Admin;
import com.example.InterHub.enums.UserRole;
import com.example.InterHub.repository.AdminRepository;
import com.example.InterHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer {
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Bean
    CommandLineRunner initAdmin() {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                Admin admin = new Admin();
                admin.setFullName("Administrator");
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@internhub.com");
                admin.setPhone("0900000000");
                admin.setRole(UserRole.ADMIN);
                adminRepository.save(admin);
            }
        };
    }
}