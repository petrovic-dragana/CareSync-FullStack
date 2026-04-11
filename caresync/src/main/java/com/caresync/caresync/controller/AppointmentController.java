package com.caresync.caresync.controller;

import com.caresync.caresync.model.*;

import com.caresync.caresync.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // 1. SESTRA ZAKAZUJE (Status: ZAKAZANO)
    @PostMapping("/schedule")
    public ResponseEntity<Appointment> schedule(@RequestBody Appointment appointment) {
        appointment.setStatus(AppointmentStatus.ZAKAZANO);
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    // 2. LEKAR UNOSI ZAKLJUČAK (Status: ZAVRSENO)
    @PutMapping("/{id}/diagnose")
    public ResponseEntity<Appointment> finishAppointment(
            @PathVariable Long id,
            @RequestBody Map<String, String> data) {

        Appointment app = appointmentRepository.findById(id).get();
        app.setDiagnosis(data.get("diagnosis"));
        app.setTherapy(data.get("therapy"));
        app.setStatus(AppointmentStatus.ZAVRSENO);

        return ResponseEntity.ok(appointmentRepository.save(app));
    }

    // 3. SESTRA NAPLAĆUJE (Status: NAPLACENO)
    @PutMapping("/{id}/pay")
    public ResponseEntity<Appointment> pay(@PathVariable Long id, @RequestBody Double price) {
        Appointment app = appointmentRepository.findById(id).get();

        if (app.getStatus() != AppointmentStatus.ZAVRSENO) {
            throw new RuntimeException("Pregled još nije završen kod lekara!");
        }

        app.setPrice(price);
        app.setStatus(AppointmentStatus.NAPLACENO);
        return ResponseEntity.ok(appointmentRepository.save(app));
    }
}