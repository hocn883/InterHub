package com.example.InterHub.repository;

import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer,Long> {
    boolean existsByLecturerCode(String lecturerCode);
}
