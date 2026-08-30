package com.example.InterHub.dto.response;

import com.example.InterHub.enums.CVStatus;
import lombok.*;

import java.time.LocalDate;
@Getter
@Setter
public class CvUploadResponse {
    private Long id;
    private String fileUrl;
    private CVStatus status;
    private String lecturerFeedback;
    private Long studentId;
    private String studentName;
    private String lecturerId;
    private LocalDate createdDate;
}
