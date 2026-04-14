package com.caresync.caresync;

import com.caresync.caresync.model.Role;
import com.caresync.caresync.model.User;
import com.caresync.caresync.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

@DataJpaTest
public class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindByUsername() {
        User user = new User();
        user.setUsername("test.user");
        user.setPassword("password");
        user.setRole(Role.ROLE_DOCTOR);
        userRepository.save(user);

        Optional<User> found = userRepository.findByUsername("test.user");
        assert(found.isPresent());
        assert(found.get().getUsername().equals("test.user"));
    }
}