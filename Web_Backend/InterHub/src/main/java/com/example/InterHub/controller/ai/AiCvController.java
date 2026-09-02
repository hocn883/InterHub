package com.example.InterHub.controller.ai;
import com.example.InterHub.dto.request.AiCvScoreRequest;
import com.example.InterHub.dto.request.AiGenerateCvRequest;
import com.example.InterHub.dto.response.AiCvScoreResponse;
import com.example.InterHub.dto.response.AiGenerateCvResponse;
import com.example.InterHub.services.AiGemini.AiCvScoreService;
import com.example.InterHub.services.AiGemini.AiCvService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiCvController {
    private final AiCvService aiCvService;
    private final AiCvScoreService aiCvScoreService;
    @PostMapping("/generate-cv")
    public AiGenerateCvResponse generateCv(
            @RequestBody AiGenerateCvRequest request
    ) {
        return aiCvService.generateCv(request);
    }
    @PostMapping(
            value = "/cv/score",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<AiCvScoreResponse> scoreCv(
            @ModelAttribute AiCvScoreRequest request
    ) {
        AiCvScoreResponse response = aiCvScoreService.scoreCv(request);
        return ResponseEntity.ok(response);
    }
}