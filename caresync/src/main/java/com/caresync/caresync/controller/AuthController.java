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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Dozvoljava React-u da pristupi backendu
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        // 1. Provera identiteta (Spring Security radi proveru lozinke)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        // 2. Ako je uspešno, generiši token
        String token = jwtUtils.generateToken(authRequest.getUsername());

        // 3. Pronađi korisnika da bismo poslali i njegovu ulogu
        User user = userRepository.findByUsername(authRequest.getUsername()).get();

        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
    }
}