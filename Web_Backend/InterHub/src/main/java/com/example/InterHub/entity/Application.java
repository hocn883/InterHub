package com.example.InterHub.entity;

import com.example.InterHub.enums.ApplicationSource;
import com.example.InterHub.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"student_id", "job_id"}
                )
        }
)
public class Application extends BaseEntity {
    private String coverLetter;
    @Column(name = "file_path", length = 1000)
    private String fileCv;
    @ManyToOne(fetch=FetchType.LAZY,optional=false)
    @JoinColumn(name="student_id")
    private Student student;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ApplicationStatus status=ApplicationStatus.PENDING;
    @ManyToOne(fetch=FetchType.LAZY,optional=false)
    @JoinColumn(name="job_id")
    private Job job;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ApplicationSource source = ApplicationSource.STUDENT_APPLIED;
}
