package com.example.InterHub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "chat_room",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_chat_room_users",
                        columnNames = {
                                "user1_id",
                                "user2_id"
                        }
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user1_id",
            nullable = false
    )
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user2_id",
            nullable = false
    )
    private User user2;

    @Column(columnDefinition = "TEXT")
    private String lastMessage;

    private LocalDateTime lastMessageTime;

    @Builder.Default
    private Boolean active = true;
}