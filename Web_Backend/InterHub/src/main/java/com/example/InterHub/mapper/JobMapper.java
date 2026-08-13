package com.example.InterHub.mapper;

import com.example.InterHub.dto.request.PostJobRequest;
import com.example.InterHub.dto.response.JobResponse;
import com.example.InterHub.entity.Job;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel="spring")
public interface JobMapper {
    JobResponse toRespone(Job job);
    @Mapping(target = "employer", ignore = true)
    @Mapping(target = "applications", ignore = true)
    Job toEntity(PostJobRequest request);

}
