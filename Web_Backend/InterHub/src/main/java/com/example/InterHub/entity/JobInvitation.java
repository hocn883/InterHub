package com.example.InterHub.entity;
import com.example.InterHub.enums.JobInvitationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "job_Invitations",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "job_id"})
}
)
public class JobInvitation extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Job job;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cv_id")
    private CvUpload cv;
    @Column(length=1000)
    private String title;
    @Column(length = 1000)
    private String message;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private JobInvitationStatus status = JobInvitationStatus.PENDING;
}