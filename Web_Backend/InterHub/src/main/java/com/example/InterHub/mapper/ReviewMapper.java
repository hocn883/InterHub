package com.example.InterHub.mapper;

import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.dto.response.ReviewResponse;
import com.example.InterHub.entity.CvUpload;
import com.example.InterHub.entity.JobReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel="spring")
public interface ReviewMapper {
    @Mapping(target = "studentName", source = "student.fullName")
        ReviewResponse toResponse(JobReview review);
    }
