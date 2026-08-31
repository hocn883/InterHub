package com.example.InterHub.services;

import com.example.InterHub.dto.request.ApplicationRequest;
import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Job;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.Action;
import com.example.InterHub.enums.ApplicationSource;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.enums.JobStatus;
import com.example.InterHub.enums.StudentStatus;
import com.example.InterHub.exception.BadRequestException;
import com.example.InterHub.exception.ConflictException;
import com.example.InterHub.exception.DuplicateResourceException;
import com.example.InterHub.exception.ForbiddenException;
import com.example.InterHub.exception.ResourceNotFoundException;
import com.example.InterHub.mapper.ApplicationMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.JobRepository;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import com.example.InterHub.services.cloudinary.FileUpload;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationMapper applicationMapper;
    private final CloudinaryService cloudinaryService;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PageMapper pageMapper;
    private final SystemLogService systemLogService;
    @Transactional
    public ApplicationResponse applyJob(Long jobId, User currentUser, ApplicationRequest request) {
        Student student=(Student)currentUser;
        if (student.getStatus() != StudentStatus.TIM_VIEC) {
            throw new ConflictException(
                    "Bạn đã có công việc thực tập rồi."
            );
        }
        Job job = jobRepository.findJobById(jobId).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Không tìm thấy công việc"
                )
        );
        if (applicationRepository.existsByStudentIdAndJobId(
                student.getId(),
                job.getId()
        )) {
            throw new DuplicateResourceException(
                    "Bạn đã ứng tuyển công việc này"
            );
        }
        FileUpload cv = cloudinaryService.uploadCv(request.getFileCv());
        Application application = Application.builder()
                .coverLetter(request.getCoverLetter())
                .fileCv(cv.getUrl())
                .student(student)
                .job(job)
                .status(ApplicationStatus.PENDING)
                .source(ApplicationSource.STUDENT_APPLIED)
                .build();
        applicationRepository.save(application);
        systemLogService.saveLog(
                currentUser,
                Action.APPLY_JOB.name(),
                "Ứng tuyển công việc ID: " + job.getId()
        );
        return applicationMapper.toResponse(application);
    }
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getMyApplications(
            User currentUser,
            Pageable pageable
    ) {
        Student student=(Student)currentUser;
        Page<Application> applicationPage =
                applicationRepository
                        .findByStudentIdOrderByCreatedDateDesc(
                                student.getId(),
                                pageable
                        );
        Page<ApplicationResponse> page =
                applicationPage.map(
                        applicationMapper::toResponse
                );
        return pageMapper.toPageResponse(page);
    }
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) {
        Application application = applicationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy đơn ứng tuyển"
                )
        );
        return applicationMapper.toResponse(application);
    }
    @Transactional
    public void deletedById(
            Long id,
            User currentUser
    ) {
        Student student = (Student)currentUser;
        Application application = applicationRepository.findByIdAndStudentId(id, student.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy đơn ứng tuyển"
                        )
                );
        if (application.getStatus()
                == ApplicationStatus.APPROVED) {
            throw new ConflictException(
                    "Không thể xóa đơn ứng tuyển đã được chấp nhận"
            );
        }
        applicationRepository.delete(application);
        systemLogService.saveLog(
                currentUser,
                Action.CANCEL_APPLICATION.name(),
                "Hủy đơn ứng tuyển ID: " + id
        );
    }
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse>
    getApplicationsByJob(
            Long jobId,
            User currentUser,
            Pageable pageable
    ) {
        Employer  employer=(Employer)currentUser;
        Job job =
                jobRepository.findByIdAndEmployerId(
                                jobId,
                                employer.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Không tìm thấy công việc"
                                )
                        );

        Page<Application> applicationPage =
                applicationRepository
                        .findByJobIdAndJobEmployerIdOrderByCreatedDateDesc(
                                job.getId(),
                                employer.getId(),
                                pageable
                        );

        Page<ApplicationResponse> page =
                applicationPage.map(
                        applicationMapper::toResponse
                );

        return pageMapper.toPageResponse(page);
    }

    @Transactional
    public ApplicationResponse approveApplication(Long applicationId, User currentUser) {
        Employer  employer=(Employer)currentUser;
        Application application = applicationRepository.findByIdAndJobEmployerId(applicationId, employer.getId()).orElseThrow(() -> new ResourceNotFoundException(
                "Không tìm thấy đơn ứng tuyển."));
        validatePendingApplication(application);
        Student student = application.getStudent();
        if (student.getStatus() == StudentStatus.DA_CO_VIEC) {
            throw new ConflictException(
                    "Sinh viên này đã có việc"
            );
        }
        application.setStatus(ApplicationStatus.APPROVED
        );
        student.setStatus(StudentStatus.DA_CO_VIEC
        );
        Application savedApplication=applicationRepository.save(application);
        systemLogService.saveLog(
                currentUser,
                Action.UPDATE_APPLICATION_STATUS.name(),
                "Duyệt đơn ứng tuyển ID: " + applicationId
        );
        return applicationMapper.toResponse(savedApplication);
    }
    @Transactional
    public ApplicationResponse rejectApplication(
            Long applicationId,
            User currentUser
    ) {
        Employer employer=(Employer)currentUser;
        Application application = applicationRepository.findByIdAndJobEmployerId(applicationId,employer.getId()).orElseThrow(() -> new ResourceNotFoundException(
                "Không tìm thấy đơn ứng tuyển."
        ));
        validatePendingApplication(application);
        application.setStatus(ApplicationStatus.REJECTED);
        Application savedApplication = applicationRepository.save(application);
        systemLogService.saveLog(
                currentUser,
                Action.UPDATE_APPLICATION_STATUS.name(),
                "Từ chối đơn ứng tuyển ID: " + applicationId
        );
        return applicationMapper.toResponse(savedApplication);
    }
    private void validatePendingApplication(
            Application application
    ) {
        if (application.getStatus() != ApplicationStatus.PENDING) {throw new ConflictException(
                "Chỉ có thể xử lý đơn ứng tuyển đang chờ"
        );
        }
    }
}