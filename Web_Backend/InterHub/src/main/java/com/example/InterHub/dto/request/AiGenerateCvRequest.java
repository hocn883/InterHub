package com.example.InterHub.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiGenerateCvRequest {
    private String fullName;
    private String email;
    private String phone;
    private String major;
    private String targetPosition;
    private String skills;
    private String education;
    private String projects;
    private String experience;
}