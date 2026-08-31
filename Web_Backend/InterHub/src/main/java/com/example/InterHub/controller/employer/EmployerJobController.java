package com.example.InterHub.controller.employer;
import com.example.InterHub.dto.request.PostJobRequest;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.JobResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.User;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.UserRepository;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/employer/jobs")
@RequiredArgsConstructor
public class EmployerJobController {
    private final JobService jobService;
    private final UserRepository userRepository;
    private final EmployerRepository employerRepository;
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<JobResponse>>>getMyJobs(@AuthenticationPrincipal CustomUserDetails currentUser,
                                                                           @RequestParam(defaultValue = "0")int page,
                                                                           @RequestParam(defaultValue = "10")int size)
    {
       Pageable pageable = PageRequest.of(page, size,    Sort.by(Sort.Direction.DESC, "createdDate"));
       PageResponse<JobResponse> jobResponse = jobService.getMyJobs(currentUser.getUser(),pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<JobResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Lấy danh sách công việc thành công.")
                        .result(jobResponse)
                        .build()
        );
    }
    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>>createJob(Authentication authentication,
                                                             @Valid @RequestBody PostJobRequest request)
    {   String username =authentication.getName();
        User currentUser=userRepository.findByUsername(username).orElseThrow();
        JobResponse jobResponse=jobService.create(currentUser,request);
        return ResponseEntity.ok(
                ApiResponse.<JobResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .status(HttpStatus.CREATED.name())
                        .message("Tạo Job Thành Công")
                        .result(jobResponse)
                        .build()
        );
    }
    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void>deleteCv(@AuthenticationPrincipal CustomUserDetails currentUser,@PathVariable Long jobId)
    {
        jobService.deleteJob(jobId,currentUser.getUser());
        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/{jobId}/close")
    public ResponseEntity<ApiResponse<JobResponse>> closeJob(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long jobId
    ) {
        JobResponse response =
                jobService.closeJob(
                        jobId,
                        currentUser.getUser()
                );

        return ResponseEntity.ok(
                ApiResponse.<JobResponse>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Đóng Job thành công")
                        .result(response)
                        .build()
        );
    }
}
