package com.caresync.caresync.repository;

import com.caresync.caresync.model.Appointment;
import com.caresync.caresync.model.AppointmentStatus;
import com.caresync.caresync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);
    List<Appointment> findByPatientIdAndStatusInOrderByCreatedAtDesc(Long patientId, List<AppointmentStatus> statuses);

    // Lekar će videti samo svoje termine koji nisu još naplaćeni
    List<Appointment> findByDoctorAndStatusNot(User doctor, AppointmentStatus status);

    // Sestra će videti sve termine koji su ZAVRSENO da bi ih naplatila
    List<Appointment> findByStatus(AppointmentStatus status);
}
