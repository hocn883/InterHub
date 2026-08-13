package com.example.InterHub.controller.student;

import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.JobResponse;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/student/jobs")
@RequiredArgsConstructor
public class StudentJobController {
    private final JobService jobService;

}
