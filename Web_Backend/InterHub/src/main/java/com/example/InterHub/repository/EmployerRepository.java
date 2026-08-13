package com.example.InterHub.repository;

import com.example.InterHub.entity.Employer;
import com.example.InterHub.enums.EmployerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface EmployerRepository extends JpaRepository<Employer,Long> {
    boolean existsByTaxCode(String taxCode);
    Optional<Employer>findByUsername(String username);
    Page<Employer>findByStatus(String status, Pageable page);
    long countByStatus(EmployerStatus status);
}
