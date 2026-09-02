package com.example.InterHub.repository;

import com.example.InterHub.entity.SystemLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository
        extends JpaRepository<SystemLog, Long> {
    Page<SystemLog> findByUserId(
            Long userId,
            Pageable pageable
    );
}