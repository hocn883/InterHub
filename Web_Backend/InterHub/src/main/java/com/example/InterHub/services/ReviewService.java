package com.example.InterHub.services;

import com.example.InterHub.dto.request.ReviewRequest;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.dto.response.ReviewResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Job;
import com.example.InterHub.entity.JobReview;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.exception.BadRequestException;
import com.example.InterHub.exception.ConflictException;
import com.example.InterHub.exception.DuplicateResourceException;
import com.example.InterHub.exception.ForbiddenException;
import com.example.InterHub.exception.ResourceNotFoundException;
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
    public ReviewResponse createReview(
            ReviewRequest request,
            User currentUser,
            Long jobId
    ) {
        Student student=(Student)currentUser;
        if (request.getRating() == null) {
            throw new BadRequestException("Vui lòng chọn số sao đánh giá");
        }
        if (request.getComment() == null || request.getComment().isBlank()) {
            throw new BadRequestException("Vui lòng nhập nội dung đánh giá");
        }
        Job job = jobRepository.findById(jobId).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy công việc"));
        Application application = applicationRepository
                .findByStudentIdAndJobId(
                        student.getId(),
                        jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Bạn chưa tham gia công việc này"));
        if (application.getStatus()
                != ApplicationStatus.COMPLETED) {
            throw new ConflictException(
                    "Bạn chỉ được đánh giá sau khi hoàn thành kỳ thực tập"
            );
        }
        if (reviewRepository.existsByStudentIdAndJobId(
                student.getId(),
                jobId
        )) {
            throw new DuplicateResourceException(
                    "Bạn đã đánh giá công việc này rồi"
            );
        }
        JobReview jobReview = JobReview.builder()
                .student(student)
                .job(job)
                .comment(request.getComment())
                .rating(request.getRating())
                .build();
        JobReview savedReview = reviewRepository.save(jobReview);
        return reviewMapper.toResponse(savedReview);
    }
    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getReviewByJob(
            Long employerId,
            Pageable pageable
    ) {
        Page<JobReview> reviewPage = reviewRepository.findByJobEmployerId(employerId, pageable);
        Page<ReviewResponse> response =
                reviewPage.map(reviewMapper::toResponse);
        return pageMapper.toPageResponse(response);
    }
}