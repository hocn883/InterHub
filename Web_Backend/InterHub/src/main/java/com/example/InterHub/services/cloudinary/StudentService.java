package com.example.InterHub.services.cloudinary;

import com.example.InterHub.dto.response.JobInvitationResponse;
import com.example.InterHub.entity.Student;
import com.example.InterHub.mapper.JobInvitationMapper;
import com.example.InterHub.repository.JobInvitationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public class StudentService {
    private JobInvitationRepository jobInvitationRepository;
    private JobInvitationMapper jobInvitationMapper;
    @Transactional(readOnly = true)
    public Page<JobInvitationResponse> getStudentJobInvitations(
            Student student,
            Pageable pageable
    ) {

        return jobInvitationRepository
                .findAllByStudentId(
                        student.getId(),
                        pageable
                )
                .map(jobInvitationMapper::toResponse);
    }
}
