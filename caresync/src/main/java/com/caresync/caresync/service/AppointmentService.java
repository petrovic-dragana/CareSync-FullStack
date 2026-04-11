package com.caresync.caresync.service;

import com.caresync.caresync.model.Appointment;
import com.caresync.caresync.model.Doctor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentService {
//
//    public List<Appointment> getAllAppointments() {
//        return storage.getAppointments();
//    }
//
//    public void saveAppointment(Appointment appointment) throws RuntimeException {
//        // 1. Povezivanje pravog objekta pacijenta
//        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
//            storage.getPatients().stream()
//                    .filter(p -> p.getId().equals(appointment.getPatient().getId()))
//                    .findFirst()
//                    .ifPresent(appointment::setPatient);
//        }
//
//        // 2. Povezivanje pravog objekta doktora
//        Doctor selectedDoctor = null;
//        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
//            selectedDoctor = storage.getDoctors().stream()
//                    .filter(d -> d.getId().equals(appointment.getDoctor().getId()))
//                    .findFirst()
//                    .orElse(null);
//            appointment.setDoctor(selectedDoctor);
//        }
//
//        // --- VALIDACIJE ---
//
//        if (selectedDoctor != null && appointment.getDateTime() != null) {
//            // A) Provera radnog dana (1=Pon, 7=Ned)
//            int dayOfWeek = appointment.getDateTime().getDayOfWeek().getValue();
//            if (!selectedDoctor.getWorkingDays().contains(dayOfWeek)) {
//                throw new RuntimeException("Izabrani lekar ne radi ovim danom!");
//            }
//
//            // B) Provera radnog vremena (npr. od 08:00 do 20:00)
//            LocalTime time = appointment.getDateTime().toLocalTime();
//            if (time.isBefore(LocalTime.of(8, 0)) || time.isAfter(LocalTime.of(19, 30))) {
//                throw new RuntimeException("Poliklinika radi od 08:00 do 20:00!");
//            }
//
//            // C) Provera duplog zakazivanja (Double Booking)
//            boolean isBusy = storage.getAppointments().stream()
//                    .anyMatch(a -> a.getDoctor().getId().equals(appointment.getDoctor().getId())
//                            && a.getDateTime().equals(appointment.getDateTime()));
//
//            if (isBusy) {
//                throw new RuntimeException("Ovaj termin je već zauzet kod izabranog lekara!");
//            }
//        }
//
//        // 3. Osnovna logika za ID i Status
//        if (appointment.getId() == null) {
//            appointment.setId((long) (storage.getAppointments().size() + 1));
//        }
//        if (appointment.getStatus() == null) {
//            appointment.setStatus("ZAKAZANO");
//        }
//
//        storage.getAppointments().add(appointment);
//    }
//    public List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date) {
//        Doctor doc = storage.getDoctors().stream()
//                .filter(d -> d.getId().equals(doctorId))
//                .findFirst().orElse(null);
//
//        if (doc == null || !doc.getWorkingDays().contains(date.getDayOfWeek().getValue())) {
//            return List.of(); // Lekar ne radi tim danom
//        }
//
//
//        List<LocalTime> slots = new ArrayList<>();
//        LocalTime start = LocalTime.of(14, 0); // Recimo od 14h
//        LocalTime end = LocalTime.of(19, 0);   // Do 19h
//
//        while (start.isBefore(end)) {
//            final LocalTime currentSlot = start;
//            // Proveri da li je ovaj slot već zauzet kod ovog doktora na taj datum
//            boolean isTaken = storage.getAppointments().stream()
//                    .anyMatch(a -> a.getDoctor().getId().equals(doctorId) &&
//                            a.getDateTime().toLocalDate().equals(date) &&
//                            a.getDateTime().toLocalTime().equals(currentSlot));
//
//            if (!isTaken) {
//                slots.add(currentSlot);
//            }
//            start = start.plusMinutes(30);
//        }
//        return slots;
//    }
}
