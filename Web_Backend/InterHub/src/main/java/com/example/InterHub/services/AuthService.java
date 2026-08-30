package com.example.InterHub.services;

import com.example.InterHub.dto.request.LoginRequest;
import com.example.InterHub.dto.request.RegisterRequest;
import com.example.InterHub.dto.response.AuthResponse;
import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.services.cloudinary.FileUpload;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.StudentStatus;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.LecturerRepository;
import com.example.InterHub.repository.StudentRepository;
import com.example.InterHub.repository.UserRepository;
import com.example.InterHub.security.JwtService;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        checkRequest(request);
        User user = switch (request.getRole()) {

            case STUDENT -> createStudent(request);

            case LECTURER -> createLecturer(request);

            case EMPLOYER -> createEmployer(request);

            case ADMIN -> throw new IllegalArgumentException(
                    "Không thể đăng ký tài khoản ADMIN công khai"
            );
        };
        setUser(user, request);
        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);
        return authResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy tài khoản"
                        )
                );

        String token = jwtService.generateToken(user);

        return authResponse(user, token);
    }

    private void checkRequest(
            RegisterRequest request
    ) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "Username đã được sử dụng"
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email đã được sử dụng"
            );
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException(
                    "Số điện thoại đã được sử dụng"
            );
        }
    }

    private Student createStudent(RegisterRequest request) {

        if (request.getMssv() == null
                || request.getMssv().isBlank()) {
            throw new IllegalArgumentException(
                    "Vui Lòng Điền MSSV!"
            );
        }

        if (request.getMajor() == null
                || request.getMajor().isBlank()) {
            throw new IllegalArgumentException(
                    "Vui Lòng Điền chuyên ngành!"
            );
        }

        if (request.getClassName() == null
                || request.getClassName().isBlank()) {
            throw new IllegalArgumentException(
                    "Vui Lòng Điền lớp sinh viên."
            );
        }

        if (studentRepository.existsByMssv(request.getMssv())) {
            throw new IllegalArgumentException(
                    "Vui lòng điền mã số sinh viên."
            );
        }
        Student student = new Student();
        student.setMssv(request.getMssv());
        student.setMajor(request.getMajor());
        student.setClassName(request.getClassName());
        student.setStatus(StudentStatus.TIM_VIEC);
        return student;
    }

    private Lecturer createLecturer(RegisterRequest request) {

        if (request.getLecturerCode() == null
                || request.getLecturerCode().isBlank()) {
            throw new IllegalArgumentException(
                    "Vui Lòng điền mã giảng viên"
            );
        }

        if (lecturerRepository.existsByLecturerCode(
                request.getLecturerCode()
        )) {
            throw new IllegalArgumentException(
                    "Mã giảng viên đã tồn tại."
            );
        }

        Lecturer lecturer = new Lecturer();

        lecturer.setLecturerCode(request.getLecturerCode());

        return lecturer;
    }

    private Employer createEmployer(RegisterRequest request) {

        if (request.getCompanyName() == null
                || request.getCompanyName().isBlank()) {
            throw new IllegalArgumentException(
                    "Vui Lòng điền tên công ty."
            );
        }

        if (request.getTaxCode() == null
                || request.getTaxCode().isBlank()) {
            throw new IllegalArgumentException(
                    "Vui lòng điền mã số thuế."
            );
        }

        if (employerRepository.existsByTaxCode(
                request.getTaxCode()
        )) {
            throw new IllegalArgumentException(
                    "Mã số thuế đã được sử dụng"
            );
        }
        Employer employer = new Employer();
        employer.setCompanyName(request.getCompanyName());
        employer.setTaxCode(request.getTaxCode());
        return employer;
    }
    private void setUser(
            User user,
            RegisterRequest request
    ) {
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setRole(request.getRole());
        if (request.getAvatar() != null
                && !request.getAvatar().isEmpty()) {

            FileUpload file =
                    cloudinaryService.uploadAvatar(
                            request.getAvatar()
                    );

            user.setAvatarUrl(file.getUrl());
        }
    }
    public UserResponse getUser(String username)
    {
        User user= userRepository.findByUsername(username).orElseThrow();
        return userMapper.toResponse(user);
    }
    private AuthResponse authResponse(
            User user,
            String token
    ) {
        return new AuthResponse(
                token,
                "Bearer",
                userMapper.toResponse(user)
        );
    }
}