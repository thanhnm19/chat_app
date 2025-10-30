package com.example.chat_server.service;

import com.example.chat_server.model.User;
import com.example.chat_server.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    // ---------- Đăng ký & đăng nhập ----------

    public String register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already exists";
        }
        user.setPassword(encoder.encode(user.getPassword()));
        user.setOnline(false);
        userRepository.save(user);
        return "Register successful";
    }

    public String login(User user) {
        var dbUser = userRepository.findByUsername(user.getUsername());
        if (dbUser.isPresent() && encoder.matches(user.getPassword(), dbUser.get().getPassword())) {
            dbUser.get().setOnline(true);
            userRepository.save(dbUser.get());
            return "Login successful";
        }
        return "Invalid credentials";
    }
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void setOnline(String username, boolean status) {
        userRepository.findByUsername(username).ifPresent(u -> {
            u.setOnline(status);
            userRepository.save(u);
        });
        if (status) onlineUsers.add(username);
        else onlineUsers.remove(username);
    }

    public boolean isOnline(String username) {
        return onlineUsers.contains(username);
    }

    public List<User> getOnlineUsers() {
        return userRepository.findAll().stream()
                .filter(User::isOnline).toList();
    }
}

