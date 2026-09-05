package com.example.InterHub.services;
import com.example.InterHub.dto.request.ReviewRequest;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.dto.response.ReviewResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Job;
import com.example.InterHub.entity.JobReview;
import com.example.InterHub.entity.Student;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.ReviewMapper;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.JobRepository;
import com.example.InterHub.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private ReviewRepository reviewRepository;
    @Mock
    private ReviewMapper reviewMapper;
    @Mock
    private JobRepository jobRepository;
    @Mock
    private PageMapper pageMapper;
    @InjectMocks
    private ReviewService reviewService;
    // TC01: Sinh viên đánh giá công việc thành công
    @Test
    void createReview_success() {
        Student student = mock(Student.class);
        ReviewRequest request = mock(ReviewRequest.class);
        Job job = mock(Job.class);
        Application application = mock(Application.class);
        JobReview savedReview = mock(JobReview.class);
        ReviewResponse expected = mock(ReviewResponse.class);
        when(student.getId()).thenReturn(1L);
        when(request.getRating()).thenReturn(5);
        when(request.getComment()).thenReturn("Môi trường thực tập tốt");
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        when(applicationRepository.findByStudentIdAndJobId(1L,10L)).thenReturn(Optional.of(application));
        when(application.getStatus()).thenReturn(ApplicationStatus.COMPLETED);
        when(reviewRepository.existsByStudentIdAndJobId(1L,10L)).thenReturn(false);
        when(reviewRepository.save(any(JobReview.class))).thenReturn(savedReview);
        when(reviewMapper.toResponse(savedReview)).thenReturn(expected);
        ReviewResponse result = reviewService.createReview(request,student,10L);
        assertSame(expected,result);
        verify(reviewRepository).save(any(JobReview.class));
        verify(reviewMapper).toResponse(savedReview);
    }
    // TC02: Lấy danh sách đánh giá của doanh nghiệp thành công
    @Test
    void getReviewByJob_success() {
        Pageable pageable = PageRequest.of(0,10);
        JobReview review = mock(JobReview.class);
        ReviewResponse reviewResponse = mock(ReviewResponse.class);
        PageResponse<ReviewResponse> expected = mock(PageResponse.class);
        when(reviewRepository.findByJobEmployerId(1L,pageable)).thenReturn(new PageImpl<>(List.of(review)));
        when(reviewMapper.toResponse(review)).thenReturn(reviewResponse);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<ReviewResponse> result = reviewService.getReviewByJob(1L,pageable);
        assertSame(expected,result);
        verify(reviewRepository).findByJobEmployerId(1L,pageable);
    }
}