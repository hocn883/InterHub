package com.example.InterHub.services;
import com.example.InterHub.dto.request.JobInvitationRequest;
import com.example.InterHub.dto.response.JobInvitationResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.CvUpload;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Job;
import com.example.InterHub.entity.JobInvitation;
import com.example.InterHub.entity.Student;
import com.example.InterHub.enums.Action;
import com.example.InterHub.enums.JobInvitationStatus;
import com.example.InterHub.mapper.JobInvitationMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.CvRepository;
import com.example.InterHub.repository.JobInvitationRepository;
import com.example.InterHub.repository.JobRepository;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class JobInvitationServiceTest {
    @Mock
    private JobInvitationRepository jobInvitationRepository;
    @Mock
    private JobRepository jobRepository;
    @Mock
    private CvRepository cvRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private JobInvitationMapper jobInvitationMapper;
    @Mock
    private PageMapper pageMapper;
    @Mock
    private SystemLogService systemLogService;
    @InjectMocks
    private JobInvitationService jobInvitationService;
    // TC01: Employer gửi lời mời cho sinh viên thành công
    @Test
    void inviteStudent_success() {
        Employer employer = mock(Employer.class);
        Student student = mock(Student.class);
        Job job = mock(Job.class);
        CvUpload cv = mock(CvUpload.class);
        JobInvitationRequest request = mock(JobInvitationRequest.class);
        JobInvitationResponse expected = mock(JobInvitationResponse.class);
        when(employer.getId()).thenReturn(1L);
        when(student.getId()).thenReturn(2L);
        when(job.getId()).thenReturn(10L);
        when(request.getCvId()).thenReturn(20L);
        when(request.getTitle()).thenReturn("Lời mời thực tập");
        when(request.getMessage()).thenReturn("Mời bạn tham gia");
        when(jobRepository.findByIdAndEmployerId(10L,1L)).thenReturn(Optional.of(job));
        when(cvRepository.findById(20L)).thenReturn(Optional.of(cv));
        when(cv.getStudent()).thenReturn(student);
        when(applicationRepository.existsByStudentIdAndJobId(2L,10L)).thenReturn(false);
        when(jobInvitationRepository.existsByStudentIdAndJobId(2L,10L)).thenReturn(false);
        when(jobInvitationMapper.toResponse(any(JobInvitation.class))).thenReturn(expected);
        JobInvitationResponse result = jobInvitationService.inviteStudent(employer,10L,request);
        assertSame(expected,result);
        verify(jobInvitationRepository).save(any(JobInvitation.class));
        verify(systemLogService).saveLog(eq(employer),eq(Action.SEND_JOB_INVITATION.name()),anyString());
    }
    // TC02: Sinh viên chấp nhận lời mời thành công
    @Test
    void acceptJobInvitation_success() {
        Student student = mock(Student.class);
        JobInvitation invitation = mock(JobInvitation.class);
        Job job = mock(Job.class);
        CvUpload cv = mock(CvUpload.class);
        JobInvitationResponse expected = mock(JobInvitationResponse.class);
        when(student.getId()).thenReturn(2L);
        when(job.getId()).thenReturn(10L);
        when(invitation.getJob()).thenReturn(job);
        when(invitation.getCv()).thenReturn(cv);
        when(cv.getFileUrl()).thenReturn("cv.pdf");
        when(jobInvitationRepository.findById(1L)).thenReturn(Optional.of(invitation));
        when(applicationRepository.existsByStudentIdAndJobId(2L,10L)).thenReturn(false);
        when(jobInvitationMapper.toResponse(invitation)).thenReturn(expected);
        JobInvitationResponse result = jobInvitationService.acceptJobInvitation(student,1L);
        assertSame(expected,result);
        verify(invitation).setStatus(JobInvitationStatus.ACCEPTED);
        verify(applicationRepository).save(any(Application.class));
        verify(systemLogService).saveLog(student,Action.ACCEPT_JOB_INVITATION.name(),"Chấp nhận lời mời công việc ID: 1");
    }
    // TC03: Employer lấy danh sách lời mời đã gửi
    @Test
    void getEmployerJobInvitations_success() {
        Employer employer = mock(Employer.class);
        JobInvitation invitation = mock(JobInvitation.class);
        JobInvitationResponse response = mock(JobInvitationResponse.class);
        PageResponse<JobInvitationResponse> expected = mock(PageResponse.class);
        Pageable pageable = PageRequest.of(0,10);
        when(employer.getId()).thenReturn(1L);
        when(jobInvitationRepository.findAllByJobEmployerId(1L,pageable)).thenReturn(new PageImpl<>(List.of(invitation)));
        when(jobInvitationMapper.toResponse(invitation)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<JobInvitationResponse> result = jobInvitationService.getEmployerJobInvitations(employer,pageable);
        assertSame(expected,result);
        verify(jobInvitationRepository).findAllByJobEmployerId(1L,pageable);
    }
    // TC04: Sinh viên lấy danh sách lời mời nhận được
    @Test
    void getStudentJobInvitations_success() {
        Student student = mock(Student.class);
        JobInvitation invitation = mock(JobInvitation.class);
        JobInvitationResponse response = mock(JobInvitationResponse.class);
        PageResponse<JobInvitationResponse> expected = mock(PageResponse.class);
        Pageable pageable = PageRequest.of(0,10);
        when(student.getId()).thenReturn(2L);
        when(jobInvitationRepository.findAllByStudentId(2L,pageable)).thenReturn(new PageImpl<>(List.of(invitation)));
        when(jobInvitationMapper.toResponse(invitation)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<JobInvitationResponse> result = jobInvitationService.getStudentJobInvitations(student,pageable);
        assertSame(expected,result);
        verify(jobInvitationRepository).findAllByStudentId(2L,pageable);
    }
    // TC05: Sinh viên từ chối lời mời thành công
    @Test
    void rejectJobInvitation_success() {
        Student student = mock(Student.class);
        JobInvitation invitation = mock(JobInvitation.class);
        JobInvitationResponse expected = mock(JobInvitationResponse.class);
        when(invitation.getStatus()).thenReturn(JobInvitationStatus.PENDING);
        when(jobInvitationRepository.findById(1L)).thenReturn(Optional.of(invitation));
        when(jobInvitationMapper.toResponse(invitation)).thenReturn(expected);
        JobInvitationResponse result = jobInvitationService.rejectJobInvitation(student,1L);
        assertSame(expected,result);
        verify(invitation).setStatus(JobInvitationStatus.REJECTED);
        verify(systemLogService).saveLog(student,Action.REJECT_JOB_INVITATION.name(),"Từ chối lời mời công việc ID: 1");
    }
    // TC06: Employer hủy lời mời thành công
    @Test
    void cancelJobInvitation_success() {
        Employer employer = mock(Employer.class);
        JobInvitation invitation = mock(JobInvitation.class);
        JobInvitationResponse expected = mock(JobInvitationResponse.class);
        when(invitation.getStatus()).thenReturn(JobInvitationStatus.PENDING);
        when(jobInvitationRepository.findById(1L)).thenReturn(Optional.of(invitation));
        when(jobInvitationMapper.toResponse(invitation)).thenReturn(expected);
        JobInvitationResponse result = jobInvitationService.cancelJobInvitation(employer,1L);
        assertSame(expected,result);
        verify(invitation).setStatus(JobInvitationStatus.CANCELLED);
        verify(systemLogService).saveLog(employer,Action.CANCEL_JOB_INVITATION.name(),"Hủy lời mời công việc ID: 1");
    }
}
