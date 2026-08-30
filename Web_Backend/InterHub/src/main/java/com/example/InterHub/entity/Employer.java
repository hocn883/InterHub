package com.example.InterHub.entity;

import com.example.InterHub.enums.EmployerStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
@Builder
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Employer extends User{
    @Column(nullable = false)
    private String companyName;
    @Column(nullable=false , unique = true)
    private String taxCode;
    @Column(nullable=false)
    private String location;
    @Builder.Default
    private EmployerStatus status=EmployerStatus.PENDING;
    @OneToMany(mappedBy="employer")
    private List<Job> jobs= new ArrayList<>();
}
