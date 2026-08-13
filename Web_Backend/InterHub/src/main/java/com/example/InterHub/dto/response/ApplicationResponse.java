package com.example.InterHub.dto.response;

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
        private String coverLetter;
        private String fileCv;
        private ApplicationStatus status;
        private Long studentId;
        private String studentName;
        private String jobTitle;
        private Long jobId;
        private String employerName;
        private LocalDateTime createdDate;
}
