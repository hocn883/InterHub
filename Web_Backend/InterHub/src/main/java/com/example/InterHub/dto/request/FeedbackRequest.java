package com.example.InterHub.dto.request;

import com.example.InterHub.enums.CVStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class FeedbackRequest {
    @NotNull
    private String feedback;
}
