package com.example.InterHub.repository;

import com.example.InterHub.entity.CvUpload;
import com.example.InterHub.enums.CVStatus;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CvRepository extends JpaRepository<CvUpload,Long> {
    List<CvUpload> findByStudentIdOrderByCreatedDateDesc(Long studentId);
    List<CvUpload> findByLecturerIdOrderByCreatedDateDesc(Long lecturerId);
    List<CvUpload> findAllByLecturerIdAndStatusOrderByCreatedDateDesc(
            Long lecturerId,
            CVStatus status
    );

    Optional<CvUpload> findByIdAndStudentId(
            Long cvId,
            Long studentId
    );

    Optional<CvUpload> findByIdAndLecturerId(
            Long cvId,
            Long lecturerId
    );


}
