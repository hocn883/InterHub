package com.example.InterHub.controller;

import com.example.InterHub.dto.request.LoginRequest;
import com.example.InterHub.dto.request.RegisterRequest;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.AuthResponse;
import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.services.AuthService;
import com.example.InterHub.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping(
            value = "/register",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @ModelAttribute RegisterRequest request
    ) {
        AuthResponse response = authService.register(request);

        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .code(HttpStatus.CREATED.value())
                .status(HttpStatus.CREATED.name())
                .message("Tạo tài khoản thành công")
                .result(response)
                .build());
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.<AuthResponse>builder()
                                .code(HttpStatus.OK.value())
                                        .status(HttpStatus.OK.name())
                                                .message("Đăng nhập thành công")
                                                        .result(authService.login(request))
                                                                .build()
        );
    }
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>>me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String username=userDetails.getUser().getUsername();
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Thong tin cua user dang nhap")
                        .result(userService.getCurrentUser(username))
                        .build()
        );
    }
}
