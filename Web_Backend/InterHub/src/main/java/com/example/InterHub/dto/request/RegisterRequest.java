package com.example.InterHub.dto.request;

import com.example.InterHub.enums.Gender;
import com.example.InterHub.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter

public class RegisterRequest {
    @NotBlank
    private String fullName;
    @NotBlank
    @Size(min=4, max=50)
    private String username;
    @NotNull
    private MultipartFile avatar;
    @NotBlank
    @Size(min=6)
    private String password;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min=8,max=10)
    private String phone;
    @NotNull
    private Gender gender;
    @NotNull
    private UserRole role;
    //Student
    private String mssv;
    private String major;
    private String className;
    //lecturer
    private String lecturerCode;
    //employer
    private String companyName;
    private String taxCode;
    private String location;
}
