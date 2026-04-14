package com.caresync.caresync.controller;

import com.caresync.caresync.model.Role;
import com.caresync.caresync.model.User;
import com.caresync.caresync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired // OBAVEZNO: Da bi Spring ubacio bazu u kontroler
    private UserRepository userRepository;

    @GetMapping("/doctors")
    public List<User> getAllDoctors() {
        return userRepository.findByRole(Role.ROLE_DOCTOR);
    }
}
