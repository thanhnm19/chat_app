package com.example.chat_server.config;

import com.example.chat_server.service.UserService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final UserService userService;

    public ChatWebSocketHandler(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // username lấy từ param URL: /chat?username=alice
        String username = Objects.requireNonNull(session.getUri())
                .getQuery().split("=")[1];
        sessions.put(username, session);
        userService.setOnline(username, true);
        broadcast("SERVER", username + " vừa online!");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String username = getUsername(session);
        sessions.remove(username);
        userService.setOnline(username, false);
        broadcast("SERVER", username + " vừa offline!");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String username = getUsername(session);
        broadcast(username, message.getPayload());
    }

    private void broadcast(String sender, String message) throws Exception {
        for (WebSocketSession s : sessions.values()) {
            s.sendMessage(new TextMessage(sender + ": " + message));
        }
    }

    private String getUsername(WebSocketSession session) {
        return Objects.requireNonNull(session.getUri())
                .getQuery().split("=")[1];
    }
}
