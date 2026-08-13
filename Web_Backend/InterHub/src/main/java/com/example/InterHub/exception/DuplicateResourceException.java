package com.example.InterHub.exception;

/**
 * Dữ liệu đã tồn tại.
 */
public class DuplicateResourceException extends RuntimeException{

    public DuplicateResourceException(String message){
        super(message);
    }
}