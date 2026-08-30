package com.example.InterHub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_chat_room_users",
                        columnNames = {"user1_id", "user2_id"}
                )
        }
)

public class ChatRoom extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(name = "last_message", columnDefinition = "TEXT")
    private String lastMessage;

    @Column(name = "last_message_time")
    private LocalDateTime lastMessageTime;
}