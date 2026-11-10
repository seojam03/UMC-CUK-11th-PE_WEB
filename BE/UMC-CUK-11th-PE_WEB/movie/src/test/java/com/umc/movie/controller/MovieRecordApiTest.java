package com.umc.movie.controller;

import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// (선택 미션) 평점 + 즐겨찾기를 한 번에 저장하다 즐겨찾기에서 실패하면 평점도 rollback되는지 확인해요.
//
// 이 클래스에는 일부러 @Transactional을 붙이지 않았어요.
// 붙이면 서비스의 트랜잭션이 테스트 트랜잭션에 합류해서, 서비스가 예외를 던져도 INSERT가 테스트가 끝날 때까지
// 같은 트랜잭션 안에 남아 있어요. 그러면 "평점 개수 그대로"를 확인할 수 없어요.
// 대신 테스트가 끝날 때마다 @AfterEach에서 직접 지워요.
@SpringBootTest
@AutoConfigureMockMvc
class MovieRecordApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Member member;
    private String accessToken;

    @BeforeEach
    void setUp() {
        member = memberRepository.save(Member.builder()
                .email("record@umc.com")
                .password("encoded-password")
                .nickname("기록왕")
                .build());

        accessToken = "Bearer " + jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
    }

    @AfterEach
    void tearDown() {
        // 자식(평점, 즐겨찾기)부터 지워야 회원 FK에 걸리지 않아요.
        ratingRepository.deleteAll();
        favoriteRepository.deleteAll();
        memberRepository.deleteAll();
    }

    @Test
    @DisplayName("이미 즐겨찾기한 영화로 기록을 저장하면 409가 나고 먼저 저장한 평점도 rollback된다")
    void rollbackRatingWhenFavoriteFails() throws Exception {
        // given: 영화 550은 이미 즐겨찾기한 상태
        favoriteRepository.save(Favorite.builder().member(member).movieId(550L).build());
        long ratingCountBefore = ratingRepository.count();

        // when: 평점 저장 → 즐겨찾기 중복으로 예외
        mockMvc.perform(post("/movie-records")
                        .header(HttpHeaders.AUTHORIZATION, accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"movieId": 550, "score": 5, "comment": "인생 영화예요.", "addToFavorites": true}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));

        // then: 평점 개수가 그대로예요.
        assertThat(ratingRepository.count()).isEqualTo(ratingCountBefore);
    }
}
