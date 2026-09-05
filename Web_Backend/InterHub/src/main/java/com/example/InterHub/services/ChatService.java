package com.example.InterHub.services;

import com.example.InterHub.dto.request.ChatMessageRequest;
import com.example.InterHub.dto.response.ChatMessageResponse;
import com.example.InterHub.dto.response.ChatRoomResponse;
import com.example.InterHub.entity.ChatRoom;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Message;
import com.example.InterHub.entity.User;
import com.example.InterHub.repository.ChatRoomRepository;
import com.example.InterHub.repository.MessageRepository;
import com.example.InterHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    @Transactional
    public Long openRoom(Long senderId, Long receiverId)
    {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException(
                                "Không tìm thấy người gửi"));

        User receiver = userRepository.findById(receiverId).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy người nhận"));

        return chatRoomRepository
                .findRoomBetweenUsers(
                        senderId,
                        receiverId
                )
                .map(ChatRoom::getId)
                .orElseGet(() -> {
                    User user1;
                    User user2;
                    if (sender.getId() < receiver.getId()) {
                        user1 = sender;
                        user2 = receiver;
                    } else {
                        user1 = receiver;
                        user2 = sender;
                    }

                    ChatRoom room = ChatRoom.builder()
                                    .user1(user1)
                                    .user2(user2)
                                    .active(true)
                                    .build();

                    return chatRoomRepository
                            .save(room)
                            .getId();
                });
    }

    @Transactional(readOnly = true)
    public List<ChatRoomResponse> getRooms(
            Long userId
    ) {
        List<ChatRoom> rooms = chatRoomRepository.findAllRoomsByUserId(
                                userId);
        return rooms.stream()
                .map(room -> {
                    User otherUser = room.getUser1()
                                    .getId()
                                    .equals(userId)
                                    ? room.getUser2()
                                    : room.getUser1();

                    return ChatRoomResponse.builder()
                            .roomId(room.getId())
                            .userId(otherUser.getId())
                            .name(getUserName(otherUser))
                            .avatarUrl(otherUser.getAvatarUrl())
                            .role(otherUser.getRole().name())
                            .lastMessage(room.getLastMessage())
                            .lastMessageTime(room.getLastMessageTime())
                            .unreadCount(messageRepository.countUnreadMessages(room.getId(),
                                                    userId))
                            .build();
                }).toList();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(
            Long roomId
    ) {

        chatRoomRepository.findById(roomId).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy phòng chat"));

        List<Message> messages = messageRepository.findByChatRoomIdOrderByCreatedDateAsc(roomId);
        return messages.stream().map(this::toMessageResponse).toList();
    }
    @Transactional
    public ChatMessageResponse sendMessage(ChatMessageRequest request
    ) {
        ChatRoom room = chatRoomRepository.findById(
                                request.getChatRoomId()).orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy phòng chat"
                                ));

        User sender = userRepository.findById(request.getSenderId()).orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy người gửi"));
        Message message = Message.builder()
                        .chatRoom(room)
                        .senderId(sender)
                        .content(
                                request
                                        .getContent()
                                        .trim()
                        )
                        .isRead(false)
                        .build();
        Message savedMessage = messageRepository.save(message);
        room.setLastMessage(savedMessage.getContent());
        room.setLastMessageTime(LocalDateTime.now());
        chatRoomRepository.save(room);
        return toMessageResponse(
                savedMessage
        );
    }

    @Transactional
    public void markRoomAsRead(
            Long roomId,
            Long userId
    ) {
        messageRepository.markMessagesAsRead(
                        roomId,
                        userId
                );
    }

    private ChatMessageResponse toMessageResponse(
            Message message
    ) {

        User sender =
                message.getSenderId();

        return ChatMessageResponse
                .builder()

                .id(
                        message.getId()
                )

                .chatRoomId(
                        message
                                .getChatRoom()
                                .getId()
                )

                .senderId(
                        sender.getId()
                )

                .senderName(
                        getUserName(sender)
                )

                .senderAvatarUrl(
                        sender.getAvatarUrl()
                )

                .content(
                        message.getContent()
                )

                .isRead(
                        message.getIsRead()
                )

                .createdDate(
                        message.getCreatedDate()
                )

                .build();
    }

    private String getUserName(
            User user
    ) {

        if (
                user instanceof Employer employer
        ) {
            return employer.getCompanyName();
        }

        return user.getFullName();
    }
}