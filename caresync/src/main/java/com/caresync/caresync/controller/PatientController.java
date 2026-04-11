package com.caresync.caresync.controller;

import com.caresync.caresync.model.Patient;

import com.caresync.caresync.service.PatientService;
import org.apache.coyote.http11.filters.IdentityInputFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/patients")
public class PatientController {
    @Autowired
    private PatientService patientService;


//
//    // Prikaz svih pacijenata
//    @GetMapping
//    public String listPatients(Model model) {
//        model.addAttribute("patients", patientService.getAllPatients());
//        return "patients/list";
//    }
//
//    // Prikaz forme za novog pacijenta
//    @GetMapping("/add")
//    public String showAddForm(Model model) {
//        model.addAttribute("patient", new Patient());
//        return "patients/add-form";
//    }

//    // Snimanje pacijenta iz forme
//    @PostMapping("/save")
//    public String savePatient(@ModelAttribute("patient") Patient patient, Model model) {
//        if (patient.getJmbg() == null || !patient.getJmbg().matches("\\d{13}")){
//            model.addAttribute("error", "JMBG mora imati tačno 13 cifara!");
//            model.addAttribute("patient", patient);
//            model.addAttribute("patients", storage.getPatients());
//            return "patients/list";
//        }
//        if (patient.getFirstName().length() < 2 || patient.getLastName().length() < 2){
//            model.addAttribute("error", "Ime i prezime moraju imati barem 2 karaktera!");
//            model.addAttribute("patient", patient);
//            model.addAttribute("patients", storage.getPatients());
//            return "patients/list";
//        }
//
//        if (patient.getId() == null) {
//            patient.setId((long) (storage.getPatients().size() + 1));
//            storage.getPatients().add(patient);
//        }else{
//            for (int i = 0; i < storage.getPatients().size(); i++) {
//                if (storage.getPatients().get(i).getId().equals(patient.getId())) {
//                    storage.getPatients().set(i, patient);
//                    break;
//                }
//            }
//        }
//        return "redirect:/patients";
//
////        patientService.savePatient(patient);
////        return "redirect:/patients"; // Vraća nas na listu nakon snimanja
//    }
//
//    // Brisanje pacijenta
//    @GetMapping("/delete/{id}")
//    public String deletePatient(@PathVariable Long id) {
//        patientService.deletePatient(id);
//        return "redirect:/patients";
//    }
//    @GetMapping("/edit/{id}")
//    public String showEditForm(@PathVariable Long id, Model model) {
//        // Pronađi pacijenta po ID-u iz storage-a
//        Patient patient = storage.getPatients().stream()
//                .filter(p -> p.getId().equals(id))
//                .findFirst()
//                .orElseThrow(() -> new IllegalArgumentException("Nevalidan ID pacijenta:" + id));
//
//        model.addAttribute("patient", patient);
//        return "patients/add-form"; // Koristimo istu formu kao za dodavanje
//    }
}
