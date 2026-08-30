package com.example.InterHub.controller.student;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.dto.response.FollowResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Student;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/student/follows")
@RequiredArgsConstructor
public class StudentFollow {

    private final FollowService followService;
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<FollowResponse>>>getFollower(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    )
    {
        Pageable pageable = PageRequest.of(page, size,  Sort.by(Sort.Direction.DESC, "createdDate"));
        PageResponse<FollowResponse> response = followService.getFollowers(pageable, currentUser.getUser());
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<FollowResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Lấy danh sách follower thành công.")
                        .result(response)
                        .build()
        );
    }
    @GetMapping("/{employerId}")
    public ResponseEntity<Boolean> checkFollow(
            @PathVariable Long employerId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        Student student = (Student) currentUser.getUser();

        boolean followed = followService.isFollowing(
                student,
                employerId
        );

        return ResponseEntity.ok(followed);
    }

    @PostMapping("/{employerId}")
    public ResponseEntity<?> follow(
            @PathVariable Long employerId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        Student student = (Student) currentUser.getUser();

        followService.followEmployer(
                student,
                employerId
        );

        return ResponseEntity.ok("Đã theo dõi doanh nghiệp");
    }

    @DeleteMapping("/{employerId}")
    public ResponseEntity<?> unfollow(
            @PathVariable Long employerId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        Student student = (Student) currentUser.getUser();

        followService.unfollowEmployer(
                student,
                employerId
        );

        return ResponseEntity.ok("Đã bỏ theo dõi doanh nghiệp");
    }

}