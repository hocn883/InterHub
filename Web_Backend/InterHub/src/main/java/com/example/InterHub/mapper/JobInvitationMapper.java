package com.example.InterHub.mapper;
import com.example.InterHub.dto.response.JobInvitationResponse;
import com.example.InterHub.entity.JobInvitation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobInvitationMapper {
    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.fullName", target = "studentName")
    @Mapping(source = "job.id", target = "jobId")
    @Mapping(source = "job.title", target = "jobTitle")
    @Mapping(source = "cv.id", target = "cvId")
    @Mapping(source = "cv.fileUrl", target = "fileCv")
    JobInvitationResponse toResponse(JobInvitation jobInvitation);
}
