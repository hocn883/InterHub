package com.example.InterHub.dto.response;

import com.example.InterHub.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
 private String acesToken;
 private String tokenType;
 private UserResponse userResponse;
}
