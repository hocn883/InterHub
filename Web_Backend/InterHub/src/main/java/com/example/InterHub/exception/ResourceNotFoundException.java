package com.example.InterHub.exception;

/**
 * Không tìm thấy dữ liệu.
 */
public class ResourceNotFoundException extends RuntimeException{

    public ResourceNotFoundException(String message){
        super(message);
    }
}