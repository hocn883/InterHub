package com.example.InterHub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"student_id", "employer_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follow extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "employer_id",
            nullable = false
    )
    private Employer employer;
}