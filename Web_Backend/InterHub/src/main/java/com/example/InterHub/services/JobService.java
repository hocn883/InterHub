package com.example.InterHub.services;

import com.example.InterHub.dto.request.PostJobRequest;
import com.example.InterHub.dto.response.JobResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Job;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.EmployerStatus;
import com.example.InterHub.enums.JobStatus;
import com.example.InterHub.mapper.JobMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.JobRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final EmployerRepository employerRepository;
    private final JobMapper jobMapper;
    private final PageMapper pageMapper;
    private final SystemLogService systemLogService;
    @Transactional(readOnly = true)
    public PageResponse<JobResponse> getAllJobs(Pageable pageable) {
        Page<Job> jobPage = jobRepository.findAll(pageable);
        Page<JobResponse>page=jobPage.map(jobMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    public JobResponse create(User currentUser, PostJobRequest request)
    {
        Employer employer=(Employer)currentUser;
        if(employer.getStatus()!= EmployerStatus.APPROVED)
        {
            throw new RuntimeException(
                    "Nhà tuyển dụng chưa được admin duyệt."
            );
        }
        Job job = jobMapper.toEntity(request);
        job.setEmployer(employer);
        job.setStatus(JobStatus.OPEN);
        Job saveJob=jobRepository.save(job);
        systemLogService.saveLog(
                employer,
                "CREATE_JOB",
                "Doanh nghiệp " + employer.getUsername()
                        + " đã đăng công việc " + saveJob.getTitle()
        );
        return jobMapper.toResponse(saveJob);
    }
    @Transactional(readOnly=true)
    public JobResponse getJobById(Long id)
    {
        Job job= jobRepository.findJobById(id).orElseThrow();
        return jobMapper.toResponse(job);
    }
    @Transactional(readOnly=true)
    public PageResponse<JobResponse> searchJobs(String kw,Pageable pageable) {
        Page<Job>jobPage=jobRepository.findByTitleContainingIgnoreCase(kw,pageable);
        Page<JobResponse>page=jobPage.map(jobMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional
    public void deleteJob(Long id, User currentUser) {
        Employer employer = (Employer)currentUser;
        Job job= jobRepository.findByIdAndEmployerId(id,employer.getId()).orElseThrow();
        jobRepository.delete(job);
        systemLogService.saveLog(
                employer,
                "DELETED_JOB",
                "Doanh nghiệp " + employer.getUsername()
                        + " đã xóa công việc " + job.getTitle()
        );
    }
    @Transactional
    public JobResponse updateJobs(Long id, User currentUser, PostJobRequest request)
    {
        Job job = jobRepository.findByIdAndEmployerId(id, currentUser.getId()).orElseThrow();
        return jobMapper.toResponse(job);
    }
    @Transactional
    public PageResponse<JobResponse> getMyJobs(User currentUser,Pageable pageable)
    {
        Page<Job>jobPage=jobRepository.findJobByEmployerId(currentUser.getId(),pageable);
        Page<JobResponse>page=jobPage.map(jobMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional
    public PageResponse<JobResponse>getJobsByEmployerId(Long id,Pageable pageable)
    {
        Page<Job>jobPage=jobRepository.findJobByEmployerId(id,pageable);
        Page<JobResponse>page=jobPage.map(jobMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional
    public JobResponse closeJob(
            Long jobId,
            User currentUser
    ) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Không tìm thấy Job"
                        )
                );
        if (!job.getEmployer().getId()
                .equals(currentUser.getId())) {
            throw new RuntimeException(
                    "Bạn không có quyền đóng Job này"
            );
        }
        if (job.getStatus() == JobStatus.CLOSED) {
            throw new RuntimeException(
                    "Job đã được đóng"
            );
        }
        job.setStatus(JobStatus.CLOSED);
        Job savedJob = jobRepository.save(job);
        return jobMapper.toResponse(savedJob);
    }
}
