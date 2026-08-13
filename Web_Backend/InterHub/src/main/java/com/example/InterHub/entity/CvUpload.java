package com.example.InterHub.entity;

import com.example.InterHub.enums.CVStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CvUpload extends BaseEntity  {
    @Column(nullable = false)
    private String fileUrl;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="student_id")
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="lecturer_id")
    private Lecturer lecturer;
    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    @Builder.Default
    private CVStatus status=CVStatus.PENDING;
    @Column(columnDefinition="TEXT")
    private String lecturerFeedback;
}
