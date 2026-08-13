package com.example.InterHub.controller.admin;

import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Student;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/admin/students")
@RequiredArgsConstructor
public class AdminStudentController {

    private final StudentRepository studentRepository;

    private final ApplicationRepository applicationRepository;


    // =====================================================
    // DANH SÁCH STUDENT
    // =====================================================
    @GetMapping
    public String list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {

        Page<Student> studentPage =
                studentRepository.findAll(
                        PageRequest.of(
                                page,
                                size,
                                Sort.by("createdDate").descending()
                        )
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


        return "admin/students/list";
    }


    // =====================================================
    // CHI TIẾT STUDENT
    // =====================================================
    @GetMapping("/{id}")
    public String detail(
            @PathVariable Long id,
            Model model
    ) {

        Student student =
                studentRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Không tìm thấy sinh viên"
                                )
                        );


        Optional<Application> acceptedApplication =
                applicationRepository
                        .findFirstByStudentIdAndStatusOrderByCreatedDateDesc(
                                id,
                                ApplicationStatus.APPROVE
                        );


        model.addAttribute(
                "student",
                student
        );


        model.addAttribute(
                "acceptedApplication",
                acceptedApplication.orElse(null)
        );


        model.addAttribute(
                "hasJob",
                acceptedApplication.isPresent()
        );


        return "admin/students/detail";
    }


    // =====================================================
    // APPLICATION CỦA STUDENT
    // =====================================================
    @GetMapping("/{id}/applications")
    public String applications(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {

        Student student =
                studentRepository
                        .findById(id)
                        .orElseThrow();


        Page<Application> applicationPage =
                applicationRepository.findByStudentId(
                        id,
                        PageRequest.of(
                                page,
                                size,
                                Sort.by("createdDate").descending()
                        )
                );


        model.addAttribute(
                "student",
                student
        );

        model.addAttribute(
                "applications",
                applicationPage.getContent()
        );

        model.addAttribute(
                "currentPage",
                applicationPage.getNumber()
        );

        model.addAttribute(
                "totalPages",
                applicationPage.getTotalPages()
        );

        model.addAttribute(
                "totalItems",
                applicationPage.getTotalElements()
        );

        model.addAttribute(
                "pageSize",
                applicationPage.getSize()
        );
        model.addAttribute(
                "pageUrl",
                "/admin/students"
        );


        return "admin/students/applications";
    }
}