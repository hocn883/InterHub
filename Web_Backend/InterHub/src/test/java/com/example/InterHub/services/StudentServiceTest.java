package com.example.InterHub.services;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.dto.response.StudentResponse;
import com.example.InterHub.entity.Student;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.StudentRepository;
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
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class StudentServiceTest {
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PageMapper pageMapper;
    @InjectMocks
    private StudentService studentService;
    // TC01: Lấy tất cả sinh viên thành công
    @Test
    void getAllStudents_success() {
        Pageable pageable = PageRequest.of(0,10);
        Student student = mock(Student.class);
        StudentResponse studentResponse = mock(StudentResponse.class);
        PageResponse<StudentResponse> expected = mock(PageResponse.class);
        when(studentRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(student)));
        when(userMapper.toStudentResponse(student)).thenReturn(studentResponse);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<StudentResponse> result = studentService.getAllStudents(pageable);
        assertSame(expected,result);
        verify(studentRepository).findAll(pageable);
        verify(userMapper).toStudentResponse(student);
    }
}