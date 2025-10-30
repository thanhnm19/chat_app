package com.example.chat_server.controller;

import com.example.chat_server.model.Message;
import com.example.chat_server.repository.MessageRepository;
import com.example.chat_server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private MessageRepository messageRepository;

    /**
     * Khi user kết nối WebSocket và gửi login message
     */
    @MessageMapping("/login")
    public void login(@Header("simpSessionId") String sessionId, @Payload Message message) {
        String username = message.getSender();
        userService.setOnline(username, true);
        System.out.println("✅ " + username + " connected (session: " + sessionId + ")");
    }

    /**
     * Chat nhóm (public)
     */
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message sendPublic(@Payload Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setType("GROUP");
        messageRepository.save(message);

        System.out.println("💬 [GROUP] " + message.getSender() + ": " + message.getContent());
        return message; // gửi lại cho tất cả client
    }

    /**
     * Chat riêng (private)
     */
    @MessageMapping("/private")
    public void sendPrivate(@Payload Message message) {
        String sender = message.getSender();
        String receiver = message.getReceiver();

        message.setType("PRIVATE");
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);

        if (userService.isOnline(receiver)) {
            // gửi cho người nhận
            messagingTemplate.convertAndSendToUser(receiver, "/queue/private", message);
            // gửi lại cho người gửi để họ thấy tin mình đã gửi
            messagingTemplate.convertAndSendToUser(sender, "/queue/private", message);

            System.out.printf("📩 Private %s → %s: %s%n", sender, receiver, message.getContent());
        } else {
            // nếu người nhận offline, báo cho người gửi biết
            Message notice = new Message(null, "System", sender,
                    receiver + " hiện đang offline!", "SYSTEM", LocalDateTime.now());
            messagingTemplate.convertAndSendToUser(sender, "/queue/private", notice);
            System.out.printf("⚠️ %s chưa online, không gửi tin.%n", receiver);
        }
    }

}
