package com.umc.movie.dto;

// 엔티티를 그대로 돌려주면 password까지 나가므로 필요한 값만 담아요.
public record MemberResponse(
        Long memberId,
        String email,
        String nickname
) {}
