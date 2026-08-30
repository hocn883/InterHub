package com.example.InterHub.controller.employer;

import com.example.InterHub.dto.request.JobInvitationRequest;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.JobInvitationResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.JobInvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employer/job-invitations")
@RequiredArgsConstructor
public class EmployerJobInvitationController {
    private final JobInvitationService jobInvitationService;
    @PostMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobInvitationResponse>> inviteStudent(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long jobId,
            @Valid @RequestBody JobInvitationRequest request
    ) {
        Employer employer =
                (Employer) currentUser.getUser();
        return ResponseEntity.ok(
                ApiResponse.<JobInvitationResponse>builder()
                                .code(HttpStatus.OK.value())
                                        .status(HttpStatus.OK.name())
                                                .message("Đã gửi lời mời:")
                                                        .result( jobInvitationService.inviteStudent(
                                                                employer,
                                                                jobId,
                                                                request
                                                        )).build()

        );
    }
    @PatchMapping("/{job-invitationId}/cancel")
    public ResponseEntity<ApiResponse<JobInvitationResponse>>cancelJobInvitation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long jobInvitationId
    ) {
        Employer employer =
                (Employer) currentUser.getUser();
        return ResponseEntity.ok(
                ApiResponse.<JobInvitationResponse>builder()
                                .code(HttpStatus.OK.value())
                                        .status(HttpStatus.OK.name())
                                                .message("Đã hủy lời mời!")
                                                        .result(jobInvitationService.cancelJobInvitation(
                                                                employer,
                                                                jobInvitationId
                                                        )).build()

        );
    }
}