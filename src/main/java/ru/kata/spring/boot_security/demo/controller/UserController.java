package ru.kata.spring.boot_security.demo.controller;


import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

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

    @GetMapping("/admin/addNewUser")
    public String addNewUser(Model model) {
        model.addAttribute("addUser", new User());
        model.addAttribute("allRoles", roleService.findAll());
        return "add-user";
    }

    @GetMapping("/user")
    public String showUser(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", userService.showUser(user.getId()));
        return "userPage";
    }

    @GetMapping("/admin/show")
    public String showUserFromAdmin(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", userService.showUser(user.getId()));
        return "userPage";
    }

    @GetMapping("/admin")
    public String showAdmin(Model model, Principal principal) {
        model.addAttribute("allUsers", userService.getAll());
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("currentUserId", user.getId());
        return "adminPage";
    }

    @PostMapping("/admin")
    public String createUser(@ModelAttribute("addUser") User user, @RequestParam(name = "selectedRoles", required = false) Long[] selectedRoles) {


        if (selectedRoles != null && selectedRoles.length > 0) {
            userService.add(user, Arrays.asList(selectedRoles));
        }
        return "redirect:/admin";
    }

    @GetMapping("/admin/edit")
    public String editUser(Model model, @RequestParam(value = "id") Long id) {
        model.addAttribute("addUser", userService.showUser(id));
        model.addAttribute("allRoles", roleService.findAll());
        return "edit-user";
    }

    @PostMapping("/admin/{id}")
    public String updateUser(@ModelAttribute("addUser") User user,  @RequestParam(name = "selectedRoles", required = false) Long[] selectedRoles) {
        if (selectedRoles != null && selectedRoles.length > 0) {
            userService.updateUser(user, Arrays.asList(selectedRoles));
        }
        return "redirect:/admin";
    }

    @GetMapping("/admin/delete")
    public String deletedUser( @RequestParam(value = "id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}