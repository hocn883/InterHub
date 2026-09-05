package com.example.InterHub.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {

    private Long id;

    private Long chatRoomId;

    private Long senderId;

    private String senderName;

    private String senderAvatarUrl;

    private String content;

    private Boolean isRead;

    private LocalDateTime createdDate;
}