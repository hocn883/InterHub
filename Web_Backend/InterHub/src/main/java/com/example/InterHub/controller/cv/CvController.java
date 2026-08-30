package com.example.InterHub.controller.cv;

import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.enums.CVStatus;
import com.example.InterHub.services.CvService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cvs-suggested")
@RequiredArgsConstructor
public class CvController {
    private final CvService cvService;
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CvUploadResponse>>>getCvSuggested(
             @RequestParam(defaultValue = "0") int page
            , @RequestParam(defaultValue = "10") int size
    )
    {    Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.DESC, "createdDate"));
        PageResponse<CvUploadResponse>response=cvService.getCvs(CVStatus.APPROVED,pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<CvUploadResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Danh sach CV noi bat")
                        .result(response)
                        .build()
        );
    }
}
