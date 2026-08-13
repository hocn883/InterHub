package com.example.InterHub.repository;

import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Student;
import com.example.InterHub.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application,Long> {
    // Kiểm tra sinh viên đã apply job chưa
    boolean existsByStudentIdAndJobId(
            Long studentId,
            Long jobId
    );

    // Sinh viên xem tất cả đơn đã nộp
    Page<Application> findByStudentIdOrderByCreatedDateDesc(
            Long studentId, Pageable pageable
            );

    // Sinh viên xem một đơn thuộc chính mình
    Optional<Application> findByIdAndStudentId(
            Long applicationId,
            Long studentId
    );

    // Employer xem các application của một job thuộc employer đó
    Page<Application>
    findByJobIdAndJobEmployerIdOrderByCreatedDateDesc(
            Long jobId,
            Long employerId,
            Pageable pageable
    );

    // Employer xem/duyệt một application thuộc job của mình
    Optional<Application> findByIdAndJobEmployerId(
            Long applicationId,
            Long employerId
    );
    long countByJobEmployerId(
            Long employerId
    );
    long countByJobEmployerIdAndStatus(
            Long employerId,
            ApplicationStatus status
    );
    Page<Application> findByJobEmployerId(
            Long employerId,
            Pageable pageable
    );
    Page<Application> findByJobEmployerIdAndStatus(
            Long employerId,
            ApplicationStatus status,
            Pageable pageable
    );
    Optional<Application>
    findFirstByStudentIdAndStatusOrderByCreatedDateDesc(
            Long studentId,
            ApplicationStatus status
    );
    Page<Application>
    findByStudentId(
            Long studentId,
            Pageable pageable
    );
    @Query("""
        SELECT DISTINCT a.student
        FROM Application a
        WHERE a.job.employer.id = :employerId
        AND a.status = :status
    """)
    Page<Student> findStudentsByEmployerIdAndStatus(
            @Param("employerId") Long employerId,
            @Param("status") ApplicationStatus status,
            Pageable pageable
    );
    Optional<Application>findByStudentIdAndJobId(Long id,Long studentId);
}
