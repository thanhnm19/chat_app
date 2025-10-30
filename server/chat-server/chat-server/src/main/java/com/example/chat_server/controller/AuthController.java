package com.example.chat_server.controller;

import com.example.chat_server.model.User;
import com.example.chat_server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        Optional<User> registeredUser = userService.register(user);

        if (registeredUser.isPresent()) {
            return ResponseEntity.ok(registeredUser.get());
        } else {
            return ResponseEntity.badRequest().body("User already exists");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> loggedInUser = userService.login(user);

        if (loggedInUser.isPresent()) {
            return ResponseEntity.ok(loggedInUser.get());
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String username) {
        userService.setOnline(username, false);
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/online")
    public ResponseEntity<List<User>> getOnlineUsers() {
        return ResponseEntity.ok(userService.getOnlineUsers());
    }
}
