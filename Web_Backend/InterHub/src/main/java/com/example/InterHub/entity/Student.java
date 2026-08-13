package com.example.InterHub.entity;

import com.example.InterHub.enums.StudentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
public class Student extends User{
    @Column(nullable=false,unique=true)
    private String mssv;
    @Column(nullable=false)
    private String major;
    @Column(nullable=false)
    private String className;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="lecturer_id")
    private Lecturer lecturer;
    @OneToMany(mappedBy = "student")
    private List<CvUpload> cvUploads =new ArrayList<>();
    @OneToMany(mappedBy = "student")
    private List<Application>applications=new ArrayList<>();
    @OneToMany(mappedBy = "student")
    private List<JobReview>reviews=new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private StudentStatus status=StudentStatus.TIM_VIEC;

}
