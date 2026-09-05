package com.example.InterHub.services;
import com.example.InterHub.dto.request.ApplicationRequest;
import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Job;
import com.example.InterHub.entity.Student;
import com.example.InterHub.enums.Action;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.enums.StudentStatus;
import com.example.InterHub.mapper.ApplicationMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.JobRepository;
import com.example.InterHub.repository.StudentRepository;
import com.example.InterHub.services.EmailService.EmailService;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import com.example.InterHub.services.cloudinary.FileUpload;
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
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {
    @Mock
    private ApplicationMapper applicationMapper;
    @Mock
    private CloudinaryService cloudinaryService;
    @Mock
    private JobRepository jobRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private PageMapper pageMapper;
    @Mock
    private SystemLogService systemLogService;
    @Mock
    private EmailService emailService;
    @Mock
    private StudentRepository studentRepository;
    @InjectMocks
    private ApplicationService applicationService;
    // TC01: Sinh viên ứng tuyển công việc thành công
    @Test
    void applyJob_success() {
        Student student = mock(Student.class);
        Job job = mock(Job.class);
        ApplicationRequest request = mock(ApplicationRequest.class);
        FileUpload fileUpload = mock(FileUpload.class);
        ApplicationResponse expected = mock(ApplicationResponse.class);
        when(student.getId()).thenReturn(1L);
        when(student.getStatus()).thenReturn(StudentStatus.TIM_VIEC);
        when(job.getId()).thenReturn(10L);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(jobRepository.findJobById(10L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByStudentIdAndJobId(1L,10L)).thenReturn(false);
        when(cloudinaryService.uploadCv(any())).thenReturn(fileUpload);
        when(fileUpload.getUrl()).thenReturn("cv.pdf");
        when(request.getCoverLetter()).thenReturn("Xin ứng tuyển");
        when(applicationMapper.toResponse(any(Application.class))).thenReturn(expected);
        ApplicationResponse result = applicationService.applyJob(10L,student,request);
        assertSame(expected,result);
        verify(applicationRepository).save(any(Application.class));
        verify(systemLogService).saveLog(student,Action.APPLY_JOB.name(),"Ứng tuyển công việc ID: 10");
    }
    // TC02: Lấy danh sách đơn ứng tuyển của sinh viên
    @Test
    void getMyApplications_success() {
        Student student = mock(Student.class);
        Application application = mock(Application.class);
        ApplicationResponse applicationResponse = mock(ApplicationResponse.class);
        PageResponse<ApplicationResponse> expected = mock(PageResponse.class);
        Pageable pageable = PageRequest.of(0,10);
        when(student.getId()).thenReturn(1L);
        when(applicationRepository.findByStudentIdOrderByCreatedDateDesc(1L,pageable)).thenReturn(new PageImpl<>(List.of(application)));
        when(applicationMapper.toResponse(application)).thenReturn(applicationResponse);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<ApplicationResponse> result = applicationService.getMyApplications(student,pageable);
        assertSame(expected,result);
        verify(applicationRepository).findByStudentIdOrderByCreatedDateDesc(1L,pageable);
    }
    // TC03: Lấy đơn ứng tuyển theo id
    @Test
    void getApplicationById_success() {
        Application application = mock(Application.class);
        ApplicationResponse expected = mock(ApplicationResponse.class);
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(applicationMapper.toResponse(application)).thenReturn(expected);
        ApplicationResponse result = applicationService.getApplicationById(1L);
        assertSame(expected,result);
        verify(applicationRepository).findById(1L);
    }
    // TC04: Sinh viên hủy đơn ứng tuyển thành công
    @Test
    void deletedById_success() {
        Student student = mock(Student.class);
        Application application = mock(Application.class);
        when(student.getId()).thenReturn(1L);
        when(application.getStatus()).thenReturn(ApplicationStatus.PENDING);
        when(applicationRepository.findByIdAndStudentId(10L,1L)).thenReturn(Optional.of(application));
        applicationService.deletedById(10L,student);
        verify(applicationRepository).delete(application);
        verify(systemLogService).saveLog(student,Action.CANCEL_APPLICATION.name(),"Hủy đơn ứng tuyển ID: 10");
    }
    // TC05: Employer lấy danh sách ứng tuyển theo công việc
    @Test
    void getApplicationsByJob_success() {
        Employer employer = mock(Employer.class);
        Job job = mock(Job.class);
        Application application = mock(Application.class);
        ApplicationResponse applicationResponse = mock(ApplicationResponse.class);
        PageResponse<ApplicationResponse> expected = mock(PageResponse.class);
        Pageable pageable = PageRequest.of(0,10);
        when(employer.getId()).thenReturn(1L);
        when(job.getId()).thenReturn(10L);
        when(jobRepository.findByIdAndEmployerId(10L,1L)).thenReturn(Optional.of(job));
        when(applicationRepository.findByJobIdAndJobEmployerIdOrderByCreatedDateDesc(10L,1L,pageable)).thenReturn(new PageImpl<>(List.of(application)));
        when(applicationMapper.toResponse(application)).thenReturn(applicationResponse);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<ApplicationResponse> result = applicationService.getApplicationsByJob(10L,employer,pageable);
        assertSame(expected,result);
        verify(applicationRepository).findByJobIdAndJobEmployerIdOrderByCreatedDateDesc(10L,1L,pageable);
    }
    // TC06: Employer duyệt đơn ứng tuyển thành công
    @Test
    void approveApplication_success() {
        Employer employer = mock(Employer.class);
        Student student = mock(Student.class);
        Application application = mock(Application.class);
        ApplicationResponse expected = mock(ApplicationResponse.class);
        when(employer.getId()).thenReturn(1L);
        when(employer.getCompanyName()).thenReturn("ABC Company");
        when(application.getStatus()).thenReturn(ApplicationStatus.PENDING);
        when(application.getStudent()).thenReturn(student);
        when(student.getStatus()).thenReturn(StudentStatus.TIM_VIEC);
        when(student.getEmail()).thenReturn("student@gmail.com");
        when(student.getFullName()).thenReturn("Nguyen Van A");
        when(applicationRepository.findByIdAndJobEmployerId(10L,1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(application)).thenReturn(application);
        when(applicationMapper.toResponse(application)).thenReturn(expected);
        ApplicationResponse result = applicationService.approveApplication(10L,employer);
        assertSame(expected,result);
        verify(application).setStatus(ApplicationStatus.APPROVED);
        verify(student).setStatus(StudentStatus.DA_CO_VIEC);
        verify(applicationRepository).save(application);
        verify(emailService).sendEmail(eq("student@gmail.com"),anyString(),anyString());
        verify(systemLogService).saveLog(employer,Action.UPDATE_APPLICATION_STATUS.name(),"Duyệt đơn ứng tuyển ID: 10");
    }
    // TC07: Employer từ chối đơn ứng tuyển thành công
    @Test
    void rejectApplication_success() {
        Employer employer = mock(Employer.class);
        Application application = mock(Application.class);
        ApplicationResponse expected = mock(ApplicationResponse.class);
        when(employer.getId()).thenReturn(1L);
        when(application.getStatus()).thenReturn(ApplicationStatus.PENDING);
        when(applicationRepository.findByIdAndJobEmployerId(10L,1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(application)).thenReturn(application);
        when(applicationMapper.toResponse(application)).thenReturn(expected);
        ApplicationResponse result = applicationService.rejectApplication(10L,employer);
        assertSame(expected,result);
        verify(application).setStatus(ApplicationStatus.REJECTED);
        verify(applicationRepository).save(application);
        verify(systemLogService).saveLog(employer,Action.UPDATE_APPLICATION_STATUS.name(),"Từ chối đơn ứng tuyển ID: 10");
    }
}