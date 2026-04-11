package com.caresync.caresync.component;

import com.caresync.caresync.model.Role;
import com.caresync.caresync.model.User;
import com.caresync.caresync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Provera da li baza već ima korisnike (da ne dupliramo pri svakom restartu)
        if (userRepository.count() == 0) {

            // 1. Kreiranje ADMINA
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // Kriptovana lozinka
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);

            // 2. Kreiranje LEKARA
            User doctor = new User();
            doctor.setUsername("lekar");
            doctor.setPassword(passwordEncoder.encode("lekar123"));
            doctor.setRole(Role.ROLE_DOCTOR);
            userRepository.save(doctor);

            // 3. Kreiranje SESTRE
            User nurse = new User();
            nurse.setUsername("sestra");
            nurse.setPassword(passwordEncoder.encode("sestra123"));
            nurse.setRole(Role.ROLE_NURSE);
            userRepository.save(nurse);

            System.out.println("Initial users have been created in the database.");
        }
    }
}