package com.caresync.caresync.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Onemogućavamo zbog REST-a i React-a
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Svi mogu na login
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/lekar/**").hasRole("LEKAR")
                        .requestMatchers("/api/sestra/**").hasRole("MED_SESTRA")
                        .anyRequest().authenticated() // Sve ostalo zahteva login
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Bitno za JWT
                );

        return http.build();
    }
}