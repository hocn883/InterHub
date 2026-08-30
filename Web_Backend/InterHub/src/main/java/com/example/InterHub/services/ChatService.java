package com.example.InterHub.services;

import com.example.InterHub.dto.request.ChatMessageRequest;
import com.example.InterHub.dto.response.ChatMessageResponse;
import com.example.InterHub.entity.ChatRoom;
import com.example.InterHub.entity.Message;
import com.example.InterHub.entity.User;
import com.example.InterHub.repository.ChatRoomRepository;
import com.example.InterHub.repository.MessageRepository;
import com.example.InterHub.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomRepository  chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    @Transactional
    public ChatMessageResponse sendMessage(
            ChatMessageRequest request
    ) {

        // 1. Tìm người gửi
        User sender = userRepository
                .findById(request.getSenderId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sender id = "
                                        + request.getSenderId()
                        )
                );


        // 2. Tìm người nhận
        User receiver = userRepository
                .findById(request.getReceiverId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy receiver id = "
                                        + request.getReceiverId()
                        )
                );


        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException(
                    "Không thể chat với chính mình"
            );
        }


        // 3. TÌM ROOM CŨ
        // Nếu chưa có -> TẠO ROOM MỚI
        ChatRoom chatRoom =
                chatRoomRepository
                        .findRoomBetweenUsers(
                                sender.getId(),
                                receiver.getId()
                        )
                        .orElseGet(() -> {

                            ChatRoom newRoom =
                                    ChatRoom.builder()
                                            .user1(sender)
                                            .user2(receiver)
                                            .build();

                            return chatRoomRepository.save(
                                    newRoom
                            );
                        });


        // 4. Kiểm tra content
        if (request.getContent() == null
                || request.getContent().trim().isEmpty()) {

            throw new RuntimeException(
                    "Tin nhắn không được để trống"
            );
        }


        // 5. Tạo message
        Message message =
                Message.builder()
                        .chatRoom(chatRoom)
                        .user(sender)
                        .content(
                                request.getContent().trim()
                        )
                        .build();


        // 6. Lưu message
        Message savedMessage =
                messageRepository.save(message);


        // 7. Cập nhật room
        chatRoom.setLastMessage(
                savedMessage.getContent()
        );

        chatRoom.setLastMessageTime(
                savedMessage.getCreatedDate()
        );

        chatRoomRepository.save(chatRoom);


        // 8. Response
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
    public List<ChatMessageResponse> getMessages(
            Long roomId
    ) {

        ChatRoom chatRoom = chatRoomRepository
                .findById(roomId)
                .orElseThrow(
                        () -> new RuntimeException("Không tìm thấy room")
                );


        List<Message> messages =
                messageRepository
                        .findByChatRoomIdOrderByCreatedDateAsc(roomId);


        return messages
                .stream()
                .map(message -> {

                    Long senderId =
                            message
                                    .getUser()
                                    .getId();


                    // Tìm receiver dựa vào sender
                    Long receiverId;

                    if (chatRoom.getUser1().getId().equals(senderId)) {

                        receiverId =
                                chatRoom
                                        .getUser2()
                                        .getId();

                    } else {

                        receiverId =
                                chatRoom
                                        .getUser1()
                                        .getId();
                    }


                    return ChatMessageResponse.builder()
                            .id(message.getId())
                            .chatRoomId(chatRoom.getId())
                            .senderId(senderId)
                            .content(message.getContent())
                            .createdDate(message.getCreatedDate())
                            .build();

                })
                .toList();
    }
}
