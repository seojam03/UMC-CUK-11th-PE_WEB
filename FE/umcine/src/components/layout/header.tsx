import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="flex h-[56px] items-center justify-between border-b border-[#e7e9ed] bg-white px-12 max-[1080px]:px-7 max-[700px]:h-[52px] max-[700px]:px-4">
      <div className="flex items-center gap-7 max-[700px]:gap-4">
        <div className="flex items-center gap-[7px] text-[14px] font-extrabold tracking-[-0.4px] text-[#16181d]">
          <img
            src="/icons/movie-icons/movie.svg"
            alt=""
            aria-hidden="true"
            className="grid h-[19px] w-[19px] place-items-center rounded-[5px] border-[1.5px] border-[#16181d]"
          />
          UMCine
        </div>
        <nav className="flex items-center gap-[22px] max-[700px]:gap-3" aria-label="주요 메뉴">
          <Link to="/" activeProps={{ className: "font-bold text-[#000000] underline underline-offset-2" }} className="text-[11px] text-[#6e737d] no-underline">영화</Link>
          <Link to="/search" activeProps={{ className: "font-bold text-[#000000] underline underline-offset-2" }} className="text-[11px] text-[#6e737d] no-underline">검색</Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/search" className="grid h-[26px] w-[26px] place-items-center rounded-[5px] border border-[#e1e4e9] bg-white" aria-label="검색">
          <img className="h-[15px] w-[15px]" src="/icons/movie-icons/search.svg" alt="" />
        </Link>
        <button className="h-[26px] rounded-[5px] bg-[#4c63d9] px-3 text-[10px] font-bold text-white max-[420px]:hidden" type="button">로그인</button>
      </div>
    </header>
  );
}
