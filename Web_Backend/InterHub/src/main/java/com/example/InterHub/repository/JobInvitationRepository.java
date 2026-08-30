package com.example.InterHub.repository;

import com.example.InterHub.entity.JobInvitation;
import com.example.InterHub.entity.JobInvitation;
import com.example.InterHub.enums.JobInvitationStatus;
import com.example.InterHub.enums.JobInvitationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobInvitationRepository
        extends JpaRepository<JobInvitation, Long> {

    boolean existsByStudentIdAndJobId(
            Long studentId,
            Long jobId
    );

    boolean existsByStudentIdAndJobIdAndStatus(
            Long studentId,
            Long jobId,
            JobInvitationStatus status
    );

    Page<JobInvitation> findAllByStudentId(
            Long studentId,
            Pageable pageable
    );

    Page<JobInvitation> findAllByJobId(
            Long jobId,
            Pageable pageable
    );

    Page<JobInvitation> findAllByJobEmployerId(
            Long employerId,
            Pageable pageable
    );
}