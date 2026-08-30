package com.example.InterHub.services;

import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    public UserResponse getCurrentUser( String username )
    {   User currentUser=userRepository.findByUsername(username).orElseThrow();
        return userMapper.toResponse(currentUser);
    }

}
