package com.example.InterHub.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SystemLogResponse {

    private Long id;

    private Long userId;

    private String username;

    private String action;

    private String description;

    private LocalDateTime createdDate;
}