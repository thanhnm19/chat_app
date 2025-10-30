package com.example.chat_server.repository;

import com.example.chat_server.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> { }