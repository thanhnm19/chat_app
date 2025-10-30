package com.example.chat_server.service;

import com.example.chat_server.model.User;
import com.example.chat_server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();

    @Autowired
    public UserService(UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // ---------- Đăng ký ----------
    public Optional<User> register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return Optional.empty();
        }

        user.setPassword(encoder.encode(user.getPassword()));
        user.setOnline(false);
        User savedUser = userRepository.save(user);
        return Optional.of(savedUser);
    }

    // ---------- Đăng nhập ----------
    public Optional<User> login(User user) {
        Optional<User> dbUser = userRepository.findByUsername(user.getUsername());

        if (dbUser.isPresent() && encoder.matches(user.getPassword(), dbUser.get().getPassword())) {
            dbUser.get().setOnline(true);
            userRepository.save(dbUser.get());
            onlineUsers.add(dbUser.get().getUsername());

            broadcastStatusChange();
            return dbUser;
        }

        return Optional.empty();
    }

    // ---------- Logout / Trạng thái ----------
    public void setOnline(String username, boolean status) {
        userRepository.findByUsername(username).ifPresent(u -> {
            u.setOnline(status);
            userRepository.save(u);
        });

        if (status) {
            onlineUsers.add(username);
        } else {
            onlineUsers.remove(username);
        }

        broadcastStatusChange();
    }

    public boolean isOnline(String username) {
        return onlineUsers.contains(username);
    }

    // ---------- Lấy danh sách user online ----------
    public List<User> getOnlineUsers() {
        return userRepository.findAll()
                .stream()
                .filter(User::isOnline)
                .toList();
    }

    // ---------- Broadcast danh sách online qua WebSocket ----------
    private void broadcastStatusChange() {
        List<User> onlineList = getOnlineUsers();
        System.out.println("📢 Broadcasting online users: " +
                onlineList.stream().map(User::getUsername).toList());
        messagingTemplate.convertAndSend("/topic/status", onlineList);
    }

}
