package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.util.GetUsersResponse;
import ru.kata.spring.boot_security.demo.util.PersonErrorResponse;
import ru.kata.spring.boot_security.demo.util.PersonNotCreatedException;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@RestController
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

    @GetMapping("/admin/api/users")
    public ResponseEntity<GetUsersResponse> getUsers(Principal principal, @RequestParam(value = "id", required = false) Long id) {
        GetUsersResponse response = new GetUsersResponse();
        User currentUser = userService.findByUsername(principal.getName());
        response.setAllUsers(userService.getAll());
        response.setCurrentUser(currentUser);
        response.setAllRoles(roleService.findAll());
        response.setUser(userService.showUser(currentUser.getId()));
        return new ResponseEntity<>(response,  HttpStatus.OK);
    }

    @GetMapping("/admin/api/roles")
    public ResponseEntity<List<Role>> getRoles() {
        return new ResponseEntity<>(roleService.findAll(),  HttpStatus.OK);
    }

    @GetMapping("/admin/api/user/{id}")
    public ResponseEntity<User> getUser(@PathVariable long id) {

        User user = userService.showUser(id);
        return new ResponseEntity<>(user,  HttpStatus.OK);
    }


    @PostMapping("/admin/api/users")
    public ResponseEntity<HttpStatus> createUser(@RequestBody @Valid User user, BindingResult bindingResult, @RequestParam(name = "roles", required = false) Long[] selectedRoles) {
        System.out.println(user);
        if(bindingResult.hasErrors()) {
            StringBuilder sb = new StringBuilder();
          List<FieldError> listError = bindingResult.getFieldErrors();
          for (FieldError error : listError) {
              sb.append(error.getField()).append(" : ").append(error.getDefaultMessage()).append("\n");
          }
            throw new PersonNotCreatedException(sb.toString());
        }

        userService.add(user);
        return new  ResponseEntity<>(HttpStatus.CREATED);
    }


    @PatchMapping("/admin/{id}")
    public ResponseEntity<HttpStatus> updateUser(@RequestBody @Valid User user, BindingResult bindingResult, @RequestParam(name = "roles", required = false) Long[] selectedRoles) {
        if(bindingResult.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (selectedRoles != null && selectedRoles.length > 0) {
            userService.updateUser(user, Arrays.asList(selectedRoles));
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/delete")
    public ResponseEntity<HttpStatus> deletedUser(@RequestParam(value = "id") long id) {
        System.out.println(id);
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


@ExceptionHandler
    public ResponseEntity<PersonErrorResponse> handleException(PersonNotCreatedException e) {
    PersonErrorResponse personErrorResponse = new PersonErrorResponse(e.getMessage());
    return new ResponseEntity<>(personErrorResponse, HttpStatus.BAD_REQUEST);
}
}