package com.example.InterHub.controller.Job;

import com.example.InterHub.dto.request.ApplicationRequest;
import com.example.InterHub.dto.request.RegisterRequest;
import com.example.InterHub.dto.request.ReviewRequest;
import com.example.InterHub.dto.request.SearchJobRequest;
import com.example.InterHub.dto.response.*;
import com.example.InterHub.entity.JobReview;
import com.example.InterHub.entity.Student;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.ApplicationService;
import com.example.InterHub.services.JobService;
import com.example.InterHub.services.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final ReviewService reviewService;
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<JobResponse>>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdDate")
        );

        PageResponse<JobResponse> response = jobService.getAllJobs(pageable);

        return ResponseEntity.ok(
                ApiResponse.<PageResponse<JobResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Lấy danh sách công việc thành công.")
                        .result(response)
                        .build()
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(
            @PathVariable Long id
    ) {
        JobResponse job=jobService.getJobById(id);

        return ResponseEntity.ok(
                ApiResponse.<JobResponse>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Lấy danh sách công việc thành công.")
                        .result(job)
                        .build()
        );
    }
    @PostMapping(value = "/{jobId}/apply",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ApplicationResponse>>applyJob(@Valid @ModelAttribute ApplicationRequest request,
    @AuthenticationPrincipal CustomUserDetails currentUser, @PathVariable Long jobId)
    {

        return ResponseEntity.ok(ApiResponse.<ApplicationResponse>builder().
                code(HttpStatus.CREATED.value()).status(HttpStatus.CREATED.name())
                .message("Apply thành công").
                result(applicationService.applyJob(jobId,currentUser.getUser(),request)).build());
    }
    @PostMapping("/{jobId}/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long jobId

    ) {
        Student student = (Student) currentUser.getUser();
        ReviewResponse response=reviewService.createReview(request,student,jobId);
        return ResponseEntity.ok(
                ApiResponse.<ReviewResponse>builder().
                        code(HttpStatus.CREATED.value())
                        .status(HttpStatus.CREATED.name())
                        .message("Danh gia doanh nghiep thanh cong")
                        .result(response)
                        .build()
        );
    }
    @GetMapping("/search")
    public ApiResponse<PageResponse<JobResponse>> searchJobs(
            @ModelAttribute SearchJobRequest request,
            Pageable pageable
    ) {
        return ApiResponse.<PageResponse<JobResponse>>builder()
                .code(HttpStatus.OK.value())
                .status(HttpStatus.OK.name())
                .result(jobService.searchJobs(request, pageable))
                .build();
    }
}
