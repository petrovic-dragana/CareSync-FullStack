//package com.caresync.caresync.repository;
//
//import com.caresync.caresync.model.*;
//import org.springframework.stereotype.Component;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Component
//public class DataStorage {
//    private List<Patient> patients = new ArrayList<>();
//    private List<Doctor> doctors = new ArrayList<>();
//    private List<Staff> staffMembers = new ArrayList<>();
//    private List<MedicalService> services = new ArrayList<>();
//    private List<ClinicBranch> branches = new ArrayList<>();
//    private List<Appointment> appointments = new ArrayList<>();
//    private List<HealthRecord> healthRecords = new ArrayList<>();
//    private List<Review> reviews = new ArrayList<>();
//
//    public DataStorage() {
//        seedData();
//    }
//
//    private void seedData() {
//        // 1. Dodavanje lokacija (Branches)
//        ClinicBranch central = new ClinicBranch(1L, "CareSync Central", "Bulevar Oslobođenja 1", "Beograd", "011/123-456");
//        ClinicBranch nbg = new ClinicBranch(2L, "CareSync NBG", "Jurija Gagarina 20", "Novi Beograd", "011/987-654");
//        branches.add(central);
//        branches.add(nbg);
//
//        // 2. Dodavanje doktora (Povezujemo ih sa ID-jem lokacije)
//        doctors.add(new Doctor(1L, "Marko", "Marković", "Kardiolog", "LIC-123", 1L, List.of(1, 3)));
//        doctors.add(new Doctor(2L, "Jelena", "Janković", "Pedijatar", "LIC-456", 2L, List.of(2, 4)));
//        doctors.add(new Doctor(3L, "Dragan", "Stojković", "Hirurg", "LIC-789", 2L, List.of(5)));
//        doctors.add(new Doctor(4L, "Ivana", "Ivić", "Dermatolog", "LIC-000", 1L, List.of(1, 2, 3, 4, 5)));
//        doctors.add(new Doctor(5L, "Nikola", "Nikić", "Oftalmolog", "LIC-111", 1L, List.of(2, 4)));
//
//        // 3. Dodavanje pacijenata (Da tabela ne bude prazna)
//        patients.add(new Patient(1L, "Petar", "Petrović", "1234567890123", "petar@email.com", "064/111", "Muški"));
//        patients.add(new Patient(2L, "Milica", "Mirić", "9876543210321", "milica@email.com", "065/222", "Ženski"));
//        patients.add(new Patient(3L, "Ana", "Anić", "4455667788990", "ana@email.com", "061/333", "Ženski"));
//        patients.add(new Patient(4L, "Vuk", "Vukić", "1122334455667", "vuk@email.com", "062/444", "Muški"));
//
//        // 4. Dodavanje usluga
//        services.add(new MedicalService(1L, "Sistematski pregled", 5000.0, 30));
//        services.add(new MedicalService(3L, "Kontrola", 2500.0, 30));
//        services.add(new MedicalService(2L, "Ultrazvuk srca", 4500.0, 45));
//    }
//
//    public List<Patient> getPatients() {
//        return patients;
//    }
//
//    public List<Doctor> getDoctors() {
//        return doctors;
//    }
//
//    public List<Staff> getStaffMembers() {
//        return staffMembers;
//    }
//
//    public List<MedicalService> getServices() {
//        return services;
//    }
//
//    public List<ClinicBranch> getBranches() {
//        return branches;
//    }
//
//    public List<Appointment> getAppointments() {
//        return appointments;
//    }
//
//    public List<HealthRecord> getHealthRecords() {
//        return healthRecords;
//    }
//
//    public List<Review> getReviews() {
//        return reviews;
//    }
//}
