package com.example.InterHub.services;
import com.example.InterHub.dto.request.CvUpLoadRequest;
import com.example.InterHub.dto.request.FeedbackRequest;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.CvUpload;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.enums.Action;
import com.example.InterHub.enums.CVStatus;
import com.example.InterHub.mapper.CvMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.CvRepository;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import com.example.InterHub.services.cloudinary.FileUpload;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class CvServiceTest {
    @Mock
    private CvRepository cvRepository;
    @Mock
    private CloudinaryService cloudinaryService;
    @Mock
    private CvMapper cvMapper;
    @Mock
    private PageMapper pageMapper;
    @Mock
    private SystemLogService systemLogService;
    @InjectMocks
    private CvService cvService;
    // TC01: Giảng viên lấy danh sách CV
    @Test
    void getCv_success() {
        Lecturer lecturer = mock(Lecturer.class);
        CvUpload cv = mock(CvUpload.class);
        CvUploadResponse response = mock(CvUploadResponse.class);
        when(lecturer.getId()).thenReturn(1L);
        when(cvRepository.findByLecturerIdOrderByCreatedDateDesc(1L)).thenReturn(List.of(cv));
        when(cvMapper.toResponse(cv)).thenReturn(response);
        List<CvUploadResponse> result = cvService.getCv(lecturer);
        assertEquals(1,result.size());
        assertSame(response,result.get(0));
        verify(cvRepository).findByLecturerIdOrderByCreatedDateDesc(1L);
    }
    // TC02: Sinh viên tải CV lên thành công
    @Test
    void uploadCv_success() {
        Student student = mock(Student.class);
        Lecturer lecturer = mock(Lecturer.class);
        CvUpLoadRequest request = mock(CvUpLoadRequest.class);
        MultipartFile file = mock(MultipartFile.class);
        FileUpload fileUpload = mock(FileUpload.class);
        CvUploadResponse expected = mock(CvUploadResponse.class);
        when(request.getFileCv()).thenReturn(file);
        when(file.isEmpty()).thenReturn(false);
        when(student.getLecturer()).thenReturn(lecturer);
        when(cloudinaryService.uploadCv(file)).thenReturn(fileUpload);
        when(fileUpload.getUrl()).thenReturn("cv.pdf");
        when(cvRepository.save(any(CvUpload.class))).thenAnswer(i -> i.getArgument(0));
        when(cvMapper.toResponse(any(CvUpload.class))).thenReturn(expected);
        CvUploadResponse result = cvService.uploadCv(request,student);
        assertSame(expected,result);
        verify(cloudinaryService).uploadCv(file);
        verify(cvRepository).save(any(CvUpload.class));
        verify(systemLogService).saveLog(eq(student),eq(Action.UPLOAD_CV.name()),anyString());
    }
    // TC03: Lấy tất cả CV
    @Test
    void getAllCvs_success() {
        Pageable pageable = PageRequest.of(0,10);
        CvUpload cv = mock(CvUpload.class);
        CvUploadResponse response = mock(CvUploadResponse.class);
        PageResponse<CvUploadResponse> expected = mock(PageResponse.class);
        when(cvRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(cv)));
        when(cvMapper.toResponse(cv)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<CvUploadResponse> result = cvService.getAllCvs(pageable);
        assertSame(expected,result);
        verify(cvRepository).findAll(pageable);
    }
    // TC04: Sinh viên xem CV của mình
    @Test
    void getMyCvById_student_success() {
        Student student = mock(Student.class);
        CvUpload cv = mock(CvUpload.class);
        CvUploadResponse expected = mock(CvUploadResponse.class);
        when(student.getId()).thenReturn(1L);
        when(cvRepository.findByIdAndStudentId(10L,1L)).thenReturn(Optional.of(cv));
        when(cvMapper.toResponse(cv)).thenReturn(expected);
        CvUploadResponse result = cvService.getMyCvById(10L,student);
        assertSame(expected,result);
        verify(cvRepository).findByIdAndStudentId(10L,1L);
    }
    // TC05: Giảng viên xem CV được phân công
    @Test
    void getMyCvById_lecturer_success() {
        Lecturer lecturer = mock(Lecturer.class);
        CvUpload cv = mock(CvUpload.class);
        CvUploadResponse expected = mock(CvUploadResponse.class);
        when(lecturer.getId()).thenReturn(1L);
        when(cvRepository.findByIdAndLecturerId(10L,1L)).thenReturn(Optional.of(cv));
        when(cvMapper.toResponse(cv)).thenReturn(expected);
        CvUploadResponse result = cvService.getMyCvById(10L,lecturer);
        assertSame(expected,result);
        verify(cvRepository).findByIdAndLecturerId(10L,1L);
    }
    // TC06: Sinh viên xóa CV đang chờ duyệt
    @Test
    void deletePendingCv_success() {
        Student student = mock(Student.class);
        CvUpload cv = mock(CvUpload.class);
        when(student.getId()).thenReturn(1L);
        when(cv.getStatus()).thenReturn(CVStatus.PENDING);
        when(cvRepository.findByIdAndStudentId(10L,1L)).thenReturn(Optional.of(cv));
        cvService.deletePendingCv(10L,student);
        verify(cvRepository).delete(cv);
    }
    // TC07: Giảng viên duyệt CV thành công
    @Test
    void approveCv_success() {
        Lecturer lecturer = mock(Lecturer.class);
        CvUpload cv = mock(CvUpload.class);
        CvUploadResponse expected = mock(CvUploadResponse.class);
        when(lecturer.getId()).thenReturn(1L);
        when(cv.getId()).thenReturn(10L);
        when(cv.getStatus()).thenReturn(CVStatus.PENDING);
        when(cvRepository.findByIdAndLecturerId(10L,1L)).thenReturn(Optional.of(cv));
        when(cvRepository.save(cv)).thenReturn(cv);
        when(cvMapper.toResponse(cv)).thenReturn(expected);
        CvUploadResponse result = cvService.approveCv(10L,lecturer);
        assertSame(expected,result);
        verify(cv).setStatus(CVStatus.APPROVED);
        verify(cvRepository).save(cv);
        verify(systemLogService).saveLog(lecturer,Action.APPROVE_CV.name(),"Duyệt CV ID: 10");
    }
    // TC08: Giảng viên từ chối CV thành công
    @Test
    void rejectedCv_success() {
        Lecturer lecturer = mock(Lecturer.class);
        CvUpload cv = mock(CvUpload.class);
        FeedbackRequest request = mock(FeedbackRequest.class);
        CvUploadResponse expected = mock(CvUploadResponse.class);
        when(lecturer.getId()).thenReturn(1L);
        when(cv.getId()).thenReturn(10L);
        when(cv.getStatus()).thenReturn(CVStatus.PENDING);
        when(request.getFeedback()).thenReturn("CV cần bổ sung kinh nghiệm");
        when(cvRepository.findByIdAndLecturerId(10L,1L)).thenReturn(Optional.of(cv));
        when(cvRepository.save(cv)).thenReturn(cv);
        when(cvMapper.toResponse(cv)).thenReturn(expected);
        CvUploadResponse result = cvService.rejectedCv(10L,request,lecturer);
        assertSame(expected,result);
        verify(cv).setStatus(CVStatus.REJECTED);
        verify(cv).setLecturerFeedback("CV cần bổ sung kinh nghiệm");
        verify(cvRepository).save(cv);
        verify(systemLogService).saveLog(lecturer,Action.REJECT_CV.name(),"Từ chối CV ID: 10");
    }
    // TC09: Lấy danh sách CV theo trạng thái
    @Test
    void getCvs_success() {
        Pageable pageable = PageRequest.of(0,10);
        CvUpload cv = mock(CvUpload.class);
        CvUploadResponse response = mock(CvUploadResponse.class);
        PageResponse<CvUploadResponse> expected = mock(PageResponse.class);
        when(cvRepository.findByStatus(CVStatus.PENDING,pageable)).thenReturn(new PageImpl<>(List.of(cv)));
        when(cvMapper.toResponse(cv)).thenReturn(response);
        doReturn(expected).when(pageMapper).toPageResponse(any(Page.class));
        PageResponse<CvUploadResponse> result = cvService.getCvs(CVStatus.PENDING,pageable);
        assertSame(expected,result);
        verify(cvRepository).findByStatus(CVStatus.PENDING,pageable);
    }
}