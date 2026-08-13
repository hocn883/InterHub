package com.example.InterHub.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ApiResponse<T> {
    private int code;
    private String status;
    private String message;
    private T result;
}
