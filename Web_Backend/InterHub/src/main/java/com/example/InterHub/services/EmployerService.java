package com.example.InterHub.services;

import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.EmployerResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.dto.response.StudentResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.mapper.ApplicationMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class EmployerService {
    private final EmployerRepository employerRepository;
    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;
    private final UserMapper userMapper;
    private final PageMapper pageMapper;
    private final ApplicationMapper applicationMapper;
    public PageResponse<EmployerResponse>getAll(Pageable pageable)
    {
        Page<Employer> employerPage = employerRepository.findAll(pageable);
        Page<EmployerResponse>page=employerPage.map(userMapper::toEmployerResponse);
        return pageMapper.toPageResponse(page);
    }
    public EmployerResponse getEmployerById(Long id)
    {
        Employer employer = employerRepository.findById(id).orElseThrow();
        return userMapper.toEmployerResponse(employer);
    }
    public PageResponse<ApplicationResponse> getApprovedStudents(
            Long employerId,
            Pageable pageable
    ) {
        Page<Application>page=applicationRepository.findByJobEmployerIdAndStatus(
                employerId, ApplicationStatus.APPROVED, pageable
        );
        Page<ApplicationResponse>pageResponse=page.map(applicationMapper::toResponse);
        return pageMapper.toPageResponse(pageResponse);
    }

    public PageResponse<ApplicationResponse> getRejectedStudents(
            Long employerId,
            Pageable pageable
    ) {
        Page<Application>page=applicationRepository.findByJobEmployerIdAndStatus(
                employerId, ApplicationStatus.REJECTED, pageable
        );
        Page<ApplicationResponse>pageResponse=page.map(applicationMapper::toResponse);
        return pageMapper.toPageResponse(pageResponse);
    }


}
