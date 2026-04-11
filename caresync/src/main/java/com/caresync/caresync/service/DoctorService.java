package com.caresync.caresync.service;

import com.caresync.caresync.model.Doctor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
//
//    public List<Doctor> getAllDoctors() {
//        // Sortiramo listu pre slanja na web
//        return storage.getDoctors().stream()
//                .sorted((d1, d2) -> {
//                    int res = d1.getSpecialization().compareToIgnoreCase(d2.getSpecialization());
//                    if (res == 0) {
//                        return d1.getFirstName().compareToIgnoreCase(d2.getFirstName());
//                    }
//                    return res;
//                })
//                .collect(Collectors.toList());
//    }
}
