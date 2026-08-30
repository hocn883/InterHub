package com.example.InterHub.services;

import com.example.InterHub.dto.request.ApplicationRequest;
import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.*;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.enums.JobStatus;
import com.example.InterHub.enums.StudentStatus;
import com.example.InterHub.mapper.ApplicationMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.JobRepository;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import com.example.InterHub.services.cloudinary.FileUpload;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationMapper applicationMapper;
    private final CloudinaryService cloudinaryService;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PageMapper pageMapper;

    @Transactional
    public ApplicationResponse applyJob(Long jobId, User currentUser, ApplicationRequest request) {
        Student student = (Student) currentUser;
        FileUpload Cv = cloudinaryService.uploadCv(request.getFileCv());
        Job job = jobRepository.findJobById(jobId).orElseThrow();
        if (job.getStatus() != JobStatus.OPEN) {

            throw new RuntimeException("Job đã đóng hoặc hoàn thành");
        }
        Application apply = Application.builder().coverLetter(request.getCoverLetter()).
                fileCv(Cv.getUrl()).student(student).job(job).build();
        applicationRepository.save(apply);
        return applicationMapper.toResponse(apply);
    }

    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getMyApplications(
            User currentUser,
            Pageable pageable
    ) {
        Student student = (Student) currentUser;
        Page<Application>applicationPage=applicationRepository
                .findByStudentIdOrderByCreatedDateDesc(currentUser.getId(), pageable);
        Page<ApplicationResponse>page=applicationPage.map(applicationMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) {
        return applicationMapper.toResponse(applicationRepository.findById(id).orElseThrow());
    }
    @Transactional
    public void deletedById(Long id, User currentUser) {
       Student student= (Student) currentUser;
        Application application =
                applicationRepository.findByIdAndStudentId(
                                id,
                                student.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy đơn ứng tuyển"
                                )
                        );
        applicationRepository.delete(application);
    }

    //Employer
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getApplicationsByJob(
            Long jobId,
            User currentUser,
            Pageable pageable
    ) {
        Employer employer = (Employer) currentUser;
        Job job = jobRepository.findByIdAndEmployerId(
                        jobId,
                        employer.getId()
                )
                .orElseThrow();

        Page<Application> applicationPage = applicationRepository.
                findByJobIdAndJobEmployerIdOrderByCreatedDateDesc(job.getId(), employer.getId(), pageable);
        Page<ApplicationResponse>page=applicationPage.map(applicationMapper::toResponse);

        return pageMapper.toPageResponse(page);
    }

    //Duyệt applicataion
    @Transactional
    public ApplicationResponse approveApplication(
            Long applicationId,
            User currentUser
    ) {
        Employer employer = (Employer) currentUser;
        Application application = applicationRepository.findByIdAndJobEmployerId(applicationId,employer.getId()).orElseThrow();
        validatePendingApplication(application);
        application.setStatus(ApplicationStatus.APPROVED);
        Student student = application.getStudent();
        student.setStatus(StudentStatus.DA_CO_VIEC);
        Application savedApplication =
                applicationRepository.save(application);
        return applicationMapper.toResponse(savedApplication);

    }

    //Từ chối
    @Transactional
    public ApplicationResponse rejectApplication(
            Long applicationId,
            User currentUser
    ) {
        Employer employer = (Employer) currentUser;
        Application application = applicationRepository.findByIdAndJobEmployerId(applicationId,employer.getId()).orElseThrow();
        validatePendingApplication(application);
        application.setStatus(ApplicationStatus.REJECTED);
        Application savedApplication =
                applicationRepository.save(application);
        return applicationMapper.toResponse(savedApplication);

    }
    private void validatePendingApplication(
            Application application
    ) {
        if (application.getStatus()
                != ApplicationStatus.PENDING) {
            throw new RuntimeException(
                    "chỉ được duyệt application chờ"
            );
        }
    }

}
