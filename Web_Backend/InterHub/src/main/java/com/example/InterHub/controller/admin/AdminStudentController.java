package com.example.InterHub.controller.admin;

import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.enums.StudentStatus;
import com.example.InterHub.repository.ApplicationRepository;
import com.example.InterHub.repository.LecturerRepository;
import com.example.InterHub.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/admin/students")
@RequiredArgsConstructor
public class AdminStudentController {
    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;
    private final LecturerRepository lecturerRepository;
    @GetMapping
    public String list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {
        Page<Student> studentPage = studentRepository.findAll(
                        PageRequest.of(page, size,
                                Sort.by("createdDate").descending()));
        model.addAttribute("students", studentPage.getContent());
        model.addAttribute("currentPage", studentPage.getNumber());
        model.addAttribute("totalPages", studentPage.getTotalPages());
        model.addAttribute("totalItems", studentPage.getTotalElements());
        model.addAttribute("pageSize", studentPage.getSize());
        return "admin/students/list";
    }
    @GetMapping("/{id}")
    public String detail(@PathVariable Long id,
            Model model)
    {
        Student student = studentRepository.findById(id).orElseThrow(
                                () -> new RuntimeException(
                                        "Không tìm thấy sinh viên"
                                ));
        Optional<Application> acceptedApplication = applicationRepository
                        .findFirstByStudentIdAndStatusOrderByCreatedDateDesc(
                                id,
                                ApplicationStatus.APPROVED);
        model.addAttribute("student", student);
        model.addAttribute("acceptedApplication", acceptedApplication.orElse(null));
        model.addAttribute("hasJob",   student.getStatus() == StudentStatus.DA_CO_VIEC);
        return "admin/students/detail";
    }
    @GetMapping("/{id}/applications")
    public String applications(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {
        Student student = studentRepository.findById(id).orElseThrow();
        Page<Application> applicationPage = applicationRepository.findByStudentId(id,
                        PageRequest.of(
                                page,
                                size,
                                Sort.by("createdDate").descending()
                        )
                );
        model.addAttribute("student", student);
        model.addAttribute("applications", applicationPage.getContent());
        model.addAttribute("currentPage", applicationPage.getNumber());
        model.addAttribute("totalPages", applicationPage.getTotalPages());
        model.addAttribute("totalItems", applicationPage.getTotalElements());
        model.addAttribute("pageSize", applicationPage.getSize());
        model.addAttribute("pageUrl", "/admin/students");
        return "admin/students/applications";
    }
    @GetMapping("/assignment")
    public String assignmentPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {
        Page<Student> studentPage = studentRepository.findByLecturerIsNull(PageRequest.of(page, size));
        model.addAttribute("students", studentPage.getContent());
        model.addAttribute("currentPage", studentPage.getNumber());
        model.addAttribute("totalPages", studentPage.getTotalPages());
        model.addAttribute("totalItems", studentPage.getTotalElements());
        model.addAttribute("pageSize", studentPage.getSize());
        model.addAttribute("lecturers", lecturerRepository.findAll());
        return "admin/students/assignment";
    }
    @PostMapping("/assign")
    public String assignStudents(
            @RequestParam List<Long> studentIds,
            @RequestParam Long lecturerId,
            RedirectAttributes redirectAttributes
    ) {
        Lecturer lecturer = lecturerRepository.findById(lecturerId).orElseThrow();
        List<Student> students = studentRepository.findAllById(studentIds);
        long currentCount = studentRepository.countByLecturerId(lecturerId);
        int selectedCount = students.size();
        if (currentCount + selectedCount > 10) {
            redirectAttributes.addFlashAttribute(
                    "error",
                    "Không thể phân công. Giảng viên "
                            + lecturer.getFullName()
                            + " hiện đang quản lý "
                            + currentCount
                            + " sinh viên. "
                            + "Chỉ được tối đa 10 sinh viên."
            );
            return "redirect:/admin/students/assignment";
        }
        for (Student student : students) {
            student.setLecturer(lecturer);
        }
        studentRepository.saveAll(students);
        redirectAttributes.addFlashAttribute(
                "success",
                "Đã phân công "
                        + selectedCount
                        + " sinh viên cho "
                        + lecturer.getFullName()
        );
        return "redirect:/admin/students/assignment";
    }
    @PostMapping("/{id}/unassign")
    public String unassignStudent(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes
    ) {
        Student student = studentRepository.findById(id).orElseThrow();
        student.setLecturer(null);
        studentRepository.save(student);
        redirectAttributes.addFlashAttribute("success",
                "Đã xóa phân công sinh viên " + student.getFullName());
        return "redirect:/admin/students";
    }
}