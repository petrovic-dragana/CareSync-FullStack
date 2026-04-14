package com.caresync.caresync.controller;

import com.caresync.caresync.model.AppointmentStatus;
import com.caresync.caresync.model.Role;
import com.caresync.caresync.model.User;
import com.caresync.caresync.repository.UserRepository;
import com.caresync.caresync.repository.AppointmentRepository; // Proveri kako ti se zove repo za termine
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Da te ne zeza CORS
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @GetMapping("/stats")
    public Map<String, Long> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();

        // Brojimo korisnike iz baze
        stats.put("totalUsers", userRepository.count());

        // Brojimo doktore (proveri da li ti je polje u bazi 'role' ili se filtrira drugačije)
        // Ovo je primer, prilagodi nazivima svojih metoda u Repository-ju
        stats.put("totalDoctors", userRepository.countByRole(Role.ROLE_DOCTOR));
        stats.put("totalNurses", userRepository.countByRole(Role.ROLE_NURSE));

        // Brojimo sve termine
        stats.put("totalAppointments", appointmentRepository.count());

        return stats;
    }
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody User newUser) {
        // Ovde prosleđujemo reč "lozinka", a encoder će napraviti ispravan hash
        newUser.setPassword(passwordEncoder.encode("lozinka"));
        newUser.setMustChangePassword(true); // Ovo polje smo rekli da dodajemo
        userRepository.save(newUser);
        return ResponseEntity.ok("Korisnik uspešno kreiran!");
    }

    @GetMapping("/report")
    public Map<String, Object> getWorkReport() {
        Map<String, Object> report = new HashMap<>();
        long completedAppointments = appointmentRepository.countByStatus(AppointmentStatus.ZAVRSENO);

        report.put("completedAppointments", completedAppointments);
        report.put("revenue", completedAppointments * 2500); // Primer fiksne cene po pregledu
        report.put("reportDate", java.time.LocalDate.now().toString());

        return report;
    }
    @GetMapping("/logs")
    public List<Map<String, String>> getSystemLogs() {
        return List.of(
                Map.of("time", "10:15", "action", "Admin kreirao novog doktora", "user", "admin"),
                Map.of("time", "09:45", "action", "Sestra zakazala termin", "user", "sestra_maja"),
                Map.of("time", "08:30", "action", "Uspešan login u sistem", "user", "dr_marko")
        );
    }
}
