package com.example.InterHub.services;

import com.example.InterHub.dto.response.CvUploadResponse;
import com.example.InterHub.dto.response.EmployerResponse;
import com.example.InterHub.dto.response.FollowResponse;
import com.example.InterHub.dto.response.PageResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Follow;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import com.example.InterHub.mapper.FollowMapper;
import com.example.InterHub.mapper.PageMapper;
import com.example.InterHub.mapper.UserMapper;
import com.example.InterHub.repository.EmployerRepository;
import com.example.InterHub.repository.FollowRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final FollowRepository followRepository;
    private final EmployerRepository employerRepository;
    private final UserMapper userMapper;
    private final FollowMapper followMapper;
    private final PageMapper pageMapper;
    @Transactional
    public void followEmployer(
            Student student,
            Long employerId
    ) {
        Employer employer = employerRepository.findById(employerId).orElseThrow(() -> new RuntimeException("Không tìm thấy doanh nghiệp"));
        boolean existed = followRepository.existsByStudentAndEmployer(student, employer);
        if (existed)
        {
            throw new RuntimeException(
                    "Bạn đã theo dõi doanh nghiệp này"
            );
        }
        Follow follow = Follow.builder().student(student).employer(employer).build();
        followRepository.save(follow);
    }
    @Transactional
    public void unfollowEmployer(Student student, Long employerId)
    {
        Employer employer = employerRepository.findById(employerId).orElseThrow(() -> new RuntimeException("Không tìm thấy doanh nghiệp"));
        Follow follow = followRepository.findByStudentAndEmployer(student, employer)
                        .orElseThrow(() -> new RuntimeException("Bạn chưa theo dõi doanh nghiệp này"));
        followRepository.delete(follow);
    }
    @Transactional(readOnly=true)
    public boolean isFollowing(Student student, Long employerId
    ) {
        return followRepository.existsByStudentIdAndEmployerId(
                        student.getId(),
                        employerId
                );
    }
    @Transactional
    public PageResponse<FollowResponse> getFollowers(Pageable  pageable , User currentUser)
    {   Student students= (Student)currentUser;
        Page<Follow>pageFl=followRepository.findAllByStudentId(students.getId(),pageable);
        Page<FollowResponse>page=pageFl.map(followMapper::toResponse);
        return pageMapper.toPageResponse(page);
    }
}
