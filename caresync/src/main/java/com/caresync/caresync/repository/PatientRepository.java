package com.caresync.caresync.repository;

import com.caresync.caresync.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // Ovde možeš dodati pretragu po JMBG-u za proveru duplikata
    Optional<Patient> findByJmbg(String jmbg);
}