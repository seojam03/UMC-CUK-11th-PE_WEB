package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

// 9주차 미션: 평점 서비스의 실패 규칙 두 가지(중복 등록, 남의 평점 수정)를 단위 테스트로 고정해요.
@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    // memberId는 DB가 만들어 주는 값이라 setter가 없어요. 테스트에서는 리플렉션으로 직접 넣어요.
    private Member createMember(Long memberId, String nickname) {
        Member member = Member.builder()
                .email(nickname + "@umc.com")
                .password("encoded-password")
                .nickname(nickname)
                .build();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        return member;
    }

    @Test
    @DisplayName("이미 평점을 남긴 영화에 다시 등록하면 RATING409_1 예외가 나고 저장하지 않는다")
    void createRatingWhenDuplicated() {
        // given
        Long memberId = 1L;
        Member member = createMember(memberId, "영화조아");
        CreateRatingRequest request = new CreateRatingRequest(550L, 5, "다시 봐도 재밌어요.");

        given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(memberId, 550L)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> ratingService.create(memberId, request))
                .isInstanceOf(ApiException.class)
                .hasMessage("이미 이 영화에 평점을 남기셨습니다.")
                .satisfies(e -> {
                    ApiException exception = (ApiException) e;
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(exception.getCode()).isEqualTo("RATING409_1");
                });

        verify(ratingRepository, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 RATING403_1 예외가 나고 평점은 바뀌지 않는다")
    void updateOthersRating() {
        // given
        Member owner = createMember(1L, "작성자");
        Long otherMemberId = 2L;
        Rating rating = Rating.builder()
                .member(owner)
                .movieId(550L)
                .score(5)
                .comment("원래 후기")
                .build();

        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));

        // when & then
        assertThatThrownBy(() -> ratingService.update(otherMemberId, 10L, new UpdateRatingRequest(1, "남이 바꾼 후기")))
                .isInstanceOf(ApiException.class)
                .hasMessage("본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.")
                .satisfies(e -> {
                    ApiException exception = (ApiException) e;
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getCode()).isEqualTo("RATING403_1");
                });

        assertThat(rating.getScore()).isEqualTo(5);
        assertThat(rating.getComment()).isEqualTo("원래 후기");
        verify(ratingRepository, never()).saveAndFlush(any());
    }
}
