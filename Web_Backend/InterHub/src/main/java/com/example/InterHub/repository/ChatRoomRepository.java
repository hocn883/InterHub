package com.example.InterHub.repository;

import com.example.InterHub.entity.ChatRoom;
import com.example.InterHub.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByUser1IdAndUser2Id(
            Long user1Id,
            Long user2Id
    );

    List<ChatRoom> findByUser1IdOrUser2IdOrderByLastMessageTimeDesc(
            Long user1Id,
            Long user2Id
    );
    @Query("""
    SELECT c
    FROM ChatRoom c
    WHERE
        (c.user1.id = :user1Id AND c.user2.id = :user2Id)
        OR
        (c.user1.id = :user2Id AND c.user2.id = :user1Id)
""")
    Optional<ChatRoom> findRoomBetweenUsers(
            Long user1Id,
            Long user2Id
    );
    List<Message> findByIdOrderByCreatedDateAsc(Long roomId);
}