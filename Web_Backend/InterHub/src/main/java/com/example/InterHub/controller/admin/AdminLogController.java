package com.example.InterHub.controller.admin;

import com.example.InterHub.entity.SystemLog;
import com.example.InterHub.repository.SystemLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/logs")
@RequiredArgsConstructor
public class AdminLogController {

    private final SystemLogRepository systemLogRepository;


    // ==========================================
    // DANH SÁCH LOG + PHÂN TRANG
    // ==========================================
    @GetMapping
    public String list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Model model
    ) {

        Page<SystemLog> logPage =
                systemLogRepository.findAll(
                        PageRequest.of(
                                page,
                                size,
                                Sort.by("createdDate").descending()
                        )
                );


        model.addAttribute(
                "logs",
                logPage.getContent()
        );

        model.addAttribute(
                "currentPage",
                logPage.getNumber()
        );

        model.addAttribute(
                "totalPages",
                logPage.getTotalPages()
        );

        model.addAttribute(
                "totalItems",
                logPage.getTotalElements()
        );

        model.addAttribute(
                "pageSize",
                logPage.getSize()
        );


        return "admin/logs/list";
    }
}