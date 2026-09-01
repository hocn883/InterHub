package com.example.InterHub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@Setter
@Getter
public class PostJobRequest {
        @NotBlank
        private String title;
        @NotBlank
        private String description;
        private String requirements;
        @NotNull
        private BigDecimal salary;
        @NotNull
        private Integer quantity;
        @NotNull
        private Double longitude;
        @NotNull
        private Double latitude;
        @NotBlank
        private String location;
        @NotNull
        private LocalDate deadline;
        @NotNull
        private LocalDate startDate;
        @NotNull
        private LocalDate endDate;
    }
