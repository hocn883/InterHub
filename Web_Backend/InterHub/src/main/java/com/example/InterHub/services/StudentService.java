package com.example.InterHub.services;

import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.dto.response.StudentResponse;
import com.example.InterHub.entity.Student;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final UserMapper userMapper;
    private final PageMapper pageMapper;
    @Transactional(readOnly=true)
    public  PageResponse<StudentResponse> getAllStudents(Pageable pageable)
    {
        Page<Student>pageStudent=studentRepository.findAll(pageable);
        Page<StudentResponse>response=pageStudent.map(userMapper::toStudentResponse);
        return pageMapper.toPageResponse(response);
    }

}
