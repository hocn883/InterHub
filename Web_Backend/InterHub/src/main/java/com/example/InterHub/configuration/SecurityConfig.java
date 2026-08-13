package com.example.InterHub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // Tắt CSRF để test API POST/PUT/DELETE
                .csrf(csrf -> csrf.disable())

                // TẤT CẢ URL ĐỀU ĐƯỢC PHÉP
                .authorizeHttpRequests(auth -> auth
                        .anyRequest()
                        .permitAll()
                )

                // Không hiện form login mặc định
                .formLogin(form -> form.disable())

                // Không dùng HTTP Basic
                .httpBasic(basic -> basic.disable());


        return http.build();
    }
}