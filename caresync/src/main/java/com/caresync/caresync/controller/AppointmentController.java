package com.caresync.caresync.controller;

import com.caresync.caresync.model.*;

import com.caresync.caresync.service.AppointmentService;
import com.caresync.caresync.service.DoctorService;
import com.caresync.caresync.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Controller
@RequestMapping("/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

//    @GetMapping("/add")
//    public String showAddForm(@RequestParam(required = false) Long doctorId, Model model) {
//        Appointment appointment = new Appointment();
//
//        // Ako smo došli sa stranice doktora, poveži ga
//        if (doctorId != null) {
//            Doctor d = new Doctor();
//            d.setId(doctorId);
//            appointment.setDoctor(d);
//        }
//
//        model.addAttribute("appointment", appointment); // Šaljemo ovaj, a ne novi!
//        model.addAttribute("allPatients", patientService.getAllPatients());
//        model.addAttribute("allDoctors", doctorService.getAllDoctors());
//        return "appointments/add-form";
//    }
//    @PostMapping("/save")
//    public String saveAppointment(@ModelAttribute("appointment") Appointment appointment,
//                                  @RequestParam(required = false) String firstName,
//                                  @RequestParam(required = false) String lastName,
//                                  @RequestParam(required = false) String jmbg,
//                                  Model model) {
//        try {
//            // Logika za "Quick Add" pacijenta
//            if (appointment.getPatient() == null || appointment.getPatient().getId() == null) {
//                if (firstName != null && !firstName.isEmpty()) {
//                    Patient newP = new Patient();
//                    // Generisanje ID-a na osnovu trenutne veličine liste
//                    newP.setId((long) (storage.getPatients().size() + 1));
//                    newP.setFirstName(firstName);
//                    newP.setLastName(lastName);
//                    newP.setJmbg(jmbg != null && !jmbg.isEmpty() ? jmbg : "0000000000000");
//
//                    // Snimamo ga u našu "bazu"
//                    storage.getPatients().add(newP);
//                    // Povezujemo ga sa terminom
//                    appointment.setPatient(newP);
//                } else {
//                    throw new RuntimeException("Morate izabrati pacijenta ili uneti podatke za novog!");
//                }
//            }
//
//            appointmentService.saveAppointment(appointment);
//            return "redirect:/appointments";
//        } catch (RuntimeException e) {
//            model.addAttribute("error", e.getMessage());
//            // Vraćamo potrebne liste da se forma ne bi ispraznila pri grešci
//            model.addAttribute("allPatients", storage.getPatients());
//            model.addAttribute("allDoctors", storage.getDoctors());
//            return "appointments/add-form";
//        }
//    }
//
//    @GetMapping
//    public String listAppointments(Model model) {
//        List<Appointment> all = appointmentService.getAllAppointments();
//
//        // Samo zakazani (idu u gornju tabelu)
//        List<Appointment> active = all.stream()
//                .filter(a -> "ZAKAZANO".equals(a.getStatus()))
//                .toList();
//
//        // Samo završeni (idu u istoriju)
//        List<Appointment> history = all.stream()
//                .filter(a -> "ZAVRŠENO".equals(a.getStatus()))
//                .toList();
//
//        model.addAttribute("activeAppointments", active);
//        model.addAttribute("historyAppointments", history);
//        model.addAttribute("allServices", storage.getServices());
//
//        return "appointments/list";
//    }
//
//    @PostMapping("/complete-process")
//    public String processCompletion(@RequestParam Long appointmentId, @RequestParam Long serviceId) {
//        // 1. Pronađi termin (koristimo stream jer možda nemaš metodu getById u servisu)
//        Appointment app = storage.getAppointments().stream()
//                .filter(a -> a.getId().equals(appointmentId))
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));
//
//        // 2. Pronađi uslugu da uzmeš podatke (npr. cenu ili naziv)
//        MedicalService service = storage.getServices().stream()
//                .filter(s -> s.getId().equals(serviceId))
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Usluga nije pronađena"));
//
//
//
//        app.setPrice(service.getPrice()); // Ovde prepisujemo cenu iz usluge u termin
//        app.setStatus("ZAVRŠENO");
//
//        return "redirect:/appointments";
//    }
//    @GetMapping("/finish/{id}")
//    public String finishAppointment(@PathVariable Long id) {
//        appointmentService.getAllAppointments().stream()
//                .filter(a -> a.getId().equals(id))
//                .findFirst()
//                .ifPresent(a -> a.setStatus("ZAVRŠENO"));
//        return "redirect:/appointments";
//    }
//    @GetMapping("/complete/{id}")
//    public String completeAppointment(@PathVariable Long id, Model model) {
//        // Pronađemo termin (u praksi bi ovde išao servis, ali za sada može direktno iz storage-a)
//        // Simuliramo prelazak na formu za HealthRecord
//        HealthRecord newRecord = new HealthRecord();
//        // Automatski povezujemo karton sa pacijentom iz tog termina
//        model.addAttribute("record", newRecord);
//        model.addAttribute("appointmentId", id);
//        return "health-records/add-form";
//    }
//    @GetMapping("/available-slots")
//    @ResponseBody // Vraća čiste podatke (JSON), a ne HTML stranicu
//    public List<LocalTime> getSlots(@RequestParam Long doctorId, @RequestParam String date) {
//        LocalDate localDate = LocalDate.parse(date);
//        return appointmentService.getAvailableSlots(doctorId, localDate);
//    }
}
