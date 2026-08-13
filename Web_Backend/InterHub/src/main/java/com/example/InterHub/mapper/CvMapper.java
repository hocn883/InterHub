package com.example.InterHub.mapper;

import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.entity.CvUpload;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel="spring")
public interface CvMapper {
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "studentName", source = "student.fullName")
    @Mapping(target = "lecturerId", source = "lecturer.id")
    CvUploadResponse toResponse (CvUpload cv);
}
