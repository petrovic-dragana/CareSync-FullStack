package com.caresync.caresync.service;

import com.caresync.caresync.model.HealthRecord;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthRecordService {

//    public List<HealthRecord> getRecordsByPatient(Long patientId) {
//        // Filtriramo sve zapise tako da dobijemo samo one koji pripadaju određenom pacijentu
//        return storage.getHealthRecords().stream()
//                .filter(record -> record.getPatientId().equals(patientId))
//                .collect(Collectors.toList());
//    }
//
//    public void saveRecord(HealthRecord record) {
//        if (record.getId() == null) {
//            record.setId((long) (storage.getHealthRecords().size() + 1));
//        }
//        storage.getHealthRecords().add(record);
//    }
}
