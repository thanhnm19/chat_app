package com.example.chat_server.config;

import com.example.chat_server.service.UserService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;

@Component
public class WebSocketEventListener {

    private final UserService userService;
    private final SimpMessageSendingOperations messagingTemplate;

    public WebSocketEventListener(UserService userService, SimpMessageSendingOperations messagingTemplate) {
        this.userService = userService;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = accessor.getFirstNativeHeader("username");
        if (username != null) {
            userService.setOnline(username, true);
            messagingTemplate.convertAndSend("/topic/status", username + " is ONLINE");
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) Objects.requireNonNull(accessor.getSessionAttributes()).get("username");
        if (username != null) {
            userService.setOnline(username, false);
            messagingTemplate.convertAndSend("/topic/status", username + " is OFFLINE");
        }
    }
}
