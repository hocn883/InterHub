package com.example.InterHub.controller.admin;

import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.repository.LecturerRepository;
import com.example.InterHub.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/lecturers")
@RequiredArgsConstructor
public class AdminLecturerController {

    private final LecturerRepository lecturerRepository;

    private final StudentRepository studentRepository;


    // =====================================================
    // DANH SÁCH GIẢNG VIÊN
    // =====================================================
    @GetMapping
    public String list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {

        Page<Lecturer> lecturerPage =
                lecturerRepository.findAll(
                        PageRequest.of(
                                page,
                                size,
                                Sort.by("createdDate").descending()
                        )
                );


        model.addAttribute(
                "lecturers",
                lecturerPage.getContent()
        );

        model.addAttribute(
                "currentPage",
                lecturerPage.getNumber()
        );

        model.addAttribute(
                "totalPages",
                lecturerPage.getTotalPages()
        );

        model.addAttribute(
                "totalItems",
                lecturerPage.getTotalElements()
        );

        model.addAttribute(
                "pageSize",
                lecturerPage.getSize()
        );


        return "admin/lecturers/list";
    }


    // =====================================================
    // CHI TIẾT GIẢNG VIÊN
    // =====================================================
    @GetMapping("/{id}")
    public String detail(
            @PathVariable Long id,
            Model model
    ) {

        Lecturer lecturer =
                lecturerRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Không tìm thấy giảng viên"
                                )
                        );


        long totalStudents =
                studentRepository
                        .countByLecturerId(id);


        model.addAttribute(
                "lecturer",
                lecturer
        );

        model.addAttribute(
                "totalStudents",
                totalStudents
        );


        return "admin/lecturers/detail";
    }


    // =====================================================
    // DANH SÁCH STUDENT GIẢNG VIÊN QUẢN LÝ
    // =====================================================
    @GetMapping("/{id}/students")
    public String managedStudents(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {

        Lecturer lecturer =
                lecturerRepository
                        .findById(id)
                        .orElseThrow();


        Page<Student> studentPage =
                studentRepository.findByLecturerId(
                        id,
                        PageRequest.of(
                                page,
                                size,
                                Sort.by("createdDate").descending()
                        )
                );


        model.addAttribute(
                "lecturer",
                lecturer
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


        return "admin/lecturers/students";
    }
}