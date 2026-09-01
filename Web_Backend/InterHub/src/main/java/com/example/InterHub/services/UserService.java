package com.example.InterHub.services;

import com.cloudinary.Cloudinary;
import com.example.InterHub.dto.request.UpdateProfileRequest;
import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.exception.DuplicateResourceException;
import com.example.InterHub.exception.ForbiddenException;
import com.example.InterHub.exception.ResourceNotFoundException;
import com.example.InterHub.exception.UnauthorizedException;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.LecturerRepository;
import com.example.InterHub.repository.StudentRepository;
import com.example.InterHub.repository.UserRepository;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final CloudinaryService cloudinaryService;
    private final StudentRepository studentRepository;
    private final LecturerRepository lecturerRepository;
    private final EmployerRepository employerRepository;

    @Transactional(readOnly=true)
    public UserResponse getCurrentUser( String username )
    {
        User currentUser=userRepository.findByUsername(username).orElseThrow();
        return userMapper.toResponse(currentUser);
    }
    @Transactional
    public UserResponse updateProfile(User user ,UpdateProfileRequest request) {
        if (request.getEmail() != null &&
                !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            userRepository.findByEmail(request.getEmail())
                    .ifPresent(existingUser -> {
                        if (!existingUser.getId().equals(user.getId())) {
                            throw new DuplicateResourceException("Email đã được sử dụng");
                        }
                    });
        }
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            String avatarUrl = cloudinaryService.uploadAvatar(request.getAvatar()).getUrl();
            user.setAvatarUrl(avatarUrl);
        }
        switch (user.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findById(user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
                student.setMajor(request.getMajor());
                student.setClassName(request.getClassName());
                studentRepository.save(student);
            }
            case LECTURER -> {
                lecturerRepository.findById(user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giảng viên"));
            }
            case EMPLOYER -> {
                Employer employer = employerRepository.findById(user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà tuyển dụng"));
                employer.setCompanyName(request.getCompanyName());
                employer.setLocation(request.getLocation());
                employerRepository.save(employer);
            }
        }
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

}
