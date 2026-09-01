package com.example.InterHub.controller.user;

import com.example.InterHub.dto.request.UpdateProfileRequest;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapping;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/update-profile")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @PatchMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    private ResponseEntity<UserResponse>updateProfile(
            @Valid @ModelAttribute UpdateProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    )
    {
        return ResponseEntity.ok(userService.updateProfile(currentUser.getUser(),request));
    }
}
