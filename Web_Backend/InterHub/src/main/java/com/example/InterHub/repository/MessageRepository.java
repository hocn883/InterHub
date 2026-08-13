package com.example.InterHub.repository;

import com.example.InterHub.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByChatRoomIdOrderByCreatedDateDesc(
            Long chatRoomId,
            Pageable pageable
    );
}