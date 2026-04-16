package com.caresync.caresync.repository;

import com.caresync.caresync.model.Appointment;
import com.caresync.caresync.model.AppointmentStatus;
import com.caresync.caresync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);

    List<Appointment> findByPatientIdAndStatusInOrderByCreatedAtDesc(Long patientId, List<AppointmentStatus> statuses);


    List<Appointment> findByDoctorUsername(String username);

    List<Appointment> findByAppointmentDate(LocalDate date);

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);

    long countByStatus(AppointmentStatus status);

    List<Appointment> findByStatusAndAppointmentDateGreaterThanEqual(AppointmentStatus status, LocalDate date);
}
