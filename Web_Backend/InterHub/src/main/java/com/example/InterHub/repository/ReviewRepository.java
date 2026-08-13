package com.example.InterHub.repository;

import com.example.InterHub.entity.JobReview;
import com.example.InterHub.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
    public interface ReviewRepository
        extends JpaRepository<JobReview,Long> {

        boolean existsByStudentIdAndJobId(
            Long reviewerId,
            Long jobId
         );
         Page<JobReview> findByJobEmployerId(
            Long employerId,
            Pageable pageable
    );

        }