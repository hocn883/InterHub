package com.example.InterHub.services.AiGemini;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.rendering.ImageType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class PdfImageService {

    public List<byte[]> convertToImages(
            MultipartFile file
    ) {

        try {

            byte[] bytes =
                    file.getBytes();

            PDDocument document =
                    Loader.loadPDF(bytes);

            PDFRenderer renderer =
                    new PDFRenderer(document);

            List<byte[]> images =
                    new ArrayList<>();

            for (
                    int i = 0;
                    i < document.getNumberOfPages();
                    i++
            ) {

                BufferedImage image =
                        renderer.renderImageWithDPI(
                                i,
                                150,
                                ImageType.RGB
                        );

                ByteArrayOutputStream output =
                        new ByteArrayOutputStream();

                ImageIO.write(
                        image,
                        "png",
                        output
                );

                images.add(
                        output.toByteArray()
                );
            }

            document.close();

            return images;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Không thể chuyển PDF thành hình ảnh",
                    e
            );
        }
    }
}