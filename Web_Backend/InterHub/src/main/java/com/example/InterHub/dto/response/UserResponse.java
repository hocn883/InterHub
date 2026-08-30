package com.example.InterHub.dto.response;

import com.example.InterHub.enums.Gender;
import com.example.InterHub.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String avatarUrl;
    private UserRole role;
    private String email;
    private String phone;
    private Gender gender;
}
