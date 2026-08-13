package com.example.InterHub.services.cloudinary;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class FileUpload {

    private String url;

    private String publicId;

    private String resourceType;

    private String originalFilename;
}