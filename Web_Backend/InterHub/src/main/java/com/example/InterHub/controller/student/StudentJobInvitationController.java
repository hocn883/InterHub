package com.example.InterHub.controller.student;

import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.JobInvitationResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Student;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.JobInvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/job-invitations")
@RequiredArgsConstructor
public class StudentJobInvitationController {

    private final JobInvitationService jobInvitationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<JobInvitationResponse>>>
    getMyJobInvitations(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.DESC, "createdDate")
    );
        Student student = (Student) currentUser.getUser();
        PageResponse<JobInvitationResponse>response=jobInvitationService.getStudentJobInvitations(student, pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<JobInvitationResponse>>builder()
                                .code(HttpStatus.OK.value())
                                        .status(HttpStatus.OK.name())
                                                .message("Ok")
                                                        .result(response).build()
                );
    }
    @PatchMapping("/{jobInvitationId}/accept")
    public ResponseEntity<ApiResponse<JobInvitationResponse>> acceptJobInvitation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long jobInvitationId
    ) {

        Student student =
                (Student) currentUser.getUser();

        return ResponseEntity.ok(
                ApiResponse.<JobInvitationResponse>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Ok")
                        .result(jobInvitationService.acceptJobInvitation(
                                student,
                                jobInvitationId))
                        .build()
        );
    }
    @PatchMapping("/{job-invitationId}/reject")
    public ResponseEntity<ApiResponse<JobInvitationResponse>> rejectJobInvitation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long jobInvitationId
    ) {

        Student student =
                (Student) currentUser.getUser();


        return ResponseEntity.ok(
                ApiResponse.<JobInvitationResponse>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Ok")
                        .result(jobInvitationService.rejectJobInvitation(
                                student,
                                jobInvitationId))
                        .build()
        );
    }
}
