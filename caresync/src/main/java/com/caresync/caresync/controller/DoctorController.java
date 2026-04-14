package com.caresync.caresync.controller;

import com.caresync.caresync.model.Appointment;
import com.caresync.caresync.model.Doctor;
import com.caresync.caresync.repository.AppointmentRepository;
import com.caresync.caresync.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class DoctorController {
    @Autowired
    private DoctorService doctorService;
    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping("/my-appointments")
    public List<Appointment> getMyPatients() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return appointmentRepository.findByDoctorUsername(username);
    }
    @GetMapping("/stats")
    public Map<String, Long> getDoctorStats() {
        String drName = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Long> stats = new HashMap<>();

        List<Appointment> myApps = appointmentRepository.findByDoctorUsername(drName);

        stats.put("total", (long) myApps.size());
        stats.put("completed", myApps.stream().filter(a -> "ZAVRSENO".equals(a.getStatus())).count());

        return stats;
    }

}
