package com.example.InterHub.controller.admin;

import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.JobRepository;
import com.example.InterHub.repository.StudentRepository;
import org.springframework.ui.Model;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final StudentRepository studentRepository;
    private final EmployerRepository employerRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @GetMapping
    public String dashboard(Model model)
    {
        long totalStudents = studentRepository.count();
        long totalEmployers = employerRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        model.addAttribute("totalStudents", totalStudents);
        model.addAttribute("totalEmployers", totalEmployers);
        model.addAttribute("totalJobs", totalJobs);
        model.addAttribute("totalApplications", totalApplications);
        return "admin/dashboard";
    }
}
