package com.umc.movie.config;

import com.umc.movie.interceptor.AuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해
                // UMCine(Vite 개발 서버)와 9주차에 옮긴 UMCine Next.js 개발 서버 출처만 허용
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                // 전부 잠그고, 로그인 없이 써야 하는 경로만 열어요. 새 API를 깜빡해도 잠긴 채로 남아요.
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/auth/**",              // 로그인
                        "/members",              // 회원가입 (POST /members)
                        "/members/nickname/**",  // 닉네임 중복 체크
                        "/members/email/**",     // 이메일 중복 체크
                        "/members/*/ratings",    // 유저별 평점 조회 (공개 목록)
                        "/error",                // 스프링 내부 오류 경로
                        // 9주차: 문서 화면은 로그인 전에도 봐야 해요.
                        // /swagger-ui.html로 들어오면 /swagger-ui/index.html로 보내 주므로 두 패턴이 모두 필요해요.
                        "/swagger-ui.html",      // Swagger UI로 보내 주는 주소
                        "/swagger-ui/**",        // Swagger UI 화면
                        "/v3/api-docs/**"        // Swagger UI가 읽어 가는 API 문서(JSON)
                );
    }
}
