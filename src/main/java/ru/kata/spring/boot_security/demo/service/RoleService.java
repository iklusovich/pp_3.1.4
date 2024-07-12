package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;

public interface RoleService {
    List<Role> findAll();
    Role findById(Long id);
    Role save(Role role);
    Role update(Role role);
    void delete(Long id);
}
