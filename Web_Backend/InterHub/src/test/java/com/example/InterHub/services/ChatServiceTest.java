package com.example.InterHub.services;
import com.example.InterHub.dto.request.ChatMessageRequest;
import com.example.InterHub.dto.response.ChatMessageResponse;
import com.example.InterHub.entity.ChatRoom;
import com.example.InterHub.entity.Message;
import com.example.InterHub.entity.User;
import com.example.InterHub.repository.ChatRoomRepository;
import com.example.InterHub.repository.MessageRepository;
import com.example.InterHub.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class ChatServiceTest {
    @Mock
    private ChatRoomRepository chatRoomRepository;
    @Mock
    private MessageRepository messageRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private ChatService chatService;
    // TC01: Gửi tin nhắn khi đã có phòng chat
    @Test
    void sendMessage_existingRoom_success() {
        ChatMessageRequest request = mock(ChatMessageRequest.class);
        User sender = mock(User.class);
        User receiver = mock(User.class);
        ChatRoom room = mock(ChatRoom.class);
        Message savedMessage = mock(Message.class);
        LocalDateTime time = LocalDateTime.now();
        when(request.getSenderId()).thenReturn(1L);
        when(request.getReceiverId()).thenReturn(2L);
        when(request.getContent()).thenReturn(" Hello ");
        when(sender.getId()).thenReturn(1L);
        when(sender.getFullName()).thenReturn("Nguyen Van A");
        when(receiver.getId()).thenReturn(2L);
        when(room.getId()).thenReturn(10L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(chatRoomRepository.findRoomBetweenUsers(1L,2L)).thenReturn(Optional.of(room));
        when(messageRepository.save(any(Message.class))).thenReturn(savedMessage);
        when(savedMessage.getId()).thenReturn(20L);
        when(savedMessage.getContent()).thenReturn("Hello");
        when(savedMessage.getCreatedDate()).thenReturn(time);
        ChatMessageResponse result = chatService.sendMessage(request);
        assertEquals(20L,result.getId());
        assertEquals(10L,result.getChatRoomId());
        assertEquals("Hello",result.getContent());
        verify(messageRepository).save(any(Message.class));
        verify(chatRoomRepository).save(room);
    }
    // TC02: Gửi tin nhắn và tạo phòng chat mới
    @Test
    void sendMessage_newRoom_success() {
        ChatMessageRequest request = mock(ChatMessageRequest.class);
        User sender = mock(User.class);
        User receiver = mock(User.class);
        ChatRoom room = mock(ChatRoom.class);
        Message savedMessage = mock(Message.class);
        when(request.getSenderId()).thenReturn(1L);
        when(request.getReceiverId()).thenReturn(2L);
        when(request.getContent()).thenReturn("Xin chào");
        when(sender.getId()).thenReturn(1L);
        when(sender.getFullName()).thenReturn("Nguyen Van A");
        when(receiver.getId()).thenReturn(2L);
        when(room.getId()).thenReturn(10L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(chatRoomRepository.findRoomBetweenUsers(1L,2L)).thenReturn(Optional.empty());
        when(chatRoomRepository.save(any(ChatRoom.class))).thenReturn(room);
        when(messageRepository.save(any(Message.class))).thenReturn(savedMessage);
        when(savedMessage.getId()).thenReturn(20L);
        when(savedMessage.getContent()).thenReturn("Xin chào");
        ChatMessageResponse result = chatService.sendMessage(request);
        assertEquals(20L,result.getId());
        assertEquals(10L,result.getChatRoomId());
        verify(chatRoomRepository,atLeastOnce()).save(any(ChatRoom.class));
        verify(messageRepository).save(any(Message.class));
    }
    // TC03: Lấy danh sách tin nhắn trong phòng chat
    @Test
    void getMessages_success() {
        ChatRoom room = mock(ChatRoom.class);
        Message message = mock(Message.class);
        User sender = mock(User.class);
        when(room.getId()).thenReturn(10L);
        when(message.getId()).thenReturn(20L);
        when(message.getUser()).thenReturn(sender);
        when(message.getContent()).thenReturn("Xin chào");
        when(sender.getId()).thenReturn(1L);
        when(sender.getFullName()).thenReturn("Nguyen Van A");
        when(chatRoomRepository.findById(10L)).thenReturn(Optional.of(room));
        when(messageRepository.findByChatRoomIdOrderByCreatedDateAsc(10L)).thenReturn(List.of(message));
        List<ChatMessageResponse> result = chatService.getMessages(10L);
        assertEquals(1,result.size());
        assertEquals("Xin chào",result.get(0).getContent());
        assertEquals(1L,result.get(0).getSenderId());
        verify(messageRepository).findByChatRoomIdOrderByCreatedDateAsc(10L);
    }
}
