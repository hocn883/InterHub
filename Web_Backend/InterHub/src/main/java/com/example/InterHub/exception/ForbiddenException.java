package com.example.InterHub.exception;

/**
 * Không có quyền.
 */
public class ForbiddenException extends RuntimeException{

    public ForbiddenException(String message){
        super(message);
    }
}