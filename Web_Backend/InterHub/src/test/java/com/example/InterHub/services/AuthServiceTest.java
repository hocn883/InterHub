package com.example.InterHub.services;
import com.example.InterHub.dto.request.LoginRequest;
import com.example.InterHub.dto.request.RegisterRequest;
import com.example.InterHub.dto.response.AuthResponse;
import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.Action;
import com.example.InterHub.enums.UserRole;
import com.example.InterHub.enums.StudentStatus;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.LecturerRepository;
import com.example.InterHub.repository.StudentRepository;
import com.example.InterHub.repository.UserRepository;
import com.example.InterHub.security.JwtService;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import com.example.InterHub.services.cloudinary.FileUpload;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private LecturerRepository lecturerRepository;
    @Mock
    private EmployerRepository employerRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtService jwtService;
    @Mock
    private CloudinaryService cloudinaryService;
    @Mock
    private SystemLogService systemLogService;
    @InjectMocks
    private AuthService authService;
    // TC01: Đăng ký sinh viên thành công
    @Test
    void registerStudent_success() {
        RegisterRequest request = mock(RegisterRequest.class);
        UserResponse userResponse = mock(UserResponse.class);
        when(request.getRole()).thenReturn(UserRole.STUDENT);
        when(request.getUsername()).thenReturn("student01");
        when(request.getPassword()).thenReturn("123456");
        when(request.getEmail()).thenReturn("student@gmail.com");
        when(request.getPhone()).thenReturn("0900000001");
        when(request.getMssv()).thenReturn("SV001");
        when(request.getMajor()).thenReturn("CNTT");
        when(request.getClassName()).thenReturn("DH23IT01");
        when(userRepository.existsByUsername("student01")).thenReturn(false);
        when(userRepository.existsByEmail("student@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhone("0900000001")).thenReturn(false);
        when(studentRepository.existsByMssv("SV001")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        when(jwtService.generateToken(any(User.class))).thenReturn("token");
        when(userMapper.toResponse(any(User.class))).thenReturn(userResponse);
        AuthResponse result = authService.register(request);
        assertNotNull(result);
        verify(userRepository).save(argThat(user -> user instanceof Student && ((Student)user).getStatus() == StudentStatus.TIM_VIEC));
        verify(systemLogService).saveLog(any(User.class),eq(Action.REGISTER.name()),eq("Đăng ký tài khoản"));
    }
    // TC02: Đăng ký giảng viên thành công
    @Test
    void registerLecturer_success() {
        RegisterRequest request = mock(RegisterRequest.class);
        when(request.getRole()).thenReturn(UserRole.LECTURER);
        when(request.getUsername()).thenReturn("lecturer01");
        when(request.getPassword()).thenReturn("123456");
        when(request.getEmail()).thenReturn("lecturer@gmail.com");
        when(request.getPhone()).thenReturn("0900000002");
        when(request.getLecturerCode()).thenReturn("GV001");
        when(userRepository.existsByUsername("lecturer01")).thenReturn(false);
        when(userRepository.existsByEmail("lecturer@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhone("0900000002")).thenReturn(false);
        when(lecturerRepository.existsByLecturerCode("GV001")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        when(jwtService.generateToken(any(User.class))).thenReturn("token");
        AuthResponse result = authService.register(request);
        assertNotNull(result);
        verify(userRepository).save(argThat(user -> user instanceof Lecturer && ((Lecturer)user).getLecturerCode().equals("GV001")));
        verify(systemLogService).saveLog(any(User.class),eq(Action.REGISTER.name()),eq("Đăng ký tài khoản"));
    }
    // TC03: Đăng ký doanh nghiệp có avatar thành công
    @Test
    void registerEmployer_success() {
        RegisterRequest request = mock(RegisterRequest.class);
        MultipartFile avatar = mock(MultipartFile.class);
        FileUpload fileUpload = mock(FileUpload.class);
        when(request.getRole()).thenReturn(UserRole.EMPLOYER);
        when(request.getUsername()).thenReturn("employer01");
        when(request.getPassword()).thenReturn("123456");
        when(request.getEmail()).thenReturn("company@gmail.com");
        when(request.getPhone()).thenReturn("0900000003");
        when(request.getTaxCode()).thenReturn("TAX001");
        when(request.getCompanyName()).thenReturn("ABC Company");
        when(request.getLocation()).thenReturn("TP.HCM");
        when(request.getAvatar()).thenReturn(avatar);
        when(avatar.isEmpty()).thenReturn(false);
        when(userRepository.existsByUsername("employer01")).thenReturn(false);
        when(userRepository.existsByEmail("company@gmail.com")).thenReturn(false);
        when(userRepository.existsByPhone("0900000003")).thenReturn(false);
        when(employerRepository.existsByTaxCode("TAX001")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encoded");
        when(cloudinaryService.uploadAvatar(avatar)).thenReturn(fileUpload);
        when(fileUpload.getUrl()).thenReturn("avatar.jpg");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        when(jwtService.generateToken(any(User.class))).thenReturn("token");
        AuthResponse result = authService.register(request);
        assertNotNull(result);
        verify(cloudinaryService).uploadAvatar(avatar);
        verify(userRepository).save(argThat(user -> user instanceof Employer && ((Employer)user).getTaxCode().equals("TAX001")));
        verify(systemLogService).saveLog(any(User.class),eq(Action.REGISTER.name()),eq("Đăng ký tài khoản"));
    }
    // TC04: Đăng nhập thành công
    @Test
    void login_success() {
        LoginRequest request = mock(LoginRequest.class);
        User user = mock(User.class);
        UserResponse userResponse = mock(UserResponse.class);
        when(request.getUsername()).thenReturn("student01");
        when(request.getPassword()).thenReturn("123456");
        when(userRepository.findByUsername("student01")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("token");
        when(userMapper.toResponse(user)).thenReturn(userResponse);
        AuthResponse result = authService.login(request);
        assertNotNull(result);
        verify(authenticationManager).authenticate(any());
        verify(systemLogService).saveLog(user,Action.LOGIN.name(),"Đăng nhập hệ thống");
        verify(jwtService).generateToken(user);
    }
    // TC05: Lấy thông tin người dùng thành công
    @Test
    void getUser_success() {
        User user = mock(User.class);
        UserResponse expected = mock(UserResponse.class);
        when(userRepository.findByUsername("student01")).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(expected);
        UserResponse result = authService.getUser("student01");
        assertSame(expected,result);
        verify(userRepository).findByUsername("student01");
        verify(userMapper).toResponse(user);
    }
}
