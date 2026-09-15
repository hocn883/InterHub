package com.example.InterHub.services;
import com.example.InterHub.entity.SystemLog;
import com.example.InterHub.entity.User;
import com.example.InterHub.repository.SystemLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class SystemLogServiceTest {
    @Mock
    private SystemLogRepository systemLogRepository;
    @InjectMocks
    private SystemLogService systemLogService;
    // TC01: Lưu system log thành công
    @Test
    void saveLog_success() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        when(user.getUsername()).thenReturn("student01");
        systemLogService.saveLog(user,"LOGIN","Đăng nhập hệ thống");
        ArgumentCaptor<SystemLog> captor = ArgumentCaptor.forClass(SystemLog.class);
        verify(systemLogRepository).save(captor.capture());
        SystemLog log = captor.getValue();
        assertEquals(1L,log.getUserId());
        assertEquals("student01",log.getUsername());
        assertEquals("LOGIN",log.getAction());
        assertEquals("Đăng nhập hệ thống",log.getDescription());
    }
}