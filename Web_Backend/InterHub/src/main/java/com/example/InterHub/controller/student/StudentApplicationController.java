package com.example.InterHub.controller.student;

import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/student/applications")
@RequiredArgsConstructor
public class StudentApplicationController {
    private final ApplicationService applicationService;
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ApplicationResponse>>>
    getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10")int size,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        Pageable pageable = PageRequest.of(page, size,  Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<ApplicationResponse>application=applicationService.getMyApplications(currentUser.getUser(),pageable);
        return ResponseEntity.ok(ApiResponse.<PageResponse<ApplicationResponse>>builder()
                .code(HttpStatus.OK.value())
                .status(HttpStatus.OK.name())
                .message("Danh sách đơn xin việc đã nộp.")
                .result(application)
                .build()

        );
    }
    @GetMapping("/{applicationId}")
    public ResponseEntity<ApiResponse<ApplicationResponse>>
    getMyApplicationById(
            @PathVariable Long applicationId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<ApplicationResponse>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Chi tiết đơn xin việc.")
                        .result(  applicationService.getApplicationById(
                                applicationId
                        )).build()

        );
    }
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        applicationService.deletedById(
                applicationId,
                userDetails.getUser()
        );

        return ResponseEntity.noContent().build();
    }


}
