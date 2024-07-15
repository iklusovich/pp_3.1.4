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


//    @GetMapping("/admin")
//    public String showAdmin(@ModelAttribute("addUser") User user, Model model, Principal principal) {
//        model.addAttribute("allUsers", userService.getAll());
//        model.addAttribute("allRoles", roleService.findAll());
//        User currentUser = userService.findByUsername(principal.getName());
//        model.addAttribute("currentUser", currentUser);
//        return "adminPage";
//    }

    @PostMapping("/admin")
    public String createUser(@ModelAttribute("addUser") User user, @RequestParam(name = "roles", required = false) Long[] selectedRoles) {
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

    @PatchMapping("/admin/{id}")
    public String updateUser(@ModelAttribute("user") User user,  @RequestParam(name = "roles", required = false) Long[] selectedRoles) {
        System.out.println("go");
        System.out.println(user);
        System.out.println(selectedRoles);
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