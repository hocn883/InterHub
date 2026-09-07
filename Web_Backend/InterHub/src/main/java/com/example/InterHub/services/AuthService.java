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
import com.example.InterHub.enums.StudentStatus;
import com.example.InterHub.exception.DuplicateResourceException;
import com.example.InterHub.exception.ForbiddenException;
import com.example.InterHub.exception.ResourceNotFoundException;
import com.example.InterHub.exception.UnauthorizedException;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.LecturerRepository;
import com.example.InterHub.repository.StudentRepository;
import com.example.InterHub.repository.UserRepository;
import com.example.InterHub.security.CustomUserDetailsService;
import com.example.InterHub.security.JwtService;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import com.example.InterHub.services.cloudinary.FileUpload;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final LecturerRepository lecturerRepository;
    private final EmployerRepository employerRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CloudinaryService cloudinaryService;
    private final SystemLogService systemLogService;
    private final CustomUserDetailsService  customUserDetailsService;
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        checkRequest(request);
        User user = switch (request.getRole()) {
            case STUDENT -> createStudent(request);
            case LECTURER -> createLecturer(request);
            case EMPLOYER -> createEmployer(request);
            case ADMIN -> throw new ForbiddenException(
                    "Không thể đăng ký tài khoản ADMIN công khai"
            );
        };
        setUser(user, request);
        User savedUser = userRepository.save(user);
        systemLogService.saveLog(
                savedUser,
                Action.REGISTER.name(),
                "Đăng ký tài khoản"
        );
        String token = jwtService.generateToken(savedUser);
        return authResponse(savedUser, token);
    }
    public AuthResponse refreshToken(String refreshToken) {
        try {
            System.out.println("=== 1. BẮT ĐẦU REFRESH TOKEN ===");

            String username = jwtService.extractUsername(refreshToken);
            System.out.println("=== 2. EXTRACT USERNAME OK ===");
            System.out.println("username = " + username);

            UserDetails userDetails =
                    customUserDetailsService.loadUserByUsername(username);

            System.out.println("=== 3. LOAD USER DETAILS OK ===");

            boolean valid = jwtService.isRefreshTokenValid(
                    refreshToken,
                    userDetails
            );

            System.out.println("=== 4. CHECK REFRESH TOKEN ===");
            System.out.println("valid = " + valid);

            if (!valid) {
                System.out.println("=== 5. REFRESH TOKEN INVALID ===");

                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED
                );
            }

            User user = userRepository
                    .findByUsername(username)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "Không tìm thấy người dùng"
                            )
                    );

            System.out.println("=== 6. FIND USER OK ===");
            System.out.println("userId = " + user.getId());

            String newAccessToken =
                    jwtService.generateToken(user);

            System.out.println("=== 7. GENERATE ACCESS TOKEN OK ===");

            AuthResponse response = authResponse(
                    user,
                    newAccessToken
            );

            System.out.println("=== 8. REFRESH TOKEN SUCCESS ===");

            return response;

        } catch (ExpiredJwtException e) {
            System.out.println("=== ERROR: REFRESH TOKEN EXPIRED ===");
            e.printStackTrace();

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED
            );
        } catch (Exception e) {
            System.out.println("=== ERROR REFRESH TOKEN ===");
            System.out.println(e.getClass().getName());
            System.out.println(e.getMessage());
            e.printStackTrace();

            throw e;
        }
    }
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new UnauthorizedException(
                    "Tên đăng nhập hoặc mật khẩu không chính xác"
            );
        }
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy tài khoản"
                        )
                );
        systemLogService.saveLog(
                user,
                Action.LOGIN.name(),
                "Đăng nhập hệ thống"
        );
        String token=jwtService.generateToken(user);
        return authResponse(user, token);
    }
    private void checkRequest(RegisterRequest request) {
        if (userRepository.existsByUsername(
                request.getUsername()
        )) {
            throw new DuplicateResourceException(
                    "Tên đăng nhập đã được sử dụng"
            );
        }
        if (userRepository.existsByEmail(
                request.getEmail()
        )) {
            throw new DuplicateResourceException(
                    "Email đã được sử dụng"
            );
        }
        if (userRepository.existsByPhone(
                request.getPhone()
        )) {
            throw new DuplicateResourceException(
                    "Số điện thoại đã được sử dụng"
            );
        }
    }
    private Student createStudent(
            RegisterRequest request
    ) {
        if (studentRepository.existsByMssv(
                request.getMssv()
        )) {
            throw new DuplicateResourceException(
                    "Mã số sinh viên đã được sử dụng"
            );
        }
        Student student = new Student();
        student.setMssv(request.getMssv());
        student.setMajor(request.getMajor());
        student.setClassName(request.getClassName());
        student.setStatus(StudentStatus.TIM_VIEC);
        return student;
    }
    private Lecturer createLecturer(
            RegisterRequest request
    ) {
        if (lecturerRepository.existsByLecturerCode(
                request.getLecturerCode()
        )) {
            throw new DuplicateResourceException(
                    "Mã giảng viên đã được sử dụng"
            );
        }
        Lecturer lecturer = new Lecturer();
        lecturer.setLecturerCode(
                request.getLecturerCode()
        );
        return lecturer;
    }
    private Employer createEmployer(
            RegisterRequest request
    ) {
        if (employerRepository.existsByTaxCode(request.getTaxCode()
        )) {
            throw new DuplicateResourceException(
                    "Mã số thuế đã được sử dụng"
            );
        }
        Employer employer = new Employer();
        employer.setCompanyName(request.getCompanyName());
        employer.setLocation(request.getLocation());
        employer.setTaxCode(request.getTaxCode());
        return employer;
    }
    private void setUser(User user, RegisterRequest request
    ) {
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setRole(request.getRole());
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            FileUpload file = cloudinaryService.uploadAvatar(request.getAvatar());
            user.setAvatarUrl(file.getUrl());
        }
    }
    public UserResponse getUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Không tìm thấy người dùng"
                ));
        return userMapper.toResponse(user);
    }
    private AuthResponse authResponse(
            User user,
            String token
    ) {
        return new AuthResponse(token, "Bearer",
                userMapper.toResponse(user)
        );
    }
}