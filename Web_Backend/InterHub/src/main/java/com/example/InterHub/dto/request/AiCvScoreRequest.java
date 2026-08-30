package com.example.InterHub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class AiCvScoreRequest {

    @NotNull(message = "Vui lòng chọn file CV.")
    private MultipartFile file;

    @NotBlank(message = "Vui lòng nhập vị trí ứng tuyển.")
    @Size(
            min = 2,
            max = 100,
            message = "Vị trí ứng tuyển phải từ 2 đến 100 ký tự."
    )
    private String targetPosition;
}