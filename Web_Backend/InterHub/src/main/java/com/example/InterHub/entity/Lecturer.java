package com.example.InterHub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@Entity
public class Lecturer extends User{
    @Column(nullable=false,unique=true)
    private String lecturerCode;
    @OneToMany(mappedBy="lecturer")
    private List<Student>students= new ArrayList<>();
    @OneToMany(mappedBy="lecturer")
    private List<CvUpload>cvUpload=new ArrayList<>();

}
