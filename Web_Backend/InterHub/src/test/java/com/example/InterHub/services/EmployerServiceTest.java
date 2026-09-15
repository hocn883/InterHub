package com.example.InterHub.services;
import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.EmployerResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.mapper.ApplicationMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.StudentRepository;
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
class EmployerServiceTest {
    @Mock
    private EmployerRepository employerRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PageMapper pageMapper;
    @Mock
    private ApplicationMapper applicationMapper;
    @InjectMocks
    private EmployerService employerService;
    // TC01: Lấy tất cả nhà tuyển dụng
    @Test
    void getAll_success() {
        Pageable pageable = PageRequest.of(0,10);
        Employer employer = mock(Employer.class);
        EmployerResponse employerResponse = mock(EmployerResponse.class);
        PageResponse<EmployerResponse> expected = mock(PageResponse.class);
        when(employerRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(employer)));
        when(userMapper.toEmployerResponse(employer)).thenReturn(employerResponse);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<EmployerResponse> result = employerService.getAll(pageable);
        assertSame(expected,result);
        verify(employerRepository).findAll(pageable);
    }
    // TC02: Lấy nhà tuyển dụng theo id
    @Test
    void getEmployerById_success() {
        Employer employer = mock(Employer.class);
        EmployerResponse expected = mock(EmployerResponse.class);
        when(employerRepository.findById(1L)).thenReturn(Optional.of(employer));
        when(userMapper.toEmployerResponse(employer)).thenReturn(expected);
        EmployerResponse result = employerService.getEmployerById(1L);
        assertSame(expected,result);
        verify(employerRepository).findById(1L);
    }
    // TC03: Lấy sinh viên đã được duyệt
    @Test
    void getApprovedStudents_success() {
        Pageable pageable = PageRequest.of(0,10);
        Application application = mock(Application.class);
        ApplicationResponse applicationResponse = mock(ApplicationResponse.class);
        PageResponse<ApplicationResponse> expected = mock(PageResponse.class);
        when(applicationRepository.findByJobEmployerIdAndStatus(1L,ApplicationStatus.APPROVED,pageable)).thenReturn(new PageImpl<>(List.of(application)));
        when(applicationMapper.toResponse(application)).thenReturn(applicationResponse);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<ApplicationResponse> result = employerService.getApprovedStudents(1L,pageable);
        assertSame(expected,result);
        verify(applicationRepository).findByJobEmployerIdAndStatus(1L,ApplicationStatus.APPROVED,pageable);
    }
    // TC04: Lấy sinh viên đã bị từ chối
    @Test
    void getRejectedStudents_success() {
        Pageable pageable = PageRequest.of(0,10);
        Application application = mock(Application.class);
        ApplicationResponse applicationResponse = mock(ApplicationResponse.class);
        PageResponse<ApplicationResponse> expected = mock(PageResponse.class);
        when(applicationRepository.findByJobEmployerIdAndStatus(1L,ApplicationStatus.REJECTED,pageable)).thenReturn(new PageImpl<>(List.of(application)));
        when(applicationMapper.toResponse(application)).thenReturn(applicationResponse);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<ApplicationResponse> result = employerService.getRejectedStudents(1L,pageable);
        assertSame(expected,result);
        verify(applicationRepository).findByJobEmployerIdAndStatus(1L,ApplicationStatus.REJECTED,pageable);
    }
}
