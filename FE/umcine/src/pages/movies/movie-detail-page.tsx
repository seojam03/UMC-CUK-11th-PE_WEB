import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
	const { movieId } = useParams({ from: "/movies/$movieId" });
	const movie = movies.find((item) => item.id === Number(movieId));
	const [isBookmarked, setIsBookmarked] = useState(movie?.isBookmarked ?? false);
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");
	const [isReviewSaved, setIsReviewSaved] = useState(false);

	if (!movie) {
		return <main className="p-10 text-center">영화를 찾을 수 없어요.</main>;
	}

	return (
		<main className="min-h-[calc(100vh-56px)] bg-[#f6f7f9] text-[#17191f]">
			<section className="relative h-[244px] overflow-hidden bg-[#20242b] text-white max-[700px]:h-[250px] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,rgba(10,12,16,0.7),rgba(10,12,16,0.05)_75%)] after:content-['']">
				<img src={movie.backdropPath} alt="" aria-hidden="true" className="block h-full w-full object-cover object-[center_38%] brightness-[0.72]" />
				<div className="absolute inset-0 z-[1] mx-auto flex w-[min(calc(100%-104px),862px)] flex-col justify-between box-border py-4 max-[700px]:w-[calc(100%-32px)]">
					<Link to="/" className="text-[10px] text-white no-underline">‹ 영화 목록</Link>
					<div>
						<h1 className="mb-[5px] text-[27px] font-bold leading-[1.15] tracking-[-1.2px]">{movie.title}</h1>
						<p className="mb-1.5 text-[10px]">{movie.originalTitle}</p>
						<div className="flex gap-[9px] text-[9px]">
							<span>{movie.releaseDate}</span><span>{movie.genres.join(" · ")}</span><span>{movie.runtime}</span>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto grid min-h-[346px] w-[min(calc(100%-104px),862px)] grid-cols-[minmax(0,1fr)_220px] gap-5 box-border px-0 pb-[42px] pt-4 max-[700px]:block max-[700px]:w-[calc(100%-32px)]">
				<div className="flex gap-5 max-[700px]:gap-[14px]">
					<img src={movie.posterPath} alt={`${movie.title} 포스터`} className="h-[192px] w-[135px] flex-none rounded-[7px] object-cover shadow-[0_12px_20px_rgba(25,29,38,0.16)] max-[700px]:h-[160px] max-[700px]:w-[112px]" />
					<div className="pt-px">
						<h2 className="mb-3 text-[15px] font-bold leading-[1.3] max-[700px]:text-[13px]">{movie.tagline}</h2>
						<p className="mb-[11px] max-w-[450px] text-[10px] leading-[1.8] text-[#737985] max-[700px]:text-[9px] max-[700px]:leading-[1.6]">{movie.overview}</p>
						<button className="inline-flex h-[29px] items-center gap-[5px] rounded-[5px] bg-[#4c63d9] px-[11px] text-[10px] font-bold text-white" type="button" onClick={() => setIsBookmarked((bookmarked) => !bookmarked)} aria-pressed={isBookmarked}>
							<img className="h-[13px] w-[13px] invert" src={isBookmarked ? "/icons/movie-icons/bookmark.svg" : "/icons/movie-icons/bookmark-outline.svg"} alt="" />
							{isBookmarked ? "찜했어요" : "찜하기"}
						</button>
					</div>
				</div>

				<aside className="border-l border-[#dfe2e7] pl-5 max-[700px]:mt-7 max-[700px]:border-l-0 max-[700px]:border-t max-[700px]:pl-0 max-[700px]:pt-[22px]">
					<h2 className="mb-[5px] text-[14px] font-bold">내 평점</h2>
					<p className="mb-[9px] text-[9px] text-[#9aa0aa]">별점은 필수, 후기는 선택이에요.</p>
					<div className="mb-1.5 flex gap-1" aria-label={`평점 ${rating}점`}>
						{[1, 2, 3, 4, 5].map((star) => (
							<button key={star} type="button" className="grid h-[25px] w-[25px] place-items-center rounded border border-[#dfe2e7] bg-white" onClick={() => setRating(star)} aria-label={`${star}점`}>
								<img className="h-[15px] w-[15px]" src={`/icons/movie-icons/${star <= rating ? "star.svg" : "star-outline.svg"}`} alt="" />
							</button>
						))}
					</div>
					<textarea className="box-border h-[68px] w-full resize-none rounded-[5px] border border-[#dfe2e7] bg-white p-[10px] text-[9px] text-[#50545c] outline-none placeholder:text-[#a8adb6]" value={review} onChange={(event) => setReview(event.target.value)} placeholder="영화를 보고 느낀 점을 남겨보세요." />
					<button className="mt-[7px] h-[27px] w-full rounded-[5px] bg-[#17191f] text-[9px] font-bold text-white" type="button" onClick={() => setIsReviewSaved(true)}>{isReviewSaved ? "평점이 저장되었어요" : "평점 저장"}</button>
				</aside>
			</section>

			<footer className="flex min-h-[32px] items-center justify-end border-t border-[#e7e9ed] bg-white px-12 text-[8px] text-[#8e949e] max-[700px]:justify-center max-[700px]:px-4 max-[700px]:text-center">이 제품은 TMDB API를 사용하지만 TMDB에서 보증하거나 인증하지 않았습니다.</footer>
		</main>
	);
}