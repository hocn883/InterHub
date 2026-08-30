package com.example.InterHub.services.AiGemini;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PdfService {

    public String extractText(
            MultipartFile file
    ) {

        try {

            byte[] bytes =
                    file.getBytes();

            PDDocument document =
                    Loader.loadPDF(bytes);

            PDFTextStripper stripper =
                    new PDFTextStripper();

            String text =
                    stripper.getText(document);

            document.close();

            return text;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Không thể đọc file PDF",
                    e
            );
        }
    }
}