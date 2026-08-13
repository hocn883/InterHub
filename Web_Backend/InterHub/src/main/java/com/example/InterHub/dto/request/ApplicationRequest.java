package com.example.InterHub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ApplicationRequest {
    @NotBlank
    @Size(max = 3000)
    private String coverLetter;
    @NotNull
    private MultipartFile fileCv;
}
