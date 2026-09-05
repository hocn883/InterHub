package com.example.InterHub.dto.request;

import lombok.Data;

@Data
public class ChatMessageRequest {

    private Long chatRoomId;

    private Long senderId;

    private Long receiverId;

    private String content;
}