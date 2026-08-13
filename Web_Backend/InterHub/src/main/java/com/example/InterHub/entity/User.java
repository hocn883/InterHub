package com.example.InterHub.entity;

import com.example.InterHub.enums.Gender;
import com.example.InterHub.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public abstract class User extends BaseEntity {
    @Column(nullable=false, length=100)
    private String fullName;
    @Column(length = 500)
    private String avatarUrl;
    @Column(nullable=false,unique=true)
    private String username;
    @Column(nullable=false)
    private String password;
    @Column(nullable=false,unique=true,length=120)
    private String email;
    @Column(nullable=false,unique=true,length=20)
    private String phone;
    @Enumerated(EnumType.STRING)
    private UserRole role;
    @Enumerated(EnumType.STRING)
    private Gender gender;
}
