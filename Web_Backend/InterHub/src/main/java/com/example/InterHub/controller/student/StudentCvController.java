package com.example.InterHub.controller.student;

import com.example.InterHub.dto.request.CvUpLoadRequest;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.CvService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/student/cvs")
@RequiredArgsConstructor
public class StudentCvController {
    private final CvService cvService;
    @PostMapping
    public ResponseEntity<ApiResponse<CvUploadResponse>> uploadCv(
            @Valid @RequestBody CvUpLoadRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        CvUploadResponse response =
                cvService.uploadCv(request, currentUser.getUser());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body( ApiResponse.<CvUploadResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .status(HttpStatus.CREATED.name())
                        .message("Đã gửi CV")
                        .result(response)
                        .build());
    }
    @GetMapping()
    public ResponseEntity<List<CvUploadResponse>>getMyCv(@AuthenticationPrincipal CustomUserDetails currentUser
                                                   )
    {
        return ResponseEntity.ok(cvService.getMyCvUploads(currentUser.getUser()));
    }
    @GetMapping("/{cv_id}")
    public ResponseEntity<CvUploadResponse>getMyCvById(@AuthenticationPrincipal CustomUserDetails currentUser, @PathVariable Long cvId)
    {
        return ResponseEntity.ok(cvService.getMyCvById(cvId,currentUser.getUser()));
    }
    @DeleteMapping("/{cvId}")
    public ResponseEntity<Void>deleteCv(@AuthenticationPrincipal CustomUserDetails currentUser,@PathVariable Long cvId)
    {
        cvService.deletePendingCv(cvId,currentUser.getUser());
        return ResponseEntity.noContent().build();
    }


}
