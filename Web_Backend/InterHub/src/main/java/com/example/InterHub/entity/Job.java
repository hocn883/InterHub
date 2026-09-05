package com.example.InterHub.entity;

import com.example.InterHub.enums.JobStatus;
import jakarta.persistence.*;
import lombok.*;

import javax.xml.stream.events.Comment;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Builder
@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Job extends BaseEntity {
    @Column(nullable=false,length=200)
    private String title;
    @Column(nullable=false,columnDefinition = "TEXT")
    private String description;
    @Column(columnDefinition = "TEXT")
    private String requirements;
    @Column(nullable=false)
    private LocalDate deadline;
    @Column(nullable=false)
    private BigDecimal salary;
    @Column(nullable=false)
    private LocalDate startDate;
    @Column(nullable=false)
    private LocalDate endDate;
    @Column(nullable=false)
    private Integer quantity;
    @Column(nullable=false)
    private String location;
    @Column(nullable=false)
    private Double longitude;
    @Column(nullable=false)
    private Double latitude;
    @ManyToOne(fetch=FetchType.LAZY,optional=false)
    @JoinColumn(name = "employer_id",nullable=false)
    private Employer employer;
    @Enumerated(EnumType.STRING)
    @Column(nullable=false,length=20)
    @Builder.Default
    private JobStatus status = JobStatus.OPEN;
    @Builder.Default
    @OneToMany(
            mappedBy = "job",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private List<Application>applications=new ArrayList<>();
    @OneToMany(mappedBy="job")
    @Builder.Default
    private List<JobReview> reviews=new ArrayList<>();

}
