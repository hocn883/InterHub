package com.example.InterHub.services;

import com.example.InterHub.entity.SystemLog;
import com.example.InterHub.entity.User;
import com.example.InterHub.repository.SystemLogRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SystemLogService {
    private final SystemLogRepository systemLogRepository;
    @Transactional
    public void saveLog(
            User user,
            String action,
            String description
    ) {
        SystemLog log = SystemLog.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .action(action)
                .description(description)
                .build();
        systemLogRepository.save(log);
    }

}
