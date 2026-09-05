package com.example.InterHub.controller;

import com.example.InterHub.dto.response.ChatMessageResponse;
import com.example.InterHub.dto.response.ChatRoomResponse;
import com.example.InterHub.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    @PostMapping("/rooms/open/{senderId}/{receiverId}")
    public Long openRoom(@PathVariable Long senderId, @PathVariable Long receiverId) {
        return chatService.openRoom(
                senderId,
                receiverId
        );
    }
    @GetMapping("/rooms/user/{userId}")
    public List<ChatRoomResponse> getRooms(
            @PathVariable Long userId
    ) {

        return chatService.getRooms(
                userId
        );
    }
    @GetMapping("/rooms/{roomId}/messages")
    public List<ChatMessageResponse> getMessages(
            @PathVariable Long roomId
    ) {
        return chatService.getMessages(
                roomId
        );
    }
    @PutMapping("/rooms/{roomId}/read/{userId}")
    public void markAsRead(
            @PathVariable Long roomId,
            @PathVariable Long userId
    ) {

        chatService.markRoomAsRead(
                roomId,
                userId
        );
    }
}