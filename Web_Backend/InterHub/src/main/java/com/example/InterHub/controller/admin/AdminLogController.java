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

    @GetMapping
    public String list(
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Model model
    ) {
        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdDate").descending()
        );
        Page<SystemLog> logPage;
        if (userId != null) {
            logPage = systemLogRepository.findByUserId(
                    userId,
                    pageable
            );
        } else {
            logPage = systemLogRepository.findAll(
                    pageable);
        }
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
        model.addAttribute(
                "userId",
                userId
        );
        return "admin/logs/list";
    }
}