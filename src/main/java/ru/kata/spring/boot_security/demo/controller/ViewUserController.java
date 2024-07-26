package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewUserController {

    @GetMapping("/admin")
    public String renderAdminPage() {
        return "admin";
    }

    @GetMapping("/admin/users")
    public String renderUserPage() {
        return "userPage";
    }
    @GetMapping("/user")
    public String renderCurrentUserPage() {
        return "currentUserPage";
    }
}
