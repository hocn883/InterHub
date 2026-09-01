package com.example.InterHub.dto.request;
import com.example.InterHub.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
@Getter
@Setter
public class UpdateProfileRequest {
    @NotBlank
    private String fullName;
    private MultipartFile avatar;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min = 8, max = 10)
    private String phone;
    private Gender gender;
    private String major;
    private String className;
    private String companyName;
    private String location;
}