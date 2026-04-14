package com.caresync.caresync.dto;



import com.caresync.caresync.model.Appointment;
import lombok.Data;
import java.util.List;

@Data
public class NurseDTO {
    private long totalPatients;
    private long todayAppointmentsCount;
    private long activeDoctors;
    private List<Appointment> todayList; // Ovo je lista koju tvoja tabela čeka
}