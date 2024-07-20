package ru.kata.spring.boot_security.demo.util;

public class PersonErrorResponse {
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public PersonErrorResponse(String message) {
        this.message = message;
    }
}
