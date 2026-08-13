package com.example.InterHub.controller.employer;

import com.cloudinary.Api;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.dto.response.ReviewResponse;
import com.example.InterHub.repository.ReviewRepository;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/employer/")
@RequiredArgsConstructor
public class EmployerController {
    private final ReviewService reviewService;
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getMyReviews(
            @AuthenticationPrincipal CustomUserDetails currentUser
    , @RequestParam(defaultValue = "0") int page
    , @RequestParam(defaultValue = "10") int size)
    {
       Pageable pageable = PageRequest.of(
               page,
               size,
               Sort.by(Sort.Direction.DESC, "createdDate"));
        PageResponse<ReviewResponse>pageResponse=reviewService.getReviewByJob(currentUser.getUser().getId(),  pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<ReviewResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Cac danh gia cua Employer")
                        .result(pageResponse)
                        .build()
        );
    }
    }

