package com.example.InterHub.services;

import com.example.InterHub.dto.response.EmployerResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.EmployerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class EmployerService {
    private final EmployerRepository employerRepository;
    private final UserMapper userMapper;
    private final PageMapper pageMapper;
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

}
