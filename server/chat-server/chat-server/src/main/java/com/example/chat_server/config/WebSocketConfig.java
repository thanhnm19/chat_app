package com.example.chat_server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // server -> client
        config.setApplicationDestinationPrefixes("/app"); // client -> server
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    @Override
                    protected Principal determineUser(
                            org.springframework.http.server.ServerHttpRequest request,
                            org.springframework.web.socket.WebSocketHandler wsHandler,
                            java.util.Map<String, Object> attributes) {

                        // Lấy username từ query param ?user=alice
                        String query = request.getURI().getQuery();
                        if (query != null && query.startsWith("user=")) {
                            String username = query.substring(5);
                            return () -> username;
                        }
                        return super.determineUser(request, wsHandler, attributes);
                    }
                })
                .withSockJS();
    }
}

