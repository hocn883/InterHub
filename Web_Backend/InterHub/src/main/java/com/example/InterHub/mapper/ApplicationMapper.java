package com.example.InterHub.mapper;

import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.CvUpload;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {

    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.fullName", target = "studentName")
    @Mapping(source = "job.id", target = "jobId")
    @Mapping(source = "job.title", target = "jobTitle")
    @Mapping(source = "job.employer.companyName", target = "employerName")
    ApplicationResponse toResponse(Application application);
}