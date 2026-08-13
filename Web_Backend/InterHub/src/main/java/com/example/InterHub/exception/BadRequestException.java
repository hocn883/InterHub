package com.example.InterHub.exception;

/**
 * Request không hợp lệ.
 */
public class BadRequestException extends RuntimeException{

    public BadRequestException(String message){
        super(message);
    }
}