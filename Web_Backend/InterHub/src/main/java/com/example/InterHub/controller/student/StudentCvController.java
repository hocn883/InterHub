package com.example.InterHub.controller.student;

import com.example.InterHub.dto.request.CvUpLoadRequest;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.dto.response.JobResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.CvService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/student/cvs")
@RequiredArgsConstructor
public class StudentCvController {
    private final CvService cvService;
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<CvUploadResponse>> uploadCv(
            @Valid @ModelAttribute CvUpLoadRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        CvUploadResponse response =
                cvService.uploadCv(request, currentUser.getUser());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<CvUploadResponse>builder()
                                .code(HttpStatus.CREATED.value())
                                .status(HttpStatus.CREATED.name())
                                .message("Đã gửi CV")
                                .result(response)
                                .build()
                );
    }
    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<CvUploadResponse>>>getMyCv(@AuthenticationPrincipal CustomUserDetails currentUser,
                       @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size)
    {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdDate")
        );
        PageResponse<CvUploadResponse> response = cvService.getAllCvs(pageable);

        return ResponseEntity.ok(
                ApiResponse.<PageResponse<CvUploadResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Lấy danh sách công việc thành công.")
                        .result(response)
                        .build()
        );
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
