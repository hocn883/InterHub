package com.example.InterHub.services.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    private static final long MAX_AVATAR_SIZE = 100 * 1024 * 1024;

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );
    private final Cloudinary cloudinary;
    public FileUpload uploadCv(MultipartFile file) {
        validateCv(file);

        try {
            String originalFilename = file.getOriginalFilename();

            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "interhub/cvs",
                            "public_id", originalFilename,
                            "resource_type", "raw"
                    )
            );

            return new FileUpload(
                    result.get("secure_url").toString(),
                    result.get("public_id").toString(),
                    result.get("resource_type").toString(),
                    originalFilename
            );

        } catch (IOException exception) {
            throw new RuntimeException(
                    "Không thể upload CV lên Cloudinary",
                    exception
            );
        }
    }

    private void validateCv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "File CV không được để trống"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File CV không được vượt quá 10 MB"
            );
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException(
                    "Chỉ chấp nhận file PDF, DOC hoặc DOCX"
            );
        }
    }
    public FileUpload uploadAvatar(MultipartFile file) {
        try {
            String publicId = UUID.randomUUID().toString();

            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "interhub/avatars",
                            "public_id", publicId,
                            "resource_type", "image"
                    )
            );

            return new FileUpload(
                    result.get("secure_url").toString(),
                    result.get("public_id").toString(),
                    result.get("resource_type").toString(),
                    file.getOriginalFilename()
            );

        } catch (IOException exception) {
            throw new RuntimeException(
                    "Không thể upload avatar lên Cloudinary",
                    exception
            );
        }
    }
}