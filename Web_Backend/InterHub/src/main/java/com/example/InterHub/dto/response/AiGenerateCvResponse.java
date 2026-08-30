package com.example.InterHub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiGenerateCvResponse {

    private String fullName;

    private String email;

    private String phone;

    private String targetPosition;

    private String careerObjective;

    private String summary;

    private String skills;

    private String education;

    private String projects;

    private String experience;
}
