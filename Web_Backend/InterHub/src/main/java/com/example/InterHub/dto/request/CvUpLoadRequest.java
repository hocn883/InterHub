package com.example.InterHub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class CvUpLoadRequest {
    @NotBlank
    private String fileUrl;
}
