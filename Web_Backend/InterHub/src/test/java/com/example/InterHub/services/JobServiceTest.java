package com.example.InterHub.services;
import com.example.InterHub.dto.request.PostJobRequest;
import com.example.InterHub.dto.request.SearchJobRequest;
import com.example.InterHub.dto.response.JobResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Job;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.Action;
import com.example.InterHub.enums.EmployerStatus;
import com.example.InterHub.enums.JobStatus;
import com.example.InterHub.exception.ConflictException;
import com.example.InterHub.exception.ForbiddenException;
import com.example.InterHub.exception.ResourceNotFoundException;
import com.example.InterHub.mapper.JobMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.FollowRepository;
import com.example.InterHub.repository.JobRepository;
import com.example.InterHub.services.EmailService.EmailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
public class JobServiceTest {
    @Mock
    private JobRepository jobRepository;
    @Mock
    private EmployerRepository employerRepository;
    @Mock
    private JobMapper jobMapper;
    @Mock
    private PageMapper pageMapper;
    @Mock
    private SystemLogService systemLogService;
    @Mock
    private FollowRepository followRepository;
    @Mock
    private EmailService emailService;
    @InjectMocks
    private JobService jobService;
    // TC01: Lấy tất cả công việc thành công
    @Test
    void getAllJobs_success() {
        Pageable pageable = PageRequest.of(0, 10);
        Job job = mock(Job.class);
        JobResponse response = mock(JobResponse.class);
        PageResponse<JobResponse> expected = mock(PageResponse.class);
        when(jobRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(job)));
        when(jobMapper.toResponse(job)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<JobResponse> result = jobService.getAllJobs(pageable);
        assertSame(expected, result);
        verify(jobRepository).findAll(pageable);
        verify(jobMapper).toResponse(job);
    }
    // TC02: Tạo công việc thành công
    @Test
    void create_success() {
        Employer employer = mock(Employer.class);
        PostJobRequest request = mock(PostJobRequest.class);
        Job job = mock(Job.class);
        JobResponse expected = mock(JobResponse.class);
        Student student1 = mock(Student.class);
        Student student2 = mock(Student.class);
        when(employer.getStatus()).thenReturn(EmployerStatus.APPROVED);
        when(employer.getId()).thenReturn(1L);
        when(employer.getUsername()).thenReturn("company");
        when(employer.getCompanyName()).thenReturn("ABC");
        when(jobMapper.toEntity(request)).thenReturn(job);
        when(jobRepository.save(job)).thenReturn(job);
        when(job.getTitle()).thenReturn("Backend Intern");
        when(job.getLocation()).thenReturn("TP.HCM");
        when(job.getSalary()).thenReturn(BigDecimal.valueOf(5000000));
        when(student1.getEmail()).thenReturn("student@gmail.com");
        when(student1.getFullName()).thenReturn("Nguyen Van A");
        when(student2.getEmail()).thenReturn(null);
        when(followRepository.findStudentsByEmployerId(1L)).thenReturn(List.of(student1, student2));
        when(jobMapper.toResponse(job)).thenReturn(expected);
        JobResponse result = jobService.create(employer, request);
        assertSame(expected, result);
        verify(job).setEmployer(employer);
        verify(job).setStatus(JobStatus.OPEN);
        verify(jobRepository).save(job);
        verify(emailService, times(1)).sendEmail(eq("student@gmail.com"), anyString(), anyString());
        verify(systemLogService).saveLog(eq(employer), eq(Action.CREATE_JOB.name()), anyString());
    }
    // TC03: Nhà tuyển dụng chưa được duyệt không được tạo công việc
    @Test
    void create_employerNotApproved() {
        Employer employer = mock(Employer.class);
        PostJobRequest request = mock(PostJobRequest.class);
        when(employer.getStatus()).thenReturn(EmployerStatus.PENDING);
        assertThrows(ForbiddenException.class, () -> jobService.create(employer, request));
        verify(jobRepository, never()).save(any());
        verify(emailService, never()).sendEmail(anyString(), anyString(), anyString());
    }
    // TC04: Lấy công việc theo id thành công
    @Test
    void getJobById_success() {
        Job job = mock(Job.class);
        JobResponse expected = mock(JobResponse.class);
        when(jobRepository.findJobById(1L)).thenReturn(Optional.of(job));
        when(jobMapper.toResponse(job)).thenReturn(expected);
        JobResponse result = jobService.getJobById(1L);
        assertSame(expected, result);
        verify(jobRepository).findJobById(1L);
    }
    // TC05: Không tìm thấy công việc theo id
    @Test
    void getJobById_notFound() {
        when(jobRepository.findJobById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> jobService.getJobById(1L));
        verify(jobMapper, never()).toResponse(any());
    }
    // TC06: Tìm công việc theo từ khóa thành công
    @Test
    void searchJobsByKeyword_success() {
        Pageable pageable = PageRequest.of(0, 10);
        Job job = mock(Job.class);
        JobResponse response = mock(JobResponse.class);
        PageResponse<JobResponse> expected = mock(PageResponse.class);
        when(jobRepository.findByTitleContainingIgnoreCase("java", pageable)).thenReturn(new PageImpl<>(List.of(job)));
        when(jobMapper.toResponse(job)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<JobResponse> result = jobService.searchJobs("java", pageable);
        assertSame(expected, result);
        verify(jobRepository).findByTitleContainingIgnoreCase("java", pageable);
    }
    // TC07: Xóa công việc thành công
    @Test
    void deleteJob_success() {
        Employer employer = mock(Employer.class);
        Job job = mock(Job.class);
        when(employer.getId()).thenReturn(1L);
        when(employer.getUsername()).thenReturn("company");
        when(job.getTitle()).thenReturn("Java Intern");
        when(jobRepository.findByIdAndEmployerId(10L, 1L)).thenReturn(Optional.of(job));
        jobService.deleteJob(10L, employer);
        verify(jobRepository).delete(job);
        verify(systemLogService).saveLog(eq(employer), eq(Action.DELETE_JOB.name()), anyString());
    }
    // TC08: Xóa công việc không tồn tại hoặc không thuộc doanh nghiệp
    @Test
    void deleteJob_notFound() {
        Employer employer = mock(Employer.class);
        when(employer.getId()).thenReturn(1L);
        when(jobRepository.findByIdAndEmployerId(10L, 1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> jobService.deleteJob(10L, employer));
        verify(jobRepository, never()).delete(any());
    }
    // TC09: Cập nhật công việc thành công
    @Test
    void updateJobs_success() {
        Employer employer = mock(Employer.class);
        PostJobRequest request = mock(PostJobRequest.class);
        Job job = mock(Job.class);
        JobResponse expected = mock(JobResponse.class);
        when(employer.getId()).thenReturn(1L);
        when(jobRepository.findByIdAndEmployerId(10L, 1L)).thenReturn(Optional.of(job));
        when(jobMapper.toResponse(job)).thenReturn(expected);
        JobResponse result = jobService.updateJobs(10L, employer, request);
        assertSame(expected, result);
        verify(jobRepository).findByIdAndEmployerId(10L, 1L);
    }
    // TC10: Người dùng không phải Employer không được cập nhật công việc
    @Test
    void updateJobs_notEmployer() {
        User user = mock(User.class);
        PostJobRequest request = mock(PostJobRequest.class);
        assertThrows(ForbiddenException.class, () -> jobService.updateJobs(10L, user, request));
        verify(jobRepository, never()).findByIdAndEmployerId(anyLong(), anyLong());
    }
    // TC11: Không tìm thấy công việc để cập nhật
    @Test
    void updateJobs_notFound() {
        Employer employer = mock(Employer.class);
        PostJobRequest request = mock(PostJobRequest.class);
        when(employer.getId()).thenReturn(1L);
        when(jobRepository.findByIdAndEmployerId(10L, 1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> jobService.updateJobs(10L, employer, request));
    }
    // TC12: Employer lấy danh sách công việc của mình thành công
    @Test
    void getMyJobs_success() {
        Employer employer = mock(Employer.class);
        Pageable pageable = PageRequest.of(0, 10);
        Job job = mock(Job.class);
        JobResponse response = mock(JobResponse.class);
        PageResponse<JobResponse> expected = mock(PageResponse.class);
        when(employer.getId()).thenReturn(1L);
        when(jobRepository.findJobByEmployerId(1L, pageable)).thenReturn(new PageImpl<>(List.of(job)));
        when(jobMapper.toResponse(job)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<JobResponse> result = jobService.getMyJobs(employer, pageable);
        assertSame(expected, result);
        verify(jobRepository).findJobByEmployerId(1L, pageable);
    }
    // TC13: Người dùng không phải Employer không được xem job của mình
    @Test
    void getMyJobs_notEmployer() {
        User user = mock(User.class);
        Pageable pageable = PageRequest.of(0, 10);
        assertThrows(ForbiddenException.class, () -> jobService.getMyJobs(user, pageable));
        verify(jobRepository, never()).findJobByEmployerId(anyLong(), any());
    }
    // TC14: Lấy công việc theo Employer id thành công
    @Test
    void getJobsByEmployerId_success() {
        Pageable pageable = PageRequest.of(0, 10);
        Job job = mock(Job.class);
        JobResponse response = mock(JobResponse.class);
        PageResponse<JobResponse> expected = mock(PageResponse.class);
        when(jobRepository.findJobByEmployerId(1L, pageable)).thenReturn(new PageImpl<>(List.of(job)));
        when(jobMapper.toResponse(job)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<JobResponse> result = jobService.getJobsByEmployerId(1L, pageable);
        assertSame(expected, result);
        verify(jobRepository).findJobByEmployerId(1L, pageable);
    }
    // TC15: Đóng công việc thành công
    @Test
    void closeJob_success() {
        Employer employer = mock(Employer.class);
        Employer owner = mock(Employer.class);
        Job job = mock(Job.class);
        JobResponse expected = mock(JobResponse.class);
        when(employer.getId()).thenReturn(1L);
        when(employer.getUsername()).thenReturn("company");
        when(owner.getId()).thenReturn(1L);
        when(job.getEmployer()).thenReturn(owner);
        when(job.getStatus()).thenReturn(JobStatus.OPEN);
        when(job.getTitle()).thenReturn("Java Intern");
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        when(jobRepository.save(job)).thenReturn(job);
        when(jobMapper.toResponse(job)).thenReturn(expected);
        JobResponse result = jobService.closeJob(10L, employer);
        assertSame(expected, result);
        verify(job).setStatus(JobStatus.CLOSED);
        verify(jobRepository).save(job);
        verify(systemLogService).saveLog(eq(employer), eq(Action.UPDATE_JOB.name()), anyString());
    }
    // TC16: Không tìm thấy công việc để đóng
    @Test
    void closeJob_notFound() {
        Employer employer = mock(Employer.class);
        when(jobRepository.findById(10L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> jobService.closeJob(10L, employer));
        verify(jobRepository, never()).save(any());
    }
    // TC17: Employer không sở hữu công việc không được đóng
    @Test
    void closeJob_notOwner() {
        Employer employer = mock(Employer.class);
        Employer owner = mock(Employer.class);
        Job job = mock(Job.class);
        when(employer.getId()).thenReturn(1L);
        when(owner.getId()).thenReturn(2L);
        when(job.getEmployer()).thenReturn(owner);
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        assertThrows(ForbiddenException.class, () -> jobService.closeJob(10L, employer));
        verify(jobRepository, never()).save(any());
    }
    // TC18: Công việc đã đóng không được đóng lần nữa
    @Test
    void closeJob_alreadyClosed() {
        Employer employer = mock(Employer.class);
        Employer owner = mock(Employer.class);
        Job job = mock(Job.class);
        when(employer.getId()).thenReturn(1L);
        when(owner.getId()).thenReturn(1L);
        when(job.getEmployer()).thenReturn(owner);
        when(job.getStatus()).thenReturn(JobStatus.CLOSED);
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        assertThrows(ConflictException.class, () -> jobService.closeJob(10L, employer));
        verify(jobRepository, never()).save(any());
    }
    // TC19: Bán kính bằng 0 không hợp lệ
    @Test
    void searchJobs_radiusInvalid() {
        SearchJobRequest request = mock(SearchJobRequest.class);
        Pageable pageable = PageRequest.of(0, 10);
        when(request.getRadius()).thenReturn(0.0);
        assertThrows(RuntimeException.class, () -> jobService.searchJobs(request, pageable));
        verify(jobRepository, never()).findAll(pageable);
    }
    // TC20: Tìm kiếm nâng cao lọc đúng title lương bán kính và trạng thái
    @Test
    void searchJobs_filterSuccess() {
        SearchJobRequest request = mock(SearchJobRequest.class);
        Pageable pageable = PageRequest.of(0, 10);
        Job validJob = mock(Job.class);
        Job wrongTitle = mock(Job.class);
        Job lowSalary = mock(Job.class);
        Job farJob = mock(Job.class);
        Job closedJob = mock(Job.class);
        Job noLocation = mock(Job.class);
        Job nullTitle = mock(Job.class);
        JobResponse response = mock(JobResponse.class);
        PageResponse<JobResponse> expected = mock(PageResponse.class);
        when(request.getTitle()).thenReturn(" backend ");
        when(request.getSalary()).thenReturn(BigDecimal.valueOf(5000000));
        when(request.getLatitude()).thenReturn(10.0);
        when(request.getLongitude()).thenReturn(106.0);
        when(request.getRadius()).thenReturn(10.0);
        when(validJob.getTitle()).thenReturn("Java Backend Intern");
        when(validJob.getSalary()).thenReturn(BigDecimal.valueOf(6000000));
        when(validJob.getLatitude()).thenReturn(10.0);
        when(validJob.getLongitude()).thenReturn(106.0);
        when(validJob.getStatus()).thenReturn(JobStatus.OPEN);
        when(wrongTitle.getTitle()).thenReturn("Frontend Intern");
        when(lowSalary.getTitle()).thenReturn("Backend Intern");
        when(lowSalary.getSalary()).thenReturn(BigDecimal.valueOf(3000000));
        when(farJob.getTitle()).thenReturn("Backend Intern");
        when(farJob.getSalary()).thenReturn(BigDecimal.valueOf(6000000));
        when(farJob.getLatitude()).thenReturn(11.0);
        when(farJob.getLongitude()).thenReturn(107.0);
        when(closedJob.getTitle()).thenReturn("Backend Intern");
        when(closedJob.getSalary()).thenReturn(BigDecimal.valueOf(6000000));
        when(closedJob.getLatitude()).thenReturn(10.0);
        when(closedJob.getLongitude()).thenReturn(106.0);
        when(closedJob.getStatus()).thenReturn(JobStatus.CLOSED);
        when(noLocation.getTitle()).thenReturn("Backend Intern");
        when(noLocation.getSalary()).thenReturn(BigDecimal.valueOf(6000000));
        when(noLocation.getLatitude()).thenReturn(null);
        when(nullTitle.getTitle()).thenReturn(null);
        when(jobRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(validJob, wrongTitle, lowSalary, farJob, closedJob, noLocation, nullTitle)));
        when(jobMapper.toResponse(validJob)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<JobResponse> result = jobService.searchJobs(request, pageable);
        assertSame(expected, result);
        verify(jobMapper).toResponse(validJob);
        verify(jobMapper, never()).toResponse(wrongTitle);
        verify(jobMapper, never()).toResponse(lowSalary);
        verify(jobMapper, never()).toResponse(farJob);
        verify(jobMapper, never()).toResponse(closedJob);
        verify(jobMapper, never()).toResponse(noLocation);
        verify(jobMapper, never()).toResponse(nullTitle);
    }
    // TC21: Không truyền điều kiện tìm kiếm thì lấy tất cả job đang mở
    @Test
    void searchJobs_noFilter() {
        SearchJobRequest request = mock(SearchJobRequest.class);
        Pageable pageable = PageRequest.of(0, 10);
        Job openJob = mock(Job.class);
        Job closedJob = mock(Job.class);
        JobResponse response = mock(JobResponse.class);
        PageResponse<JobResponse> expected = mock(PageResponse.class);
        when(request.getTitle()).thenReturn(null);
        when(request.getSalary()).thenReturn(null);
        when(request.getLatitude()).thenReturn(null);
        when(request.getLongitude()).thenReturn(null);
        when(request.getRadius()).thenReturn(null);
        when(openJob.getStatus()).thenReturn(JobStatus.OPEN);
        when(closedJob.getStatus()).thenReturn(JobStatus.CLOSED);
        when(jobRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(openJob, closedJob)));
        when(jobMapper.toResponse(openJob)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<JobResponse> result = jobService.searchJobs(request, pageable);
        assertSame(expected, result);
        verify(jobMapper).toResponse(openJob);
        verify(jobMapper, never()).toResponse(closedJob);
    }
}
