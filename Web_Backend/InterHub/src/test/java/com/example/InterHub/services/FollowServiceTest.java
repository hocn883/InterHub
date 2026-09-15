package com.example.InterHub.services;
import com.example.InterHub.dto.response.FollowResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Follow;
import com.example.InterHub.entity.Student;
import com.example.InterHub.mapper.FollowMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.FollowRepository;
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
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class FollowServiceTest {
    @Mock
    private FollowRepository followRepository;
    @Mock
    private EmployerRepository employerRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private FollowMapper followMapper;
    @Mock
    private PageMapper pageMapper;
    @InjectMocks
    private FollowService followService;
    // TC01: Sinh viên theo dõi doanh nghiệp thành công
    @Test
    void followEmployer_success() {
        Student student = mock(Student.class);
        Employer employer = mock(Employer.class);
        when(employerRepository.findById(1L)).thenReturn(Optional.of(employer));
        when(followRepository.existsByStudentAndEmployer(student,employer)).thenReturn(false);
        followService.followEmployer(student,1L);
        verify(followRepository).save(any(Follow.class));
    }
    // TC02: Sinh viên bỏ theo dõi doanh nghiệp thành công
    @Test
    void unfollowEmployer_success() {
        Student student = mock(Student.class);
        Employer employer = mock(Employer.class);
        Follow follow = mock(Follow.class);
        when(employerRepository.findById(1L)).thenReturn(Optional.of(employer));
        when(followRepository.findByStudentAndEmployer(student,employer)).thenReturn(Optional.of(follow));
        followService.unfollowEmployer(student,1L);
        verify(followRepository).delete(follow);
    }
    // TC03: Kiểm tra sinh viên đang theo dõi doanh nghiệp
    @Test
    void isFollowing_success() {
        Student student = mock(Student.class);
        when(student.getId()).thenReturn(1L);
        when(followRepository.existsByStudentIdAndEmployerId(1L,2L)).thenReturn(true);
        boolean result = followService.isFollowing(student,2L);
        assertTrue(result);
        verify(followRepository).existsByStudentIdAndEmployerId(1L,2L);
    }
    // TC04: Lấy danh sách doanh nghiệp sinh viên đang theo dõi
    @Test
    void getFollowers_success() {
        Student student = mock(Student.class);
        Follow follow = mock(Follow.class);
        FollowResponse followResponse = mock(FollowResponse.class);
        PageResponse<FollowResponse> expected = mock(PageResponse.class);
        Pageable pageable = PageRequest.of(0,10);
        when(student.getId()).thenReturn(1L);
        when(followRepository.findAllByStudentId(1L,pageable)).thenReturn(new PageImpl<>(List.of(follow)));
        when(followMapper.toResponse(follow)).thenReturn(followResponse);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<FollowResponse> result = followService.getFollowers(pageable,student);
        assertSame(expected,result);
        verify(followRepository).findAllByStudentId(1L,pageable);
    }
}
