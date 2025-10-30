package com.example.chat_server.repository;

import com.example.chat_server.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> { }