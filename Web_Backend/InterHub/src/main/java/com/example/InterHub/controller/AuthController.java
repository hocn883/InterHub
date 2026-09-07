package com.example.InterHub.controller;

import com.example.InterHub.dto.request.LoginRequest;
import com.example.InterHub.dto.request.RegisterRequest;
import com.example.InterHub.dto.response.ApiResponse;
import com.example.InterHub.dto.response.AuthResponse;
import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.entity.User;
import com.example.InterHub.exception.ResourceNotFoundException;
import com.example.InterHub.repository.UserRepository;
import com.example.InterHub.security.CustomUserDetails;
import com.example.InterHub.security.JwtService;
import com.example.InterHub.services.AuthService;
import com.example.InterHub.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final JwtService jwtService;
    private  final UserRepository userRepository;

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
        AuthResponse authResponse=authService.login(request);
        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy tài khoản"
                        )
                );

        String refreshToken=jwtService.generateRefreshToken(user);
        ResponseCookie refreshCookie = ResponseCookie
                .from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("None")
                .build();

        ApiResponse<AuthResponse> response=
                ApiResponse.<AuthResponse>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Đăng nhập thành công")
                        .result(authResponse)
                        .build();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        refreshCookie.toString()
                )
                .body(response);
    }
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @CookieValue(
                    name = "refreshToken",
                    required = false
            )
            String refreshToken
    ) {
        System.out.println("========== REFRESH CONTROLLER ==========");
        System.out.println("refreshToken = " + refreshToken);

        if (refreshToken == null) {
            System.out.println("========== REFRESH TOKEN NULL ==========");

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            ApiResponse.<AuthResponse>builder()
                                    .code(HttpStatus.UNAUTHORIZED.value())
                                    .status(HttpStatus.UNAUTHORIZED.name())
                                    .message("Không có refresh token")
                                    .build()
                    );
        }

        System.out.println("========== CALL REFRESH SERVICE ==========");

        AuthResponse authResponse =
                authService.refreshToken(refreshToken);

        System.out.println("========== REFRESH SERVICE SUCCESS ==========");

        return ResponseEntity.ok(
                ApiResponse.<AuthResponse>builder()
                        .code(HttpStatus.OK.value())
                        .status(HttpStatus.OK.name())
                        .message("Làm mới token thành công")
                        .result(authResponse)
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
