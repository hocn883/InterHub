package com.example.InterHub.dto.response;

import com.example.InterHub.enums.ApplicationStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@RequiredArgsConstructor
public class FollowResponse {
    private Long id;
    private StudentResponse student;
    private EmployerResponse  employer;
    private LocalDate createdDate;
}
