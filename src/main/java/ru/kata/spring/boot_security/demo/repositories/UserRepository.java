package ru.kata.spring.boot_security.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.User;

@Component
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
