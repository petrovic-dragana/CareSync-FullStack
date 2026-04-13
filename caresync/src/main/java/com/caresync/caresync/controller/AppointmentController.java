package com.caresync.caresync.controller;

import com.caresync.caresync.dto.DiagnosisDTO;
import com.caresync.caresync.model.*;

import com.caresync.caresync.repository.AppointmentRepository;
import com.caresync.caresync.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;


    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}/history")
    public List<Appointment> getPatientHistory(@PathVariable Long patientId) {
        // Definišemo statuse koje smatramo "istorijom" (završeni i plaćeni pregledi)
        List<AppointmentStatus> historyStatuses = List.of(
                AppointmentStatus.ZAVRSENO,
                AppointmentStatus.NAPLACENO
        );

        return appointmentRepository.findByPatientIdAndStatusInOrderByCreatedAtDesc(patientId, historyStatuses);
    }

    @GetMapping("/today")
    public List<Appointment> getTodayAppointments() {
        return appointmentService.getAllAppointments();
    }

    // 1. SESTRA ZAKAZUJE
    @PostMapping("/schedule")
    public ResponseEntity<Appointment> schedule(@RequestBody Appointment appointment) {
        appointment.setStatus(AppointmentStatus.ZAKAZANO);
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    // 2. LEKAR UNOSI ZAKLJUČAK (Koristimo isključivo DTO verziju)
    @PutMapping("/{id}/diagnose")
    public ResponseEntity<Appointment> finishAppointment(@PathVariable Long id, @RequestBody DiagnosisDTO dto) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        app.setDiagnosis(dto.getDiagnosis());
        app.setTherapy(dto.getTherapy());
        app.setStatus(AppointmentStatus.ZAVRSENO);

        return ResponseEntity.ok(appointmentRepository.save(app));
    }

    // 3. SESTRA NAPLAĆUJE
    @PutMapping("/{id}/pay")
    public ResponseEntity<Appointment> pay(@PathVariable Long id, @RequestBody Double price) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (app.getStatus() != AppointmentStatus.ZAVRSENO) {
            return ResponseEntity.badRequest().body(null);
        }

        app.setPrice(price);
        app.setStatus(AppointmentStatus.NAPLACENO);
        return ResponseEntity.ok(appointmentRepository.save(app));
    }
}