package com.example.InterHub.controller.admin;

import com.example.InterHub.entity.Job;
import com.example.InterHub.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/jobs")
@RequiredArgsConstructor
public class AdminJobController {

    private final JobRepository jobRepository;


    // ==========================================
    // DANH SÁCH JOB + PHÂN TRANG
    // ==========================================
    @GetMapping
    public String list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {

        Page<Job> jobPage =
                jobRepository.findAll(
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
                "/admin/jobs"
        );


        return "admin/jobs/list";
    }


    // ==========================================
    // CHI TIẾT JOB
    // ==========================================
    @GetMapping("/{id}")
    public String detail(
            @PathVariable Long id,
            Model model
    ) {

        Job job =
                jobRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Không tìm thấy công việc"
                                )
                        );


        model.addAttribute(
                "job",
                job
        );


        return "admin/jobs/detail";
    }
}