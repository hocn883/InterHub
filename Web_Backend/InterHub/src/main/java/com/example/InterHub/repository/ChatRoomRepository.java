package com.example.InterHub.repository;

import com.example.InterHub.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository
        extends JpaRepository<ChatRoom, Long> {

    @Query("""
        SELECT c
        FROM ChatRoom c
        WHERE
            (
                c.user1.id = :user1Id
                AND c.user2.id = :user2Id
            )
            OR
            (
                c.user1.id = :user2Id
                AND c.user2.id = :user1Id
            )
    """)
    Optional<ChatRoom> findRoomBetweenUsers(
            @Param("user1Id") Long user1Id,
            @Param("user2Id") Long user2Id
    );

    @Query("""
        SELECT c
        FROM ChatRoom c
        WHERE c.user1.id = :userId
           OR c.user2.id = :userId
        ORDER BY c.lastMessageTime DESC
    """)
    List<ChatRoom> findAllRoomsByUserId(
            @Param("userId") Long userId
    );
}