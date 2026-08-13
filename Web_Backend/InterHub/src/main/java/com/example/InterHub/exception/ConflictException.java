package com.example.InterHub.exception;

/**
 * Xung đột dữ liệu.
 */
public class ConflictException extends RuntimeException{

    public ConflictException(String message){
        super(message);
    }
}