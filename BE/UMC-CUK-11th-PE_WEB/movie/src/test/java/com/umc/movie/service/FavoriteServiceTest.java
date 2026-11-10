package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

// 스프링을 띄우지 않고 FavoriteService 하나만 검사하는 단위 테스트예요.
// Repository는 진짜 DB 대신 Mock(가짜 객체)으로 바꾸고, 필요한 대답만 미리 정해 둬요.
@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks // 위의 Mock들을 생성자에 넣어서 진짜 FavoriteService를 만들어요.
    private FavoriteService favoriteService;

    @Test
    @DisplayName("즐겨찾기하지 않은 영화면 즐겨찾기를 저장한다")
    void createFavorite() {
        // given
        Long memberId = 1L;
        Member member = Member.builder()
                .email("challenger@umc.com")
                .password("encoded-password")
                .nickname("영화조아")
                .build();
        Favorite favorite = Favorite.builder()
                .member(member)
                .movieId(550L)
                .build();

        given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
        given(favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, 550L)).willReturn(false);
        given(favoriteRepository.save(any(Favorite.class))).willReturn(favorite);

        // when
        FavoriteResponse response = favoriteService.create(memberId, new CreateFavoriteRequest(550L));

        // then
        assertThat(response.movieId()).isEqualTo(550L);
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    @DisplayName("이미 즐겨찾기한 영화면 FAVORITE409_1 예외가 나고 저장하지 않는다")
    void createFavoriteWhenDuplicated() {
        // given
        Long memberId = 1L;
        Member member = Member.builder()
                .email("challenger@umc.com")
                .password("encoded-password")
                .nickname("영화조아")
                .build();

        given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
        given(favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, 550L)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> favoriteService.create(memberId, new CreateFavoriteRequest(550L)))
                .isInstanceOf(ApiException.class)
                .hasMessage("이미 이 영화를 즐겨찾기하셨습니다.")
                .extracting("code").isEqualTo("FAVORITE409_1");

        verify(favoriteRepository, never()).save(any());
    }
}
