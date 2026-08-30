package com.example.InterHub.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageRequest {

    private Long senderId;

    private Long receiverId;

    private String content;
}