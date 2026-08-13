package com.example.InterHub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {

    @NotNull(message = "roomId không được để trống")
    private Long roomId;

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String content;
}