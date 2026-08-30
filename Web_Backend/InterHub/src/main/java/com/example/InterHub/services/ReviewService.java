package com.example.InterHub.services;

import com.example.InterHub.dto.request.ReviewRequest;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.dto.response.ReviewResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.JobReview;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.ReviewMapper;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.JobRepository;
import com.example.InterHub.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ApplicationRepository applicationRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final JobRepository jobRepository;
    private final PageMapper pageMapper;
    @Transactional
    public ReviewResponse createReview(ReviewRequest reviewRequest , User currentUser, Long jobId) {
        Student student = (Student) currentUser ;
        Application application = applicationRepository
                .findByStudentIdAndJobId(
                        student.getId(), jobId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bạn chưa tham gia công việc này"
                        )
                );
        if (application.getStatus() != ApplicationStatus.COMPLETED) {
            throw new RuntimeException(
                    "Bạn chỉ được đánh giá sau khi hoàn thành kỳ thực tập"
            );
        }
        if (reviewRepository.existsByStudentIdAndJobId(
                student.getId(),
                jobId
        )) {
            throw new RuntimeException(
                    "Bạn đã đánh giá công việc này rồi"
            );
        }
        JobReview jobReview = JobReview.builder().student(student)
                .comment(reviewRequest.getComment())
                .rating(reviewRequest.getRating())
                .job(jobRepository.findById(jobId).orElseThrow()).build();
        reviewRepository.save(jobReview);
        return reviewMapper.toResponse(jobReview);

    }
    public PageResponse<ReviewResponse>getReviewByJob(Long employerId, Pageable pageable)
    {
        Page<JobReview> reviewPage=reviewRepository.findByJobEmployerId(employerId, pageable);
        Page<ReviewResponse>response=reviewPage.map(reviewMapper::toResponse);
        return pageMapper.toPageResponse(response);
    }

}
