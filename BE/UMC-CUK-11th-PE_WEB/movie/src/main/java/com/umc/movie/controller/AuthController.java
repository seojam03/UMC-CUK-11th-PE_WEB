package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// 9주차: Swagger 문서용 어노테이션을 붙였어요. (@Tag = 문서에서 묶일 그룹, @Operation = API 한 줄 설명)
// 우리 프로젝트에도 ApiResponse(공통 응답 DTO)가 있어서, Swagger의 ApiResponse는 전체 이름으로 써요.
@Tag(name = "인증", description = "로그인과 토큰 발급 API")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "이메일 로그인",
            description = "이메일과 비밀번호로 로그인하고 Access Token을 발급받습니다. "
                    + "발급받은 토큰은 위쪽 Authorize 버튼에 넣어두면 인증이 필요한 API에 자동으로 실립니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "로그인 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "COMMON4001 - 이메일 형식 오류 또는 빈 값",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {"isSuccess": false, "code": "COMMON4001", "message": "이메일 형식이 올바르지 않습니다.", "result": null}
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "AUTH401_1 - 이메일 또는 비밀번호 불일치",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {"isSuccess": false, "code": "AUTH401_1", "message": "이메일 또는 비밀번호가 올바르지 않습니다.", "result": null}
                            """)))
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", response));
    }
}
