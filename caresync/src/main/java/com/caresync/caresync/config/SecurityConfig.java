package com.caresync.caresync.config;

import com.caresync.caresync.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
                    corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))
                .csrf(csrf -> csrf.disable()) // Onemogućavamo zbog REST-a i React-a
                .authorizeHttpRequests(auth -> auth
                        // 1. Potpuno javne rute (BEZ TOKENA)
                        .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                        .requestMatchers("/users/**", "/api/users/**").permitAll()

                        .requestMatchers("/admin/**", "/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/stats/**").hasAnyRole("DOCTOR", "NURSE", "ADMIN")

                        // 2. Specifične rute za DOKTORA
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/appointments/*/diagnose").hasRole("DOCTOR")
                        .requestMatchers("/api/appointments/patient/*/history").hasRole("DOCTOR")

                        // 3. Specifične rute za SESTRU
                        .requestMatchers("/api/stats/nurse-dashboard").hasRole("NURSE")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/appointments/*/pay").hasRole("NURSE")
                        .requestMatchers("/api/appointments/schedule").hasRole("NURSE")

                        // 4. Zajedničke rute (Termini, Lista doktora...)
                        .requestMatchers("/api/appointments/**").hasAnyRole("DOCTOR", "NURSE", "ADMIN")
                        .requestMatchers("/api/users/doctors").hasAnyRole("DOCTOR", "NURSE", "ADMIN")
                        // U SecurityConfig.java
                        .requestMatchers("/api/stats/**").hasAnyRole("DOCTOR", "NURSE", "ADMIN")
                        .requestMatchers("/api/auth/update-password").authenticated()
                        .requestMatchers("/api/stats/**").hasAnyRole("DOCTOR", "ADMIN")
                        // 5. Sve ostalo mora biti autentifikovano
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Bitno za JWT
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

}