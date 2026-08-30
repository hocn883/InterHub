package com.example.InterHub.dto.response;

import com.example.InterHub.enums.EmployerStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class EmployerResponse extends UserResponse {
    private String companyName;

    private String taxCode;

    private String location;

    private EmployerStatus status;
}
