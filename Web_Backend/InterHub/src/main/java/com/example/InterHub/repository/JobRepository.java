package com.example.InterHub.repository;

import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Job;
import com.example.InterHub.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface JobRepository extends JpaRepository<Job,Long> {
    Optional<Job>findJobById(Long id);
    List<Job>findByStatus(JobStatus status);

    List<Job> findByTitleContainingIgnoreCase(String keyword);
    Optional<Job> findByIdAndEmployerId(
            Long jobId,
            Long employerId
    );
    Page<Job> findByTitleContainingIgnoreCase(
            String title,
            Pageable pageable
    );
    Page<Job>findJobByEmployerId(Long id, Pageable pageable);
    long countByEmployerId(Long employerId);
    Page<Job> findByEmployerId(
            Long employerId,
            Pageable pageable
    );
}
