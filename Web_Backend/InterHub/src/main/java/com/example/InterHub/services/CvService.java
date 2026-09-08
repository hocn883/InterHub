package com.example.InterHub.services;
import com.example.InterHub.dto.request.CvUpLoadRequest;
import com.example.InterHub.dto.request.FeedbackRequest;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.CvUpload;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.Action;
import com.example.InterHub.enums.CVStatus;
import com.example.InterHub.exception.BadRequestException;
import com.example.InterHub.exception.ConflictException;
import com.example.InterHub.exception.ForbiddenException;
import com.example.InterHub.exception.ResourceNotFoundException;
import com.example.InterHub.mapper.CvMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.CvRepository;
import com.example.InterHub.services.SystemLogService;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CvService {

    private final CvRepository cvRepository;
    private final CloudinaryService cloudinaryService;
    private final CvMapper cvMapper;
    private final PageMapper pageMapper;
    private final SystemLogService systemLogService;

    @Transactional(readOnly = true)
    public List<CvUploadResponse> getCv(User currentUser) {
        Lecturer lecturer = (Lecturer) currentUser;
        List<CvUpload> cvUploads = cvRepository.findByLecturerIdOrderByCreatedDateDesc(lecturer.getId());
        return cvUploads.stream().map(cvMapper::toResponse).toList();
    }

    @Transactional
    public CvUploadResponse uploadCv(CvUpLoadRequest request, User currentUser) {
        Student student = (Student) currentUser;
        if (request.getFileCv() == null || request.getFileCv().isEmpty()) {
            throw new BadRequestException(
                    "Vui lòng chọn file CV");
        }
        if (student.getLecturer() == null) {
            throw new ConflictException(
                    "Sinh viên chưa được phân công giảng viên"
            );
        }
        String fileUrl = cloudinaryService.uploadCv(request.getFileCv()).getUrl();
        CvUpload cvUpload = CvUpload.builder()
                .fileUrl(fileUrl)
                .student(student)
                .lecturer(student.getLecturer())
                .build();
        CvUpload savedCv = cvRepository.save(cvUpload);
        systemLogService.saveLog(
                currentUser,
                Action.UPLOAD_CV.name(),
                "Tải lên CV . "
        );
        return cvMapper.toResponse(savedCv);
    }

    @Transactional(readOnly = true)
    public PageResponse<CvUploadResponse> getAllCvs(Pageable pageable) {
        Page<CvUpload> cvPage = cvRepository.findAll(pageable);
        Page<CvUploadResponse> page = cvPage.map(cvMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }

    @Transactional(readOnly = true)
    public CvUploadResponse getMyCvById(Long cvId, User currentUser) {
        CvUpload cvUpload;
        if (currentUser instanceof Student) {
            cvUpload = cvRepository.findByIdAndStudentId(cvId, currentUser.getId()).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Không tìm thấy CV"));
        } else if (currentUser instanceof Lecturer) {
            cvUpload = cvRepository.findByIdAndLecturerId(cvId, currentUser.getId()).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Không tìm thấy CV hoặc bạn không có quyền xem CV này"
                    ));
        } else {
            throw new ForbiddenException(
                    "Bạn không có quyền xem CV này"
            );
        }
        return cvMapper.toResponse(cvUpload);
    }

    @Transactional
    public void deletePendingCv(Long cvId, User currentUser) {
        Student student = (Student) currentUser;
        CvUpload cvUpload = cvRepository.findByIdAndStudentId(cvId, student.getId()).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Không tìm thấy CV"
                ));
        if (cvUpload.getStatus() != CVStatus.PENDING) {
            throw new ConflictException(
                    "Chỉ được xóa CV đang chờ duyệt"
            );
        }
        cvRepository.delete(cvUpload);
    }

    @Transactional
    public CvUploadResponse approveCv(Long cvId, User currentUser) {
        Lecturer lecturer = (Lecturer) currentUser;
        CvUpload cvUpload = cvRepository.findByIdAndLecturerId(cvId, lecturer.getId()).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Không tìm thấy CV hoặc bạn không có quyền duyệt CV này"));
        if (cvUpload.getStatus() != CVStatus.PENDING) {
            throw new ConflictException(
                    "Chỉ được duyệt CV đang chờ xử lý"
            );
        }
        cvUpload.setStatus(CVStatus.APPROVED);
        CvUpload savedCv = cvRepository.save(cvUpload);
        systemLogService.saveLog(
                currentUser,
                Action.APPROVE_CV.name(),
                "Duyệt CV của : " + savedCv.getStudent().getFullName()
        );
        return cvMapper.toResponse(savedCv);
    }

    @Transactional
    public CvUploadResponse rejectedCv(Long cvId, FeedbackRequest request, User currentUser) {
        Lecturer lecturer = (Lecturer) currentUser;
        CvUpload cvUpload = cvRepository.findByIdAndLecturerId(cvId, lecturer.getId()).orElseThrow(() ->
                new ResourceNotFoundException("Không tìm thấy CV hoặc bạn không có quyền xử lý CV này"));
        if (cvUpload.getStatus() != CVStatus.PENDING) {
            throw new ConflictException(
                    "Chỉ được từ chối CV đang chờ xử lý"
            );
        }
        if (request.getFeedback() == null || request.getFeedback().isBlank()) {
            throw new BadRequestException(
                    "Vui lòng nhập lý do từ chối CV"
            );
        }
        cvUpload.setStatus(CVStatus.REJECTED);
        cvUpload.setLecturerFeedback(request.getFeedback());
        CvUpload savedCv = cvRepository.save(cvUpload);
        systemLogService.saveLog(
                currentUser,
                Action.REJECT_CV.name(),
                "Từ chối CV của : "+ savedCv.getStudent().getFullName()
        );
        return cvMapper.toResponse(savedCv);
    }

    @Transactional(readOnly = true)
    public PageResponse<CvUploadResponse> getCvs(CVStatus status, Pageable pageable) {
        if (status == null) {
            throw new BadRequestException(
                    "Trạng thái CV không được để trống");
        }
        Page<CvUpload> cvPage = cvRepository.findByStatus(status, pageable);
        Page<CvUploadResponse> page = cvPage.map(cvMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional
    public PageResponse<CvUploadResponse>getCvByStudent(User currentUser,Pageable  pageable)
    {
        Student student = (Student) currentUser;
        Page<CvUpload> cvUploads = cvRepository.findByStudentIdOrderByCreatedDateDesc(student.getId(),pageable);
        Page<CvUploadResponse>pageResponse=cvUploads.map(cvMapper::toResponse);
        return pageMapper.toPageResponse(pageResponse);
    }
}
