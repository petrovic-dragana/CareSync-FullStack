package com.caresync.caresync.repository;

import com.caresync.caresync.model.MedicalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalServiceRepository extends JpaRepository<MedicalService, Long> {

    List<MedicalService> findBySpecializationIn(List<String> specializations);
}