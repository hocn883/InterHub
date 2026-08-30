package com.example.InterHub.services.AiGemini;

import com.example.InterHub.dto.request.AiCvScoreRequest;
import com.example.InterHub.dto.response.AiCvScoreResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiCvScoreService {

    private final PdfService pdfService;

    private final PdfImageService pdfImageService;

    private final GeminiService geminiService;

    private final ObjectMapper objectMapper;


    public AiCvScoreResponse scoreCv(
            AiCvScoreRequest request
    ) {

        if (
                request.getFile() == null ||
                        request.getFile().isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "CV không được để trống"
            );
        }


        if (
                request.getTargetPosition() == null ||
                        request.getTargetPosition().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Vị trí ứng tuyển không được để trống"
            );
        }


        // ==========================================
        // STEP 1
        // Đọc text từ PDF
        // ==========================================

        String text =
                pdfService.extractText(
                        request.getFile()
                );


        // ==========================================
        // STEP 2
        // Nếu PDF có text
        // ==========================================

        String aiResult;


        if (
                text != null &&
                        !text.isBlank()
        ) {

            System.out.println(
                    "PDF có text → dùng Gemini Text"
            );


            String prompt =
                    buildTextPrompt(
                            request.getTargetPosition(),
                            text
                    );


            aiResult =
                    geminiService.generate(
                            prompt
                    );

        }


        // ==========================================
        // STEP 3
        // PDF không có text
        // ==========================================

        else {

            System.out.println(
                    "PDF không có text → dùng Gemini Vision"
            );


            List<byte[]> images =
                    pdfImageService.convertToImages(
                            request.getFile()
                    );


            String prompt =
                    buildVisionPrompt(
                            request.getTargetPosition()
                    );


            aiResult =
                    geminiService.generateWithImages(
                            prompt,
                            images
                    );
        }


        // ==========================================
        // STEP 4
        // JSON → Response
        // ==========================================

        String json =
                cleanJson(aiResult);


        try {

            return objectMapper.readValue(
                    json,
                    AiCvScoreResponse.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Gemini trả JSON không hợp lệ: "
                            + json,
                    e
            );
        }
    }

    private String buildTextPrompt(
            String position,
            String cvText
    ) {

        return """
                Bạn là chuyên gia tuyển dụng.
                
                Hãy đánh giá CV dưới đây đối với vị trí:
                
                %s
                
                CV:
                
                %s
                
                Hãy đánh giá:
                
                1. Mức độ phù hợp với vị trí.
                2. Kỹ năng.
                3. Học vấn.
                4. Kinh nghiệm.
                5. Dự án.
                6. Cách trình bày nội dung.
                7. Những điểm mạnh.
                8. Những điểm yếu.
                9. Những gì cần cải thiện.
                
                Chấm điểm từ 0 đến 100.
                
                Không được bịa thông tin.
                
                Nếu CV không có kinh nghiệm thì phải ghi rõ
                là chưa có kinh nghiệm.
                
                Chỉ trả về JSON.
                
                Format:
                
                {
                  "score": 0,
                  "summary": "...",
                  "strengths": [],
                  "weaknesses": [],
                  "suggestions": []
                }
                """.formatted(
                position,
                cvText
        );
    }

    private String buildVisionPrompt(
            String position
    ) {

        return """
                Bạn là chuyên gia tuyển dụng.
                
                Các hình ảnh được gửi kèm là toàn bộ các trang
                của một CV.
                
                Hãy đọc và phân tích toàn bộ CV trong hình ảnh.
                
                Vị trí ứng tuyển:
                
                %s
                
                Hãy đánh giá:
                
                - Nội dung CV
                - Kỹ năng
                - Học vấn
                - Kinh nghiệm
                - Dự án
                - Mức độ phù hợp với vị trí
                - Bố cục
                - Cách trình bày
                - Những điểm mạnh
                - Những điểm yếu
                - Đề xuất cải thiện
                
                Chấm điểm từ 0 đến 100.
                
                Không được bịa thông tin.
                
                Chỉ trả về JSON:
                
                {
                  "score": 0,
                  "summary": "...",
                  "strengths": [],
                  "weaknesses": [],
                  "suggestions": []
                }
                """.formatted(
                position
        );
    }
    private String cleanJson(
            String text
    ) {

        text = text.trim();

        if (text.startsWith("```json")) {

            text =
                    text.substring(7)
                            .trim();
        }

        if (text.startsWith("```")) {

            text =
                    text.substring(3)
                            .trim();
        }

        if (text.endsWith("```")) {

            text =
                    text.substring(
                            0,
                            text.length() - 3
                    ).trim();
        }

        return text;
    }
}
