package com.example.InterHub.controller;

import com.example.InterHub.dto.response.ChatMessageResponse;
import com.example.InterHub.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    // sửa
    @GetMapping("/rooms/{roomId}/messages")
    public List<ChatMessageResponse> getMessages(
            @PathVariable Long roomId
    ) {
        return chatService.getMessages(roomId);
    }
}
