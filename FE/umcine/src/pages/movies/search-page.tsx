import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const ITEMS_PER_PAGE = 15; // 한 페이지당 보여줄 영화 개수
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f6f7f9] text-[#17191f]">
      {!normalizedQuery ? (
        <section className="mx-auto w-[min(calc(100%-32px),368px)] pt-[98px]">
          <h1 className="mb-5 text-center text-[30px] font-bold tracking-[-1px]">어떤 영화를 찾고 있나요?</h1>
          <SearchForm
            searchText={searchText}
            onChange={setSearchText}
            onSubmit={handleSubmit}
          />
        </section>
      ) : (
        <section className="mx-auto min-h-[calc(100vh-56px)] w-[min(calc(100%-76px),900px)] pt-[13px] max-[700px]:w-[calc(100%-32px)]">
          <h1 className="mb-[10px] text-[19px] font-bold tracking-[-0.7px]">영화 검색</h1>
          <ReSearchForm
            searchText={searchText}
            onChange={setSearchText}
            onSubmit={handleSubmit}
            onClear={() => navigate({ search: {} })}
          />

          <div className="flex items-baseline gap-[7px] border-b border-[#e4e6ea] py-[13px] pb-2">
            <h2 className="text-[10px] font-bold">‘{query}’ 검색 결과</h2>
            <span className="text-[8px] text-[#a2a7b0] ml-auto">영화 {searchResults.length}편 · {totalPages}페이지</span>
          </div>
          {searchResults.length === 0 ? (
            <p className="py-[45px] text-center text-[10px] text-[#8e949e]">검색 결과가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-[42px] max-[700px]:grid-cols-1">
              {searchResults.map((movie) => (
                <li className="grid min-h-[111px] min-w-0 grid-cols-[59px_minmax(0,1fr)] gap-x-[10px] border-b border-[#e4e6ea] px-0 py-[10px] pb-3" key={movie.id}>
                  <img className="h-[88px] w-[59px] rounded object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
                  <div className="min-w-0">
                    <h3 className="mt-px overflow-hidden text-ellipsis whitespace-nowrap text-[9px]">{movie.title}</h3>
                    <p className="mb-[7px] mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[7px] text-[#9aa0aa]">{movie.originalTitle} · {movie.releaseDate}</p>
                    <p className="line-clamp-2 overflow-hidden text-[7px] leading-[1.45] text-[#777d87]">{movie.overview}</p>
                  </div>
                  <Link
                    className="col-start-2 self-end text-[7px] font-bold text-[#4c63d9] no-underline"
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    상세 보기 →
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <footer className="mt-[30px] flex min-h-[32px] items-center justify-end text-[8px] text-[#8e949e] max-[700px]:justify-center max-[700px]:text-center">이 제품은 TMDB API를 사용하지만 TMDB에서 보증하거나 인증하지 않았습니다.</footer>
        </section>
      )}
    </main>
  );
}

type SearchFormProps = {
  searchText: string;
  onChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onClear?: () => void;
};

function SearchForm({ searchText, onChange, onSubmit, onClear }: SearchFormProps) {
  return (
    <form className={`flex items-center gap-2 rounded-[6px] border bg-white px-2 pl-[11px] focus-within:ring-2 focus-within:ring-[#4c63d9]/30 ${onClear ? "h-[29px] border-[#dfe2e7] shadow-none" : "h-9 border-[#22252b] shadow-[0_3px_8px_rgba(23,25,31,0.1)]"}`} onSubmit={onSubmit}>
      <img className="h-[13px] w-[13px] opacity-75" src="/icons/movie-icons/search.svg" alt="" />
      <input
        className="min-w-0 flex-1 bg-transparent p-0 text-[9px] text-[#343840] outline-none placeholder:text-[#9da3ad]"
        aria-label="검색어"
        value={searchText}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예: 스파이더맨"
      />
      {onClear && searchText && (
        <button className="p-0 text-[18px] leading-none text-[#7d838d]" type="button" onClick={onClear} aria-label="검색어 지우기">×</button>
      )}
      <button className="h-[23px] w-[29px] rounded bg-[#17191f] p-0 text-[8px] font-bold text-white" type="submit">검색</button>
    </form>
  );
}

function ReSearchForm({ searchText, onChange, onSubmit, onClear }: SearchFormProps) {
  return (
    <form className={`flex items-center gap-2 rounded-[6px] border bg-white px-2 pl-[11px] focus-within:ring-2 focus-within:ring-[#4c63d9]/30 ${onClear ? "h-[29px] border-[#dfe2e7] shadow-none" : "h-9 border-[#22252b] shadow-[0_3px_8px_rgba(23,25,31,0.1)]"}`} onSubmit={onSubmit}>
      <img className="h-[13px] w-[13px] opacity-75" src="/icons/movie-icons/search.svg" alt="" />
      <input
        className="min-w-0 flex-1 bg-transparent p-0 text-[9px] text-[#343840] outline-none placeholder:text-[#9da3ad]"
        aria-label="검색어"
        value={searchText}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예: 스파이더맨"
      />
      {onClear && searchText && (
        <button className="p-0 text-[18px] leading-none text-[#7d838d]" type="button" onClick={onClear} aria-label="검색어 지우기">×</button>
      )}
      <button className="h-[23px] w-[45px] rounded bg-[#17191f] p-0 text-[8px] font-bold text-white" type="submit">다시 검색</button>
    </form>
  );
}