package com.example.InterHub.mapper;

import com.example.InterHub.dto.response.ApplicationResponse;
import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.entity.Application;
import com.example.InterHub.entity.CvUpload;
import com.example.InterHub.entity.Lecturer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {
                UserMapper.class,
                JobMapper.class,
        }
)
public interface ApplicationMapper {
    ApplicationResponse toResponse(Application application);
}