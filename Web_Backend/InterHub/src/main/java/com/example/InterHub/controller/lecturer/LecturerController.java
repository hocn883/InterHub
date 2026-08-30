package com.example.InterHub.controller.lecturer;

import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.StudentResponse;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.LecturerRepository;
import com.example.InterHub.repository.StudentRepository;
import com.example.InterHub.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/lecturer/students")
@RequiredArgsConstructor
public class LecturerController {
    private final StudentRepository studentRepository;
    private final UserMapper userMapper;
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getStudents(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        List<Student> students = studentRepository.findAllByLecturerId(currentUser.getUser().getId());
        return ResponseEntity.ok(
                ApiResponse.<List<StudentResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Danh sách sinh viên:")
                        .result(students.stream()
                                .map(userMapper::toStudentResponse)
                                .toList())
                        .build()
        );
    }

}
