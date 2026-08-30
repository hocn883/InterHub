package com.example.InterHub.services.AiGemini;

import com.example.InterHub.dto.request.AiGenerateCvRequest;
import com.example.InterHub.dto.response.AiGenerateCvResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiCvService {

    private final GeminiService geminiService;

    private final ObjectMapper objectMapper;


    public AiGenerateCvResponse generateCv(
            AiGenerateCvRequest request
    ) {
        String prompt =
                buildPrompt(request);
        String aiResult =
                geminiService.generate(prompt);
        AiGenerateCvResponse aiContent;

        try {

            aiContent =
                    objectMapper.readValue(
                            aiResult,
                            AiGenerateCvResponse.class
                    );

        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "Gemini trả về JSON không hợp lệ",
                    e
            );
        }
        return AiGenerateCvResponse.builder()

                .fullName(
                        request.getFullName()
                )

                .email(
                        request.getEmail()
                )

                .phone(
                        request.getPhone()
                )

                .targetPosition(
                        request.getTargetPosition()
                )

                .careerObjective(
                        aiContent.getCareerObjective()
                )

                .summary(
                        aiContent.getSummary()
                )

                .skills(
                        aiContent.getSkills()
                )

                .education(
                        aiContent.getEducation()
                )

                .projects(
                        aiContent.getProjects()
                )

                .experience(
                        aiContent.getExperience()
                )

                .build();
    }

    private String buildPrompt(
            AiGenerateCvRequest request
    ) {

        return """
                Bạn là chuyên gia viết CV chuyên nghiệp.
                
                Hãy phân tích thông tin người dùng và viết lại nội dung
                CV phù hợp với vị trí ứng tuyển.
                
                MỤC TIÊU:
                
                - Nội dung chuyên nghiệp.
                - Ngắn gọn.
                - Dễ đọc.
                - Phù hợp với vị trí ứng tuyển.
                - Không bịa thông tin.
                - Không thêm công nghệ người dùng chưa cung cấp.
                - Không thêm kinh nghiệm người dùng chưa có.
                
                
                THÔNG TIN NGƯỜI DÙNG:
                
                Họ tên:
                %s
                
                Email:
                %s
                
                Số điện thoại:
                %s
                
                Chuyên ngành:
                %s
                
                Vị trí ứng tuyển:
                %s
                
                Kỹ năng:
                %s
                
                Học vấn:
                %s
                
                Dự án:
                %s
                
                Kinh nghiệm:
                %s
                
                
                QUY TẮC:
                
                Nếu người dùng chưa có kinh nghiệm:
                hãy viết phù hợp với sinh viên chưa có kinh nghiệm.
                
                Nếu người dùng chưa có dự án:
                không được bịa dự án.
                
                Có thể viết lại câu chữ của người dùng
                nhưng không được thay đổi sự thật.
                
                Không sử dụng Markdown.
                
                Không sử dụng ```.
                
                Không giải thích.
                
                Không viết thêm nội dung ngoài JSON.
                
                
                BẮT BUỘC trả về JSON đúng cấu trúc:
                
                {
                  "careerObjective": "nội dung mục tiêu nghề nghiệp",
                  "summary": "nội dung giới thiệu bản thân",
                  "skills": "danh sách kỹ năng phù hợp",
                  "education": "nội dung học vấn",
                  "projects": "nội dung dự án",
                  "experience": "nội dung kinh nghiệm"
                }
                
                Mỗi field phải chứa CHỈ nội dung của chính field đó.
                
                Ví dụ:
                
                careerObjective chỉ chứa mục tiêu nghề nghiệp.
                
                summary chỉ chứa giới thiệu bản thân.
                
                skills chỉ chứa kỹ năng.
                
                education chỉ chứa học vấn.
                
                projects chỉ chứa dự án.
                
                experience chỉ chứa kinh nghiệm.
                KHÔNG được đặt toàn bộ JSON
                vào một field.
                """.formatted(

                request.getFullName(),

                request.getEmail(),

                request.getPhone(),

                request.getMajor(),

                request.getTargetPosition(),

                request.getSkills(),

                request.getEducation(),

                request.getProjects(),

                request.getExperience()
        );
    }
}