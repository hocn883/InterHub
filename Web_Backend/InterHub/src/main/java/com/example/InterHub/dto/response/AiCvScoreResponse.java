package com.example.InterHub.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCvScoreResponse {

    private Integer score;

    private String summary;

    private List<String> strengths;

    private List<String> weaknesses;

    private List<String> suggestions;
}