package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

// 어디서 예외가 나도 { isSuccess, code, message, result } 형식으로 돌려줘요.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // DTO 검증 실패 (@Valid) → 400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4001", message));
    }

    // JSON 형식이 깨졌거나 타입이 맞지 않는 요청 본문 (예: "score": "다섯") → 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotReadable(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4002", "요청 본문의 형식이 올바르지 않습니다."));
    }

    // 사전 중복 체크를 통과했지만 DB UNIQUE 제약에 걸린 경우 → 409
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.failure("COMMON4091", "이미 존재하는 데이터입니다."));
    }

    // 서비스의 중복 검사 실패 (이메일·닉네임·평점) → 409
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.failure("COMMON4092", exception.getMessage()));
    }

    // 서비스에서 상태 코드를 정해 던진 예외 (404, 403 등)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException exception) {
        int status = exception.getStatusCode().value();
        return ResponseEntity.status(status).body(ApiResponse.failure("COMMON" + status, exception.getReason()));
    }
}
