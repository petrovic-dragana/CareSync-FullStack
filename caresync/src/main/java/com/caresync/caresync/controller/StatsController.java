package com.caresync.caresync.controller;

import com.caresync.caresync.dto.NurseDTO;
import com.caresync.caresync.model.Appointment;
import com.caresync.caresync.model.Role;
import com.caresync.caresync.repository.AppointmentRepository;
import com.caresync.caresync.repository.PatientRepository;
import com.caresync.caresync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:3000")
public class StatsController {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/nurse-dashboard")
    public ResponseEntity<NurseDTO> getNurseStats() {
        NurseDTO dto = new NurseDTO();
        LocalDate today = LocalDate.now();

        // 1. Brojimo sve pacijente
        dto.setTotalPatients(patientRepository.count());

        // 2. Brojimo aktivne lekare (User sa rolom ROLE_DOCTOR)
        dto.setActiveDoctors(userRepository.countByRole(Role.ROLE_DOCTOR));

        // 3. Uzimamo SVE termine za DANASNJI DATUM
        List<Appointment> todayAppointments = appointmentRepository.findByAppointmentDate(today);

        dto.setTodayList(todayAppointments);
        dto.setTodayAppointmentsCount(todayAppointments.size());

        return ResponseEntity.ok(dto);
    }
    @GetMapping("/stats/doctor-stats")
    public ResponseEntity<?> getDoctorStats() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // 1. Dobijamo sve termine za tog doktora
        List<Appointment> allMyApps = appointmentRepository.findByDoctorUsername(username);
        LocalDate today = LocalDate.now();

        // 2. Izračunavamo cifre pomoću Stream-a (brzo i lako)
        long totalPatients = allMyApps.stream()
                .map(app -> app.getPatient().getId())
                .distinct() // Brojimo unikatne pacijente
                .count();

        long todayApps = allMyApps.stream()
                .filter(app -> app.getAppointmentDate().equals(today))
                .count();

        long completedToday = allMyApps.stream()
                .filter(app -> app.getAppointmentDate().equals(today))
                .filter(app -> "ZAVRSENO".equals(app.getStatus().name()))
                .count();

        // 3. Pakujemo u Mapu da React dobije JSON koji očekuje
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatientsServed", totalPatients);
        stats.put("todayAppointments", todayApps);
        stats.put("completedToday", completedToday);
        stats.put("averageConsultationTime", "20 min"); // Ovo ostavi statički, niko ti neće zameriti

        return ResponseEntity.ok(stats);
    }
}