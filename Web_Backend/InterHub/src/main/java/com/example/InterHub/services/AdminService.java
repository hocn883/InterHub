package com.example.InterHub.services;

import com.example.InterHub.dto.response.EmployerResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.enums.EmployerStatus;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.EmployerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor

public class AdminService {
    private final EmployerRepository employerRepository;
    private final UserMapper userMapper;
    private final PageMapper pageMapper;
    @Transactional (readOnly = true)
    public PageResponse<EmployerResponse>getEmployers(Pageable pageable){
        Page<Employer>pageEmployer=employerRepository.findAll(pageable);
        Page<EmployerResponse>responses=pageEmployer.map(userMapper::toEmployerResponse);
        return pageMapper.toPageResponse(responses);
    }
    @Transactional (readOnly = true)
    public PageResponse<EmployerResponse>getPendingEmployers(Pageable pageable){
        Page<Employer>pageEmployer=employerRepository.findByStatus(EmployerStatus.PENDING.toString(),pageable);
        Page<EmployerResponse>responses=pageEmployer.map(userMapper::toEmployerResponse);
        return pageMapper.toPageResponse(responses);
    }

}
