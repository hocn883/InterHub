package com.example.InterHub.services;

import com.example.InterHub.dto.request.PostJobRequest;
import com.example.InterHub.dto.request.SearchJobRequest;
import com.example.InterHub.dto.response.JobResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Job;
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
import com.example.InterHub.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final EmployerRepository employerRepository;
    private final JobMapper jobMapper;
    private final PageMapper pageMapper;
    private final SystemLogService systemLogService;
    @Transactional(readOnly = true)
    public PageResponse<JobResponse> getAllJobs(Pageable pageable)
    {
        Page<Job> jobPage = jobRepository.findAll(pageable);
        Page<JobResponse> page = jobPage.map(jobMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional
    public JobResponse create(User currentUser, PostJobRequest request) {
        Employer employer = (Employer) currentUser;
        if (employer.getStatus() != EmployerStatus.APPROVED) {
            throw new ForbiddenException(
                    "Nhà tuyển dụng chưa được Admin duyệt");
        }
        Job job = jobMapper.toEntity(request);
        job.setEmployer(employer);
        job.setStatus(JobStatus.OPEN);
        Job savedJob = jobRepository.save(job);
        systemLogService.saveLog(employer, Action.CREATE_JOB.name(),
                "Doanh nghiệp " + employer.getUsername() + " đã đăng công việc "+ savedJob.getTitle());
        return jobMapper.toResponse(savedJob);
    }
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findJobById(id).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc"));
        return jobMapper.toResponse(job);
    }
    @Transactional(readOnly = true)
    public PageResponse<JobResponse> searchJobs(
            String kw,
            Pageable pageable
    ) {
        Page<Job> jobPage = jobRepository.findByTitleContainingIgnoreCase(kw, pageable);
        Page<JobResponse> page = jobPage.map(jobMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional
    public void deleteJob(Long id, User currentUser) {
        Employer  employer = (Employer) currentUser;
        Job job = jobRepository.findByIdAndEmployerId(id, employer.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy công việc hoặc bạn không có quyền xóa"
                        ));
        jobRepository.delete(job);
        systemLogService.saveLog(employer,
                Action.DELETE_JOB.name(),
                "Doanh nghiệp "
                        + employer.getUsername()
                        + " đã xóa công việc "
                        + job.getTitle());
    }
    @Transactional
    public JobResponse updateJobs(Long id, User currentUser, PostJobRequest request)
    {
        if (!(currentUser instanceof Employer employer)) {
            throw new ForbiddenException(
                    "Chỉ nhà tuyển dụng mới có thể cập nhật công việc"
            );
        }
        Job job = jobRepository.findByIdAndEmployerId(id, employer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc hoặc bạn không có quyền cập nhật"));
        return jobMapper.toResponse(job);
    }
    @Transactional(readOnly = true)
    public PageResponse<JobResponse> getMyJobs(User currentUser, Pageable pageable)
    {
        if (!(currentUser instanceof Employer employer))
        {
            throw new ForbiddenException("Chỉ nhà tuyển dụng mới có thể xem công việc của mình");
        }
        Page<Job> jobPage = jobRepository.findJobByEmployerId(employer.getId(),pageable);
        Page<JobResponse> page = jobPage.map(jobMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional(readOnly = true)
    public PageResponse<JobResponse> getJobsByEmployerId(Long id, Pageable pageable) {
        Page<Job> jobPage = jobRepository.findJobByEmployerId(id, pageable);
        Page<JobResponse> page = jobPage.map(jobMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional
    public JobResponse closeJob(Long jobId, User currentUser
    ) {
        Employer  employer = (Employer) currentUser;
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc"));
        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new ForbiddenException(
                    "Bạn không có quyền đóng công việc này");}
        if (job.getStatus() == JobStatus.CLOSED) {
            throw new ConflictException(
                    "Công việc đã được đóng trước đó");}
        job.setStatus(JobStatus.CLOSED);
        Job savedJob = jobRepository.save(job);
        systemLogService.saveLog(
                employer,
                Action.UPDATE_JOB.name(),
                "Doanh nghiệp "
                        + employer.getUsername()
                        + " đã đóng công việc "
                        + savedJob.getTitle()
        );
        return jobMapper.toResponse(savedJob);
    }
    //tim kim job//
    public PageResponse<JobResponse> searchJobs(SearchJobRequest request, Pageable pageable
    ) {
        if (request.getRadius() != null && request.getRadius() <= 0) {
            throw new RuntimeException("Bán kính phải lớn hơn 0");
        }
        Page<Job> jobs = jobRepository.findAll(pageable);
        List<JobResponse> filteredJobs = jobs.stream()
                .filter(job -> matchTitle(
                        job,
                        request.getTitle()
                ))    .filter(job ->
                        request.getSalary() == null ||
                                job.getSalary().compareTo(request.getSalary()) >= 0
                ).filter(job -> matchDistance(
                        job,
                        request.getLatitude(),
                        request.getLongitude(),
                        request.getRadius()
                )).filter(job->job.getStatus() == JobStatus.CLOSED)
                .map(jobMapper::toResponse)
                .toList();
        Page<JobResponse> page = new PageImpl<>(filteredJobs, pageable, filteredJobs.size()
        );
        return pageMapper.toPageResponse(page);
    }
    private boolean matchTitle(Job job, String title) {
        if (title == null || title.isBlank()) {
            return true;
        }
        if (job.getTitle() == null) {
            return false;
        }
        return job.getTitle().toLowerCase().contains(title.trim().toLowerCase());
    }
    private boolean matchDistance(Job job, Double latitude, Double longitude, Double radius
    ) {
        if (
                latitude == null || longitude == null || radius == null
        ) {
            return true;
        }
        if (
                job.getLatitude() == null || job.getLongitude() == null
        ) {
            return false;
        }
        double distance = calculateDistance(latitude, longitude, job.getLatitude(), job.getLongitude()
        );
        return distance <= radius;
    }
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2
    ) {
        final double EARTH_RADIUS = 6371.0;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2)
                        * Math.sin(latDistance / 2)
                        + Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2)
                        * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c;
    }
}