package com.example.InterHub.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JobInvitationRequest {
    @NotNull
    private Long cvId;
    @NotNull
    private String title;
    @NotNull
    private String message;
}
