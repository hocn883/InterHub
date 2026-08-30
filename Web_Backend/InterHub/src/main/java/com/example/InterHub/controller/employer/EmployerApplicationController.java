package com.example.InterHub.controller.employer;

import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employer")
@RequiredArgsConstructor
public class EmployerApplicationController {

    private final ApplicationService applicationService;

    /*
     * GET /api/employer/jobs/1/applications
     */
    @GetMapping("jobs/{jobId}/applications")
    public ResponseEntity<ApiResponse<PageResponse<ApplicationResponse>>>
    getApplicationsByJob(
            @RequestParam (defaultValue = "0") int page,
            @RequestParam (defaultValue = "10")int size,
            @PathVariable Long jobId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
        PageResponse<ApplicationResponse>application=applicationService.getApplicationsByJob(
                jobId,
                userDetails.getUser(),
                pageable
        );
        return ResponseEntity.ok(ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .code(HttpStatus.OK.value())
                .status(HttpStatus.OK.name())
                .message("Danh sách đơn ứng tuyển.")
                .result(application)
                .build()

        );
    }
    /*
     * PATCH /api/employer/applications/10/approve
     */
    @PatchMapping("application/{applicationId}/approve")
    public ResponseEntity<ApiResponse<ApplicationResponse>>
    approveApplication(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.<ApplicationResponse>builder()
                        .code(HttpStatus.OK.value())
                                .status(HttpStatus.OK.name())
                                        .message("Đã duyệt đơn ứng tuyển")
                                                .result( applicationService.approveApplication(
                                                        applicationId,
                                                        userDetails.getUser()
                                                )).build()

        );
    }

    /*
     * PATCH /api/employer/applications/10/reject
     */
    @PatchMapping("application/{applicationId}/reject")
    public ResponseEntity<ApiResponse<ApplicationResponse>>
    rejectApplication(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.<ApplicationResponse>builder()
                .code(HttpStatus.OK.value())
                .status(HttpStatus.OK.name())
                .message("Đã duyệt đơn ứng tuyển")
                .result( applicationService.rejectApplication(
                        applicationId,
                        userDetails.getUser()
                )).build()

        );
    }
}