package com.caresync.caresync.controller;

import com.caresync.caresync.model.HealthRecord;
import com.caresync.caresync.service.HealthRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Controller
@RequestMapping("/records")
public class HealthRecordController {
//
//    @Autowired
//    private HealthRecordService recordService;
//
//    @PostMapping("/save")
//    public String saveRecord(@ModelAttribute("record") HealthRecord record) {
//        record.setEntryDate(LocalDate.now()); // Automatski postavljamo današnji datum
//        recordService.saveRecord(record);
//        return "redirect:/appointments"; // Vraćamo se na termine
//    }
//
//    @GetMapping("/patient/{id}")
//    public String showPatientHistory(@PathVariable Long id, Model model) {
//        model.addAttribute("history", recordService.getRecordsByPatient(id));
//        return "health-records/history";
//    }
}