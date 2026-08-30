package com.example.InterHub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {

    private Long id;

    private Long chatRoomId;

    private Long senderId;

    private String senderName;

    private String content;

    private LocalDateTime createdDate;
}