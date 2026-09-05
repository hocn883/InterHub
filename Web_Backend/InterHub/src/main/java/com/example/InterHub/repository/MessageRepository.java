package com.example.InterHub.repository;

import com.example.InterHub.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository
        extends JpaRepository<Message, Long> {

    List<Message> findByChatRoomIdOrderByCreatedDateAsc(
            Long roomId
    );

    @Query("""
        SELECT COUNT(m)
        FROM Message m
        WHERE m.chatRoom.id = :roomId
        AND m.senderId.id <> :userId
        AND m.isRead = false
    """)
    long countUnreadMessages(
            @Param("roomId") Long roomId,
            @Param("userId") Long userId
    );

    @Modifying(
            clearAutomatically = true,
            flushAutomatically = true
    )
    @Query("""
        UPDATE Message m
        SET m.isRead = true
        WHERE m.chatRoom.id = :roomId
        AND m.senderId.id <> :userId
        AND m.isRead = false
    """)
    int markMessagesAsRead(
            @Param("roomId") Long roomId,
            @Param("userId") Long userId
    );
}