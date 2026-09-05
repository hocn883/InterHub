package com.example.InterHub.configuration;
import com.example.InterHub.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    @Bean
    @Order(1)
    public SecurityFilterChain adminSecurity(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/admin/**", "/css/**")
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/admin/login",
                                "/css/**",
                                "/admin/js/**",
                                "/admin/images/**"
                        )
                        .permitAll()
                        .anyRequest()
                        .hasRole("ADMIN"))
                .formLogin(form -> form
                        .loginPage("/admin/login")
                        .loginProcessingUrl("/admin/login")
                        .defaultSuccessUrl(
                                "/admin",
                                true)
                        .failureUrl(
                                "/admin/login?error=true"
                        )
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/admin/logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessUrl("/admin/login?logout=true")
                        .permitAll()
                );
        return http.build();
    }
    @Bean
    @Order(2)
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        ))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/employer")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/employer/*",
                                "/api/employer/*/reviews",
                                "/api/employer/*/jobs"
                        ).permitAll()
                        .requestMatchers("/api/auth/**", "/api/jobs/**",  "/ws",
                                "/ws/**")
                        .permitAll()
                        .requestMatchers("/api/student/**")
                        .hasRole("STUDENT")
                        .requestMatchers("/api/employer/**")
                        .hasRole("EMPLOYER")
                        .requestMatchers("/api/lecturer/**")
                        .hasRole("LECTURER")
                        .anyRequest()
                        .authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}