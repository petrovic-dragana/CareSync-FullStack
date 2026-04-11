package com.caresync.caresync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

//
//    @GetMapping("/")
//    public String index(Model model) {
//        // Možemo poslati par statistika na početnu stranu
//        model.addAttribute("totalPatients", storage.getPatients().size());
//        model.addAttribute("totalAppointments", storage.getAppointments().size());
//        model.addAttribute("totalDoctors", storage.getDoctors().size());
//        return "index";
//    }
}