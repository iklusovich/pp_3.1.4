package ru.kata.spring.boot_security.demo.dao;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;


public interface UserDao {
    List<User> getAll();
    void addUser(User user);
    void updateUser(User user);
    void deleteUser(long id);
    User showUser(Long id);
}
