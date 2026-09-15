package com.example.InterHub.services;
import com.example.InterHub.dto.request.UpdateProfileRequest;
import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.UserRole;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.LecturerRepository;
import com.example.InterHub.repository.StudentRepository;
import com.example.InterHub.repository.UserRepository;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import com.example.InterHub.services.cloudinary.FileUpload;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserMapper userMapper;
    @Mock
    private CloudinaryService cloudinaryService;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private LecturerRepository lecturerRepository;
    @Mock
    private EmployerRepository employerRepository;
    @InjectMocks
    private UserService userService;
    // TC01: Lấy thông tin người dùng hiện tại
    @Test
    void getCurrentUser_success() {
        User user = mock(User.class);
        UserResponse expected = mock(UserResponse.class);
        when(userRepository.findByUsername("student01")).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(expected);
        UserResponse result = userService.getCurrentUser("student01");
        assertSame(expected,result);
        verify(userRepository).findByUsername("student01");
        verify(userMapper).toResponse(user);
    }
    // TC02: Cập nhật thông tin sinh viên
    @Test
    void updateProfile_student_success() {
        Student user = mock(Student.class);
        Student student = mock(Student.class);
        UpdateProfileRequest request = mock(UpdateProfileRequest.class);
        MultipartFile avatar = mock(MultipartFile.class);
        FileUpload fileUpload = mock(FileUpload.class);
        UserResponse expected = mock(UserResponse.class);
        when(user.getId()).thenReturn(1L);
        when(user.getRole()).thenReturn(UserRole.STUDENT);
        when(user.getEmail()).thenReturn("old@gmail.com");
        when(request.getEmail()).thenReturn("new@gmail.com");
        when(request.getFullName()).thenReturn("Nguyen Van A");
        when(request.getMajor()).thenReturn("CNTT");
        when(request.getClassName()).thenReturn("DH23IT01");
        when(request.getAvatar()).thenReturn(avatar);
        when(avatar.isEmpty()).thenReturn(false);
        when(userRepository.findByEmail("new@gmail.com")).thenReturn(Optional.empty());
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(cloudinaryService.uploadAvatar(avatar)).thenReturn(fileUpload);
        when(fileUpload.getUrl()).thenReturn("avatar.jpg");
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(expected);
        UserResponse result = userService.updateProfile(user,request);
        assertSame(expected,result);
        verify(user).setFullName("Nguyen Van A");
        verify(user).setEmail("new@gmail.com");
        verify(user).setAvatarUrl("avatar.jpg");
        verify(student).setMajor("CNTT");
        verify(student).setClassName("DH23IT01");
        verify(studentRepository).save(student);
        verify(userRepository).save(user);
    }
    // TC03: Cập nhật thông tin giảng viên
    @Test
    void updateProfile_lecturer_success() {
        Lecturer user = mock(Lecturer.class);
        UpdateProfileRequest request = mock(UpdateProfileRequest.class);
        UserResponse expected = mock(UserResponse.class);
        when(user.getId()).thenReturn(1L);
        when(user.getRole()).thenReturn(UserRole.LECTURER);
        when(user.getEmail()).thenReturn("lecturer@gmail.com");
        when(request.getEmail()).thenReturn("lecturer@gmail.com");
        when(request.getFullName()).thenReturn("Nguyen Van B");
        when(lecturerRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(expected);
        UserResponse result = userService.updateProfile(user,request);
        assertSame(expected,result);
        verify(lecturerRepository).findById(1L);
        verify(user).setFullName("Nguyen Van B");
        verify(userRepository).save(user);
    }
    // TC04: Cập nhật thông tin doanh nghiệp
    @Test
    void updateProfile_employer_success() {
        Employer user = mock(Employer.class);
        Employer employer = mock(Employer.class);
        UpdateProfileRequest request = mock(UpdateProfileRequest.class);
        UserResponse expected = mock(UserResponse.class);
        when(user.getId()).thenReturn(1L);
        when(user.getRole()).thenReturn(UserRole.EMPLOYER);
        when(user.getEmail()).thenReturn("company@gmail.com");
        when(request.getEmail()).thenReturn("company@gmail.com");
        when(request.getFullName()).thenReturn("ABC Company");
        when(request.getCompanyName()).thenReturn("ABC Technology");
        when(request.getLocation()).thenReturn("TP.HCM");
        when(employerRepository.findById(1L)).thenReturn(Optional.of(employer));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(expected);
        UserResponse result = userService.updateProfile(user,request);
        assertSame(expected,result);
        verify(employer).setCompanyName("ABC Technology");
        verify(employer).setLocation("TP.HCM");
        verify(employerRepository).save(employer);
        verify(userRepository).save(user);
    }
}
