package com.example.InterHub.dto.response;
import com.example.InterHub.enums.JobInvitationStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobInvitationResponse {

    private Long id;

    private Long studentId;

    private String studentName;

    private Long jobId;

    private String jobTitle;

    private Long cvId;

    private String fileCv;

    private String message;

    private JobInvitationStatus status;
}