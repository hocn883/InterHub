package com.example.InterHub.dto.response;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
@Builder
public class ChatRoomResponse {
    private Long roomId;
    private Long userId;
    private String name;
    private String avatarUrl;
    private String role;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private Long unreadCount;
}