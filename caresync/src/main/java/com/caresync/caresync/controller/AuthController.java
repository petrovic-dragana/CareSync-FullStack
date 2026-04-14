package com.caresync.caresync.controller;

import com.caresync.caresync.dto.AuthRequest;
import com.caresync.caresync.dto.AuthResponse;
import com.caresync.caresync.model.User;
import com.caresync.caresync.repository.UserRepository;
import com.caresync.caresync.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "*") // Dozvoljava React-u da pristupi backendu
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        String token = jwtUtils.generateToken(authRequest.getUsername());
        User user = userRepository.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronadjen!"));

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getRole().name(),
                user.isMustChangePassword(),
                user.getLastName()
        ));
    }
    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        // 1. Dobijamo trenutno ulogovanog korisnika iz SecurityContext-a
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));

        // 2. Hash-ujemo novu lozinku i gasimo mustChangePassword
        user.setPassword(passwordEncoder.encode(request.get("newPassword")));
        user.setMustChangePassword(false);

        userRepository.save(user);
        return ResponseEntity.ok("Lozinka uspešno ažurirana");
    }
}