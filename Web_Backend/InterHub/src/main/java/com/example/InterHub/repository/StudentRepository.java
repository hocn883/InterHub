package com.example.InterHub.repository;

import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student,Long> {
    boolean existsByMssv(String mssv);
    Page<Student>findByLecturerId(Long id, Pageable page);
    long countByLecturerId(Long id);
    Page<Student> findByLecturerIsNull(Pageable pageable);
    List<Student> findAllByLecturerId(Long lecturerId);
}
