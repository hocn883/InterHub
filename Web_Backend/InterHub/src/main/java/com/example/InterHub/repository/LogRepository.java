package com.example.InterHub.repository;

import com.example.InterHub.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogRepository
        extends JpaRepository<SystemLog, Long> {
}