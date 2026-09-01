package com.example.InterHub.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class SearchJobRequest {
    private String title;
    private Double longitude;
    private Double latitude;
    private Double radius;
    private BigDecimal salary;
}
