package com.example.InterHub.dto.response;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.enums.JobInvitationStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobInvitationResponse {
    private Long id;
    private StudentResponse student;
    private JobResponse job;
    private String title;
    private Long cvId;
    private String fileCv;
    private String message;
    private JobInvitationStatus status;
    private EmployerResponse employer;
}