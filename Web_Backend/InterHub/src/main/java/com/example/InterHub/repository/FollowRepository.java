package com.example.InterHub.repository;

import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Follow;
import com.example.InterHub.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByStudentIdAndEmployerId(
            Long student,
            Long employer
    );
    boolean existsByStudentAndEmployer(
            Student student,
            Employer employer
    );
    Page<Follow> findAllByStudentId(Long studentId, Pageable pageable);
    Optional<Follow> findByStudentAndEmployer(
            Student student,
            Employer employer
    );

    List<Follow> findByStudent(
            Student student
    );

    List<Follow> findByEmployer(
            Employer employer
    );

    @Query("""
        SELECT f.student
        FROM Follow f
        WHERE f.employer.id = :employerId
    """)
    List<Student> findStudentsByEmployerId(
            @Param("employerId") Long employerId
    );
}
