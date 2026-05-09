package com.spendly.controller;

import com.spendly.dto.ChangePasswordRequest;
import com.spendly.dto.UpdateNameRequest;
import com.spendly.dto.UserResponse;
import com.spendly.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getProfile(Authentication auth) {
        return userService.getProfile((String) auth.getPrincipal());
    }

    @PatchMapping("/me")
    public UserResponse updateName(@Valid @RequestBody UpdateNameRequest req, Authentication auth) {
        return userService.updateName((String) auth.getPrincipal(), req);
    }

    @PatchMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@Valid @RequestBody ChangePasswordRequest req, Authentication auth) {
        userService.changePassword((String) auth.getPrincipal(), req);
    }
}
