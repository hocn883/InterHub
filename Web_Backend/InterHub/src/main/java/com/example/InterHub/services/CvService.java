package com.example.InterHub.services;

import com.example.InterHub.dto.request.CvUpLoadRequest;
import com.example.InterHub.dto.request.FeedbackRequest;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.entity.CvUpload;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.CVStatus;
import com.example.InterHub.mapper.CvMapper;
import com.example.InterHub.repository.CvRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.apache.logging.log4j.util.Strings.isBlank;

@Service
@RequiredArgsConstructor

public class CvService {
    private final CvRepository cvRepository;
    private final CvMapper cvMapper;
    @Transactional(readOnly = true)
    public List<CvUploadResponse> getCv(CVStatus status, User currentUser)
    {List<CvUpload>cvUploads;
        if(status==null)
        {
            cvUploads=cvRepository.findByLecturerIdOrderByCreatedDateDesc(currentUser.getId());

        }
        else {
            cvUploads=cvRepository.findAllByLecturerIdAndStatusOrderByCreatedDateDesc(currentUser.getId(),status);
        }
        return cvUploads.stream().map(cvMapper::toResponse).toList();
    }
    @Transactional
    public CvUploadResponse uploadCv(CvUpLoadRequest request, User currentUser)
    {
        Student student=(Student)currentUser;

        CvUpload cvUpload=CvUpload.builder()
                .fileUrl(request.getFileUrl())
                .student(student)
                .lecturer(student.getLecturer()).build();
        CvUpload saveCv=cvRepository.save(cvUpload);
        return cvMapper.toResponse(saveCv);
    }
    @Transactional(readOnly=true)
    public List<CvUploadResponse> getMyCvUploads(User currentUser)
    {
        return cvRepository.findByStudentIdOrderByCreatedDateDesc(currentUser.getId()).stream().map(cvMapper::toResponse).toList();
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
}
