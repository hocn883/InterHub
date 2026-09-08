package com.example.InterHub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Getter
@Setter
@MappedSuperclass
public class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean active=true;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    @PrePersist
    public void prePersist() {
        LocalDateTime now =
                LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        createdDate = now;
        updateDate = now;
    }
    @PreUpdate
    public void preUpdate() {
        updateDate =
                LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
    }
}
