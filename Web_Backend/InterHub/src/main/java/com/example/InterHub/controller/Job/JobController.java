package com.example.InterHub.controller.Job;

import com.example.InterHub.dto.request.ApplicationRequest;
import com.example.InterHub.dto.request.RegisterRequest;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.JobResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.ApplicationService;
import com.example.InterHub.services.JobService;
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
}
