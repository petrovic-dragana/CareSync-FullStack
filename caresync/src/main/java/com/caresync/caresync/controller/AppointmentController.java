package com.caresync.caresync.controller;

import com.caresync.caresync.dto.AppointmentRequest;
import com.caresync.caresync.dto.DiagnosisDTO;
import com.caresync.caresync.model.*;

import com.caresync.caresync.repository.AppointmentRepository;
import com.caresync.caresync.repository.MedicalServiceRepository;
import com.caresync.caresync.repository.PatientRepository;
import com.caresync.caresync.repository.UserRepository;
import com.caresync.caresync.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private MedicalServiceRepository medicalServiceRepository;

    @GetMapping("")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

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
    public ResponseEntity<?> scheduleAppointment(@RequestBody AppointmentRequest request) {
        Appointment appointment = new Appointment();

        // 1. Pronađi doktora u bazi pomoću ID-a iz requesta
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doktor nije pronađen"));
        appointment.setDoctor(doctor);

        // 2. Pronađi pacijenta (ili kreiraj novog ako je sestra tako izabrala)
        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Pacijent nije pronađen"));
            appointment.setPatient(patient);
        } else if (request.getNewPatient() != null) {
            // KREIRAMO NOVOG PACIJENTA AKO NE POSTOJI
            Patient newPt = new Patient();
            newPt.setFirstName(request.getNewPatient().getFirstName());
            newPt.setLastName(request.getNewPatient().getLastName());
            newPt.setPhone(request.getNewPatient().getPhone());
            // Obavezno sačuvaj pacijenta pre nego što ga dodeliš terminu
            Patient savedPt = patientRepository.save(newPt);
            appointment.setPatient(savedPt);
        } else {
            throw new RuntimeException("Morate izabrati ili kreirati pacijenta!");
        }

        // 3. Parsiraj datum i vreme
        appointment.setAppointmentDate(LocalDate.parse(request.getDate()));
        appointment.setAppointmentTime(LocalTime.parse(request.getTime()));

        // 4. Postavi početni status
        appointment.setStatus(AppointmentStatus.ZAKAZANO);

        appointmentRepository.save(appointment);
        return ResponseEntity.ok("Uspešno zakazano");
    }
    // 2. LEKAR UNOSI ZAKLJUČAK (Koristimo isključivo DTO verziju)
    @PutMapping("/{id}/diagnose")
    public ResponseEntity<Appointment> finishAppointment(@PathVariable Long id, @RequestBody DiagnosisDTO dto) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        app.setAnamnesis(dto.getAnamnesis());
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
    // Dodaj ovo u AppointmentController.java
    @GetMapping("/booked-slots")
    public ResponseEntity<List<String>> getBookedSlots(@RequestParam Long doctorId, @RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, localDate);

            // Uzimamo samo vreme i pretvaramo u string (npr. "16:30")
            List<String> bookedTimes = appointments.stream()
                    .map(app -> app.getAppointmentTime().toString().substring(0, 5))
                    .toList();

            return ResponseEntity.ok(bookedTimes);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    @GetMapping("/{id}/available-services")
    public ResponseEntity<List<MedicalService>> getAvailableServices(@PathVariable Long id) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));

        String doctorSpec = app.getDoctor().getSpecialization();
        return ResponseEntity.ok(medicalServiceRepository.findBySpecializationIn(List.of("SVE", doctorSpec)));
    }
    @GetMapping("/my-today")
    public List<Appointment> getMyTodayAppointments() {
        // Izvlačimo username ulogovanog doktora iz tokena
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Uzimamo sve njegove termine
        List<Appointment> allMyApps = appointmentRepository.findByDoctorUsername(username);

        // Filtriramo samo one koji su za današnji datum
        LocalDate today = LocalDate.now();
        return allMyApps.stream()
                .filter(app -> app.getAppointmentDate().equals(today))
                .filter(app -> app.getStatus() != AppointmentStatus.ZAVRSENO) // Opciono: samo oni koji nisu gotovi
                .toList();
    }
}