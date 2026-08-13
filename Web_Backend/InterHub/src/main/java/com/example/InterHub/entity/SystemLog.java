package com.example.InterHub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "system_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemLog extends BaseEntity {
    private Long userId;
    private String username;
    @Column(nullable = false, length = 100)
    private String action;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
}