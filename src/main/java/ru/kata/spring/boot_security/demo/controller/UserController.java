package ru.kata.spring.boot_security.demo.controller;


import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.naming.Binding;
import javax.validation.Valid;
import java.security.Principal;
import java.util.Arrays;


@Controller
public class UserController {

    private final UserService userService;
    private final RoleService roleService;

    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/user")
    public String showUser(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("showUser", userService.showUser(user.getId()));
        return "userPage";
    }

    @GetMapping("/admin")
    public String showUserFromAdmin(@ModelAttribute("addUser") User user, Model model, Principal principal, @RequestParam(value = "id", required = false) Long id) {
        model.addAttribute("allRoles", roleService.findAll());
        User currentUser = userService.findByUsername(principal.getName());
        model.addAttribute("currentUser", currentUser);

        model.addAttribute("allUsers", userService.getAll());
        if (id != null) {
            model.addAttribute("showUser", userService.showUser(id));
            return "userPage";
        } else {
            model.addAttribute("user", userService.showUser(currentUser.getId()));
            return "adminPage";
        }

    }

    @PostMapping("/admin")
    public String createUser(@ModelAttribute("addUser") User user, @RequestParam(name = "roles", required = false) Long[] selectedRoles) {
        if (selectedRoles != null && selectedRoles.length > 0) {
            userService.add(user, Arrays.asList(selectedRoles));
        }
        return "redirect:/admin";
    }


    @PatchMapping("/admin/{id}")
    public String updateUser(@ModelAttribute("user") User user, @RequestParam(name = "roles", required = false) Long[] selectedRoles) {
        if (selectedRoles != null && selectedRoles.length > 0) {
            userService.updateUser(user, Arrays.asList(selectedRoles));
        }
        return "redirect:/admin";
    }

    @GetMapping("/admin/delete")
    public String deletedUser(@RequestParam(value = "id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

}