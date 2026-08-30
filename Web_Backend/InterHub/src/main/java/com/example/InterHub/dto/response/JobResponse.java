package com.example.InterHub.dto.response;

import com.example.InterHub.entity.Employer;
import com.example.InterHub.enums.JobStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;

    private String title;

    private String description;

    private String requirements;

    private LocalDate deadline;

    private BigDecimal salary;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer quantity;

    private String location;

    private JobStatus status;

    private EmployerResponse employer;
}
