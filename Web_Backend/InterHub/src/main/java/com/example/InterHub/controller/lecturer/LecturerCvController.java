package com.example.InterHub.controller.lecturer;

import com.example.InterHub.dto.request.FeedbackRequest;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.enums.CVStatus;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.CvService;
import com.example.InterHub.services.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/lecturer/cvs")
@RequiredArgsConstructor
public class LecturerCvController {
    private final CvService cvService;
    @GetMapping
    public ResponseEntity<ApiResponse<List<CvUploadResponse>>>getCvs(@AuthenticationPrincipal CustomUserDetails currentUser)
    {
        List<CvUploadResponse>responses=cvService.getCv(currentUser.getUser());
        return ResponseEntity.ok(
                ApiResponse.<List<CvUploadResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Cv nhan duoc:")
                        .result(responses)
                        .build()
        );
    }
    @GetMapping("/{cvId}")
    public ResponseEntity<CvUploadResponse> getCvById(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long cvId
    ) {
        return ResponseEntity.ok(
                cvService.getMyCvById(cvId,currentUser.getUser())
        );
    }
    @PatchMapping("/{cvId}/approved")
    public ResponseEntity<CvUploadResponse> reviewCv(
            @PathVariable Long cvId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(
                cvService.approveCv(cvId, currentUser.getUser())
        );
    }
    @PatchMapping("/{cvId}/rejected")
    public ResponseEntity<CvUploadResponse> reviewCv(
            @PathVariable Long cvId,
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
            ) {
        return ResponseEntity.ok(
                cvService.rejectedCv(cvId, request, currentUser.getUser())
        );
    }
}

