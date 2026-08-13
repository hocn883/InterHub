package com.example.InterHub.dto.response;

import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse  extends UserResponse{
    private String mssv;
    private String major;
    private String className;
}
