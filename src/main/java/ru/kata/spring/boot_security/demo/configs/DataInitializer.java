package ru.kata.spring.boot_security.demo.configs;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.service.UserServiceImp;

import java.util.List;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initData(UserServiceImp userServiceImp, RoleRepository  roleRepository) {
        return args -> {
            Role userRole = new Role();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);

            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);

            User user = new User();
            user.setFirstName("user");
            user.setLastName("user");
            user.setAge((byte) 100);
            user.setEmail("user@mail.ru");
            user.setPassword("123");
            userServiceImp.add(user, List.of(userRole.getId()));

            User admin = new User();
            admin.setFirstName("admin");
            admin.setLastName("admin");
            admin.setAge((byte) 50);
            admin.setEmail("admin@mail.ru");
            admin.setPassword("123");
            userServiceImp.add(admin, List.of(adminRole.getId(), userRole.getId()));
        };
    }
}
