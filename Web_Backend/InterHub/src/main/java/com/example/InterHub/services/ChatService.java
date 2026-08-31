package com.example.InterHub.services;

import com.example.InterHub.dto.request.ChatMessageRequest;
import com.example.InterHub.dto.response.ChatMessageResponse;
import com.example.InterHub.entity.ChatRoom;
import com.example.InterHub.entity.Message;
import com.example.InterHub.entity.User;
import com.example.InterHub.repository.ChatRoomRepository;
import com.example.InterHub.repository.MessageRepository;
import com.example.InterHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        User sender = userRepository.findById(request.getSenderId()).orElseThrow(() -> new RuntimeException(
                                "Không tìm thấy người gửi"
                        ));
        User receiver = userRepository.findById(request.getReceiverId()).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy người nhận"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException(
                    "Không thể gửi tin nhắn cho chính mình"
            );
        }
        ChatRoom chatRoom = chatRoomRepository
                .findRoomBetweenUsers(
                        sender.getId(),
                        receiver.getId()
                ).orElseGet(() -> {ChatRoom newRoom = ChatRoom.builder()
                            .user1(sender)
                            .user2(receiver)
                            .build();
                    return chatRoomRepository.save(newRoom);
                });
        Message message = Message.builder()
                .chatRoom(chatRoom)
                .user(sender)
                .content(request.getContent().trim())
                .build();
        Message savedMessage =
                messageRepository.save(message);
        chatRoom.setLastMessage(
                savedMessage.getContent()
        );
        chatRoom.setLastMessageTime(
                savedMessage.getCreatedDate()
        );
        chatRoomRepository.save(chatRoom);
        return ChatMessageResponse.builder()
                .id(savedMessage.getId())
                .chatRoomId(chatRoom.getId())
                .senderId(sender.getId())
                .senderName(sender.getFullName())
                .content(savedMessage.getContent())
                .createdDate(savedMessage.getCreatedDate())
                .build();
    }
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository
                .findById(roomId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy phòng chat"
                        ));

        List<Message> messages = messageRepository.findByChatRoomIdOrderByCreatedDateAsc(roomId);
        return messages.stream().map(message ->
                        ChatMessageResponse.builder()
                                .id(message.getId())
                                .chatRoomId(chatRoom.getId())
                                .senderId(message.getUser().getId())
                                .senderName(message.getUser().getFullName())
                                .content(message.getContent())
                                .createdDate(message.getCreatedDate()).build()).toList();
    }
}