package com.example.InterHub.controller;

import com.example.InterHub.dto.request.ChatMessageRequest;
import com.example.InterHub.dto.response.ChatMessageResponse;
import com.example.InterHub.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    @MessageMapping("/chat/send")
    public void sendMessage(
            ChatMessageRequest request
    ) {

        ChatMessageResponse response =
                chatService.sendMessage(request);


        messagingTemplate.convertAndSend(
                "/topic/user/" + request.getSenderId(),
                response
        );

        messagingTemplate.convertAndSend(
                "/topic/user/" + request.getReceiverId(),
                response
        );
    }
}
