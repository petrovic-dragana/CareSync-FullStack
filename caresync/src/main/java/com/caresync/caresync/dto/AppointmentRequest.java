package com.caresync.caresync.dto;

import lombok.Data;

@Data
public class AppointmentRequest {
    private Long doctorId;
    private Long patientId;
    private String date; // Dolazi kao "2026-04-13"
    private String time; // Dolazi kao "14:30"

    // Za slučaj da sestra registruje novog pacijenta "u hodu"
    private NewPatientRequest newPatient;

    @Data
    public static class NewPatientRequest {
        private String firstName;
        private String lastName;
        private String phone;
    }
}
