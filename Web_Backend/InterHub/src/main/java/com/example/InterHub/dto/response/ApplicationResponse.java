package com.example.InterHub.dto.response;

import com.example.InterHub.enums.ApplicationSource;
import com.example.InterHub.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
        private Long id;
        private String coverLetter;
        private String fileCv;
        private ApplicationStatus status;
        private StudentResponse student;
        private JobResponse job;
        private LocalDateTime createdDate;
        private ApplicationSource source;
}
