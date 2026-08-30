package com.example.InterHub.services;

import com.example.InterHub.dto.request.CvUpLoadRequest;
import com.example.InterHub.dto.request.FeedbackRequest;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.dto.response.JobResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.CvUpload;
import com.example.InterHub.entity.Job;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.CVStatus;
import com.example.InterHub.mapper.CvMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.repository.CvRepository;
import com.example.InterHub.services.cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.apache.logging.log4j.util.Strings.isBlank;

@Service
@RequiredArgsConstructor

public class CvService {
    private final CvRepository cvRepository;
    private final CloudinaryService cloudinaryService;
    private final CvMapper cvMapper;
    private final PageMapper pageMapper;
    @Transactional(readOnly = true)
    public List<CvUploadResponse> getCv(User currentUser)
    {List<CvUpload>cvUploads= cvUploads=cvRepository.findByLecturerIdOrderByCreatedDateDesc(currentUser.getId());
        return cvUploads.stream().map(cvMapper::toResponse).toList();
    }
    @Transactional
    public CvUploadResponse uploadCv(CvUpLoadRequest request, User currentUser)
    {
        Student student=(Student)currentUser;
        String fileUrl=cloudinaryService.uploadCv(request.getFileCv()).getUrl();
        CvUpload cvUpload=CvUpload.builder()
                .fileUrl(fileUrl)
                .student(student)
                .lecturer(student.getLecturer()).build();
        CvUpload saveCv=cvRepository.save(cvUpload);
        return cvMapper.toResponse(saveCv);
    }
    @Transactional(readOnly=true)
    public PageResponse<CvUploadResponse> getAllCvs(Pageable pageable) {
        Page<CvUpload> cvPage = cvRepository.findAll(pageable);
        Page<CvUploadResponse>page=cvPage.map(cvMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
    @Transactional(readOnly=true)
    public CvUploadResponse getMyCvById(Long cvId, User currentUser)
    {   if(currentUser instanceof Student)
            return cvMapper.toResponse(cvRepository.findByIdAndStudentId(cvId, currentUser.getId()).orElseThrow());
        return cvMapper.toResponse(cvRepository.findByIdAndLecturerId(cvId,currentUser.getId()).orElseThrow() );
    }

    @Transactional
    public void deletePendingCv(Long cvId, User currentUser) {
        Student student= (Student)currentUser;
        CvUpload cvUpload = cvRepository
                .findByIdAndStudentId(cvId, student.getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy CV"
                ));

        if (cvUpload.getStatus() != CVStatus.PENDING) {
            throw new IllegalStateException(
                    "Chỉ được xóa CV đang chờ duyệt"
            );
        }
        cvRepository.delete(cvUpload);
    }
    @Transactional
    public CvUploadResponse approveCv(Long cvId, User currentUser)
    {
        CvUpload cvUpload=cvRepository.findByIdAndLecturerId(cvId, currentUser.getId()).orElseThrow();
        cvUpload.setStatus(CVStatus.APPROVED);
        cvRepository.save(cvUpload);
        return cvMapper.toResponse(cvUpload);
    }
    @Transactional
    public CvUploadResponse rejectedCv(Long cvId, FeedbackRequest request, User currentUser)
    {
        CvUpload cvUpload=cvRepository.findByIdAndLecturerId(cvId, currentUser.getId()).orElseThrow();
        cvUpload.setStatus(CVStatus.REJECTED);
        cvUpload.setLecturerFeedback(request.getFeedback());
        return cvMapper.toResponse(cvUpload);
    }
    @Transactional(readOnly = true)
    public PageResponse<CvUploadResponse> getCvs(CVStatus status,Pageable pageable) {
        Page<CvUpload>pageCv=cvRepository.findByStatus(status, pageable);
        Page<CvUploadResponse>page=pageCv.map(cvMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
}
