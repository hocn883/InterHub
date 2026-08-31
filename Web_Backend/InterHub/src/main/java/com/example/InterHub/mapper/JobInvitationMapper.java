package com.example.InterHub.mapper;
import com.example.InterHub.dto.response.JobInvitationResponse;
import com.example.InterHub.entity.JobInvitation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobInvitationMapper {
    @Mapping(source = "student", target = "student")
    @Mapping(source = "job", target = "job")
    @Mapping(source = "cv.id", target = "cvId")
    @Mapping(source = "cv.fileUrl", target = "fileCv")
    @Mapping(source = "job.employer",target="employer")
    JobInvitationResponse toResponse(JobInvitation jobInvitation);
}
