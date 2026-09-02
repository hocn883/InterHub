package com.example.InterHub.controller.employer;

import com.cloudinary.Api;
import com.example.InterHub.dto.response.*;
import com.example.InterHub.repository.ReviewRepository;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.EmployerService;
import com.example.InterHub.services.JobService;
import com.example.InterHub.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/employer")
@RequiredArgsConstructor
public class EmployerController {
    private final ReviewService reviewService;
    private final EmployerService employerService;
    private final JobService jobService;
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<EmployerResponse>>> getAllEmployer(
            @RequestParam(defaultValue = "0") int page
            , @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdDate"));
        PageResponse<EmployerResponse> pageResponse = employerService.getAll(pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<EmployerResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Danh sách Employer")
                        .result(pageResponse)
                        .build()
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployerResponse>> me(
            @PathVariable long id
    ) {
        EmployerResponse response = employerService.getEmployerById(id);
        return ResponseEntity.ok(
                ApiResponse.<EmployerResponse>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Thong tin employer")
                        .result(response)
                        .build()
        );
    }
    @GetMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getMyReviews(
           @PathVariable long id
            , @RequestParam(defaultValue = "0") int page
            , @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdDate"));
        PageResponse<ReviewResponse> pageResponse = reviewService.getReviewByJob(id, pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<ReviewResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Cac danh gia cua Employer")
                        .result(pageResponse)
                        .build()
        );
    }
    @GetMapping("/{id}/jobs")
    public ResponseEntity<ApiResponse<PageResponse<JobResponse>>> getJobsByEmployer(
            @PathVariable long id
            , @RequestParam(defaultValue = "0") int page
            , @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdDate"));
        PageResponse<JobResponse> response = jobService.getJobsByEmployerId(id, pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<JobResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Danh sach job")
                        .result(response)
                        .build()
        );

    }
    @GetMapping("/student-apply/approved")
    public ResponseEntity<ApiResponse<PageResponse<ApplicationResponse>>> getStudentApplyApproval(
            @AuthenticationPrincipal CustomUserDetails currentUser
            , @RequestParam(defaultValue = "0") int page
            , @RequestParam(defaultValue = "10") int size)
    {
        Pageable pageable = PageRequest.of(page,size,Sort.by(Sort.Direction.DESC, "createdDate"));
        PageResponse<ApplicationResponse>response=employerService.getApprovedStudents(currentUser.getUser().getId(),  pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<ApplicationResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Danh sach student")
                        .result(response)
                        .build()
        );
    }
    @GetMapping("/student-apply/reject")
    public ResponseEntity<ApiResponse<PageResponse<ApplicationResponse>>> getStudentApplyReject(
            @AuthenticationPrincipal CustomUserDetails currentUser
            , @RequestParam(defaultValue = "0") int page
            , @RequestParam(defaultValue = "10") int size)
    {
        Pageable pageable = PageRequest.of(page,size,Sort.by(Sort.Direction.DESC, "createdDate"));
        PageResponse<ApplicationResponse>response=employerService.getRejectedStudents(currentUser.getUser().getId(),  pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<ApplicationResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Danh sach student")
                        .result(response)
                        .build()
        );
    }

}