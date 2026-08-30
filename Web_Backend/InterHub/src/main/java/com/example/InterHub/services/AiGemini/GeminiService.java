package com.example.InterHub.services.AiGemini;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient;

    public GeminiService() {
        this.restClient = RestClient.create();
    }

    public String generate(String prompt) {

        Map<String, Object> requestBody = Map.of(

                "contents",
                List.of(
                        Map.of(
                                "parts",
                                List.of(
                                        Map.of(
                                                "text",
                                                prompt
                                        )
                                )
                        )
                )
        );

        Map response = restClient
                .post()
                .uri(
                        "https://generativelanguage.googleapis.com"
                                + "/v1beta/models/gemini-3.5-flash:generateContent"
                                + "?key="
                                + apiKey
                )
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        return extractText(response);
    }
    public String generateWithImages(
            String prompt,
            List<byte[]> images
    ) {

        List<Map<String, Object>> parts =
                new ArrayList<>();

        parts.add(
                Map.of(
                        "text",
                        prompt
                )
        );

        for (byte[] image : images) {

            String base64 =
                    Base64.getEncoder()
                            .encodeToString(image);

            parts.add(
                    Map.of(
                            "inline_data",
                            Map.of(
                                    "mime_type",
                                    "image/png",
                                    "data",
                                    base64
                            )
                    )
            );
        }

        Map<String, Object> body =
                Map.of(
                        "contents",
                        List.of(
                                Map.of(
                                        "parts",
                                        parts
                                )
                        )
                );

        Map response =
                restClient
                        .post()
                        .uri(
                                "https://generativelanguage.googleapis.com"
                                        + "/v1beta/models/gemini-3.5-flash:generateContent"
                                        + "?key="
                                        + apiKey
                        )
                        .body(body)
                        .retrieve()
                        .body(Map.class);

        return extractText(response);
    }

    private String extractText(Map response) {

        if (response == null) {
            throw new RuntimeException(
                    "Gemini trả về response null"
            );
        }

        List candidates =
                (List) response.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            throw new RuntimeException(
                    "Gemini không trả về candidates"
            );
        }

        Map candidate =
                (Map) candidates.get(0);

        Map content =
                (Map) candidate.get("content");

        if (content == null) {
            throw new RuntimeException(
                    "Gemini không trả về content"
            );
        }

        List parts =
                (List) content.get("parts");

        if (parts == null || parts.isEmpty()) {
            throw new RuntimeException(
                    "Gemini không trả về parts"
            );
        }

        Map part =
                (Map) parts.get(0);

        Object text =
                part.get("text");

        if (text == null) {
            throw new RuntimeException(
                    "Gemini không trả về text"
            );
        }

        return text.toString();
    }
}