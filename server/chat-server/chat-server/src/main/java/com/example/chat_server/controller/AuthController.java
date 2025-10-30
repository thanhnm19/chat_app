package com.example.chat_server.controller;

import com.example.chat_server.model.User;
import com.example.chat_server.repository.UserRepository;
import com.example.chat_server.service.UserService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {
    private final UserService userService;
    public AuthController(UserService userService) { this.userService = userService; }

    @PostMapping("/register")
    public String register(@RequestBody User user) { return userService.register(user); }

    @PostMapping("/login")
    public String login(@RequestBody User user) { return userService.login(user); }

    @PostMapping("/logout")
    public void logout(@RequestParam String username) { userService.setOnline(username, false); }

    @GetMapping("/online")
    public List<User> getOnlineUsers() { return userService.getOnlineUsers(); }
}

