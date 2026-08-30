package com.example.InterHub.controller.admin;

import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Job;
import com.example.InterHub.entity.Student;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.enums.EmployerStatus;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/employers")
@RequiredArgsConstructor
public class AdminEmployerController {

    private final EmployerRepository employerRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;


    // =====================================================
    // DANH SÁCH EMPLOYER
    // =====================================================

    @GetMapping
    public String list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {

        Page<Employer> employerPage =
                employerRepository.findAll(
                        PageRequest.of(
                                page,
                                size,
                                Sort.by("createdDate").descending()
                        )
                );

        model.addAttribute("employers", employerPage.getContent());
        model.addAttribute("currentPage", employerPage.getNumber());
        model.addAttribute("totalPages", employerPage.getTotalPages());
        model.addAttribute("totalItems", employerPage.getTotalElements());
        model.addAttribute("pageSize", employerPage.getSize());

        return "admin/employers/list";
    }


    // =====================================================
    // CHI TIẾT EMPLOYER
    // =====================================================

    @GetMapping("/{id}")
    public String detail(
            @PathVariable Long id,
            Model model
    ) {

        Employer employer =
                employerRepository
                        .findById(id)
                        .orElseThrow();


        long totalJobs =
                jobRepository.countByEmployerId(id);


        long interningStudents =
                applicationRepository
                        .countByJobEmployerIdAndStatus(
                                id,
                                ApplicationStatus.APPROVED
                        );


        long completedStudents =
                applicationRepository
                        .countByJobEmployerIdAndStatus(
                                id,
                                ApplicationStatus.COMPLETED
                        );


        model.addAttribute("employer", employer);

        model.addAttribute("totalJobs", totalJobs);

        model.addAttribute(
                "interningStudents",
                interningStudents
        );

        model.addAttribute(
                "completedStudents",
                completedStudents
        );


        return "admin/employers/detail";
    }


    // =====================================================
    // DUYỆT EMPLOYER
    // =====================================================

    @PostMapping("/{id}/approve")
    public String approve(
            @PathVariable Long id
    ) {

        Employer employer =
                employerRepository
                        .findById(id)
                        .orElseThrow();


        employer.setStatus(
                EmployerStatus.APPROVED
        );

        employerRepository.save(employer);


        return "redirect:/admin/employers";
    }


    // =====================================================
    // TỪ CHỐI EMPLOYER
    // =====================================================

    @PostMapping("/{id}/reject")
    public String reject(
            @PathVariable Long id
    ) {

        Employer employer =
                employerRepository
                        .findById(id)
                        .orElseThrow();


        employer.setStatus(
                EmployerStatus.REJECTED
        );

        employerRepository.save(employer);


        return "redirect:/admin/employers";
    }


    // =====================================================
    // JOB CỦA EMPLOYER
    //
    // DÙNG LẠI:
    // admin/jobs/list.html
    // =====================================================

    @GetMapping("/{id}/jobs")
    public String employerJobs(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {

        Employer employer =
                employerRepository
                        .findById(id)
                        .orElseThrow();


        Page<Job> jobPage =
                jobRepository.findByEmployerId(
                        id,
                        PageRequest.of(
                                page,
                                size,
                                Sort.by("createdDate").descending()
                        )
                );


        model.addAttribute(
                "jobs",
                jobPage.getContent()
        );

        model.addAttribute(
                "currentPage",
                jobPage.getNumber()
        );

        model.addAttribute(
                "totalPages",
                jobPage.getTotalPages()
        );

        model.addAttribute(
                "totalItems",
                jobPage.getTotalElements()
        );

        model.addAttribute(
                "pageSize",
                jobPage.getSize()
        );

        model.addAttribute(
                "pageUrl",
                "/admin/employers/" + id + "/jobs"
        );
        return "admin/jobs/list";
    }


    @GetMapping("/{id}/students")
    public String interningStudents(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {

        Employer employer =
                employerRepository
                        .findById(id)
                        .orElseThrow();


        Page<Student> studentPage =
                applicationRepository
                        .findStudentsByEmployerIdAndStatus(
                                id,
                                ApplicationStatus.APPROVED,
                                PageRequest.of(page, size)
                        );


        model.addAttribute(
                "students",
                studentPage.getContent()
        );

        model.addAttribute(
                "currentPage",
                studentPage.getNumber()
        );

        model.addAttribute(
                "totalPages",
                studentPage.getTotalPages()
        );

        model.addAttribute(
                "totalItems",
                studentPage.getTotalElements()
        );

        model.addAttribute(
                "pageSize",
                studentPage.getSize()
        );


        model.addAttribute(
                "pageUrl",
                "/admin/employers/" + id + "/students"
        );
        return "admin/students/list";
    }


    // =====================================================
    // SINH VIÊN HOÀN THÀNH THỰC TẬP
    //
    // COMPLETED
    //
    // DÙNG LẠI:
    // admin/students/list.html
    // =====================================================

    @GetMapping("/{id}/completed-students")
    public String completedStudents(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {

        Employer employer =
                employerRepository
                        .findById(id)
                        .orElseThrow();


        Page<Student> studentPage =
                applicationRepository
                        .findStudentsByEmployerIdAndStatus(
                                id,
                                ApplicationStatus.COMPLETED,
                                PageRequest.of(page, size)
                        );


        model.addAttribute(
                "students",
                studentPage.getContent()
        );

        model.addAttribute(
                "currentPage",
                studentPage.getNumber()
        );

        model.addAttribute(
                "totalPages",
                studentPage.getTotalPages()
        );

        model.addAttribute(
                "totalItems",
                studentPage.getTotalElements()
        );

        model.addAttribute(
                "pageSize",
                studentPage.getSize()
        );


        model.addAttribute(
                "pageUrl",
                "/admin/employers/" + id + "/completed-students"
        );
        return "admin/students/list";
    }
}