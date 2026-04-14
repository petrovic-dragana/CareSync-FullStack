package com.caresync.caresync;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class BCryptPasswordTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testPasswordEncryption() {
        String rawPassword = "mojaSigurnaLozinka123";

        // 1. Enkriptujemo lozinku
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 2. Proveravamo da enkriptovana lozinka nije ista kao običan tekst
        assertNotEquals(rawPassword, encodedPassword);

        // 3. Proveravamo da li se originalna lozinka podudara sa hashom (kako Spring radi login)
        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword));

        System.out.println("Original: " + rawPassword);
        System.out.println("Hashed: " + encodedPassword);
    }
}