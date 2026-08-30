package com.example.InterHub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter

public class CvUpLoadRequest {
    @NotNull
    private MultipartFile fileCv;
}
