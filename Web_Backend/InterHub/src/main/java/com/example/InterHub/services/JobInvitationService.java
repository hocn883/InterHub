package com.example.InterHub.services;
import com.example.InterHub.dto.request.JobInvitationRequest;
import com.example.InterHub.dto.response.JobInvitationResponse;
import com.example.InterHub.dto.response.JobInvitationResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.*;
import com.example.InterHub.enums.*;
import com.example.InterHub.exception.ConflictException;
import com.example.InterHub.exception.DuplicateResourceException;
import com.example.InterHub.exception.ForbiddenException;
import com.example.InterHub.exception.ResourceNotFoundException;
import com.example.InterHub.mapper.JobInvitationMapper;
import com.example.InterHub.mapper.JobInvitationMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobInvitationService {
    private final JobInvitationRepository jobInvitationRepository;
    private final JobRepository jobRepository;
    private final CvRepository cvRepository;
    private final ApplicationRepository applicationRepository;
    private final JobInvitationMapper jobInvitationMapper;
    private final PageMapper pageMapper;
    @Transactional
    public JobInvitationResponse inviteStudent(
            Employer employer,
            Long jobId,
            JobInvitationRequest request
    ) {
        Job job = jobRepository
                .findByIdAndEmployerId(jobId, employer.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job không tồn tại hoặc không thuộc nhà tuyển dụng"
                        )
                );
        CvUpload cv = cvRepository
                .findById(request.getCvId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy CV"
                        )
                );
        Student student = cv.getStudent();
        boolean alreadyApplied =
                applicationRepository.existsByStudentIdAndJobId(
                        student.getId(),
                        job.getId()
                );
        if (alreadyApplied) {
            throw new ConflictException(
                    "Sinh viên này đã ứng tuyển vào công việc"
            );
        }
        boolean alreadyInvited =
                jobInvitationRepository.existsByStudentIdAndJobId(
                        student.getId(),
                        job.getId()
                );
        if (alreadyInvited) {
            throw new DuplicateResourceException(
                    "Bạn đã gửi lời mời cho sinh viên này"
            );
        }
        JobInvitation jobInvitation = JobInvitation.builder()
                .student(student)
                .job(job)
                .cv(cv)
                .message(request.getMessage())
                .status(JobInvitationStatus.PENDING)
                .build();
        jobInvitationRepository.save(jobInvitation);
        return jobInvitationMapper.toResponse(jobInvitation);
    }
    @Transactional
    public JobInvitationResponse acceptJobInvitation(
            Student student,
            Long jobInvitationId
    ) {
        JobInvitation jobInvitation =
                jobInvitationRepository
                        .findById(jobInvitationId)
                        .orElseThrow();
        boolean alreadyApplied =
                applicationRepository
                        .existsByStudentIdAndJobId(
                                student.getId(),
                                jobInvitation.getJob().getId()
                        );

        if (alreadyApplied) {
            throw new RuntimeException(
                    "Bạn đã ứng tuyển vào công việc này"
            );
        }
        jobInvitation.setStatus(
                JobInvitationStatus.ACCEPTED
        );
        Application application =
                Application.builder()
                        .student(student)
                        .job(jobInvitation.getJob())
                        .fileCv(
                                jobInvitation
                                        .getCv().getFileUrl()
                        )
                        .coverLetter(null)
                        .status(ApplicationStatus.PENDING)
                        .source(ApplicationSource.EMPLOYER_INVITED)
                        .build();

        applicationRepository.save(application);
        return jobInvitationMapper.toResponse(jobInvitation);
    }
    @Transactional(readOnly = true)
    public PageResponse<JobInvitationResponse> getEmployerJobInvitations(
            Employer employer,
            Pageable pageable
    ) {
        Page<JobInvitation>pageInvitation=jobInvitationRepository.findAllByJobEmployerId(
                employer.getId(), pageable
        );
        Page<JobInvitationResponse>page=pageInvitation.map(jobInvitationMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional(readOnly = true)
    public PageResponse<JobInvitationResponse> getStudentJobInvitations(
            Student student,
            Pageable pageable
    ) {
        Page<JobInvitation>pageInvitations=jobInvitationRepository.findAllByStudentId(student.getId(),pageable);
        Page<JobInvitationResponse>page=pageInvitations.map(jobInvitationMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional
    public JobInvitationResponse rejectJobInvitation(
            Student student,
            Long jobInvitationId
    ) {
        JobInvitation jobInvitation = jobInvitationRepository
                .findById(jobInvitationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Không tìm thấy lời mời")
                );
        if (jobInvitation.getStatus() != JobInvitationStatus.PENDING) {
            throw new ConflictException("Lời mời này đã được xử lý");
        }

        jobInvitation.setStatus(JobInvitationStatus.REJECTED);

        return jobInvitationMapper.toResponse(jobInvitation);
    }
    @Transactional
    public JobInvitationResponse cancelJobInvitation(
            Employer employer,
            Long jobInvitationId
    ) {
        JobInvitation jobInvitation = jobInvitationRepository
                .findById(jobInvitationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Không tìm thấy lời mời")
                );
        if (jobInvitation.getStatus() != JobInvitationStatus.PENDING) {
            throw new ConflictException("Chỉ có thể hủy lời mời đang chờ");
        }

        jobInvitation.setStatus(JobInvitationStatus.CANCELLED);

        return jobInvitationMapper.toResponse(jobInvitation);
    }
}