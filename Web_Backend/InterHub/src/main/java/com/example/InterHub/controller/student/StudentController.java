package com.example.InterHub.controller.student;

import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.dto.response.StudentResponse;
import com.example.InterHub.services.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/students")
@RequiredArgsConstructor
public class StudentController {
   private final  StudentService studentService;
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<StudentResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdDate")
        );
        PageResponse<StudentResponse>pageResponse=studentService.getAllStudents(pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<StudentResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Danh sach student")
                        .result(pageResponse)
                        .build()
        );
    }
}
