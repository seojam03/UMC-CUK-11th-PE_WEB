type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// TMDB 목록은 페이지가 수백 개라 10개씩 묶어서 보여줘요.
const PAGES_PER_GROUP = 10;

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const groupStart = Math.floor((currentPage - 1) / PAGES_PER_GROUP) * PAGES_PER_GROUP + 1;
  const groupEnd = Math.min(groupStart + PAGES_PER_GROUP - 1, totalPages);
  const pages = Array.from({ length: groupEnd - groupStart + 1 }, (_, index) => groupStart + index);

  const arrowClassName = "h-7 min-w-7 rounded-[4px] border border-[#dfe2e7] bg-white px-2 text-[10px] text-[#737985] disabled:opacity-40";

  return (
    <nav className="mt-8 flex justify-center gap-2" aria-label="페이지 이동">
      <button
        className={arrowClassName}
        onClick={() => onPageChange(groupStart - 1)}
        disabled={groupStart === 1}
        aria-label="이전 페이지 묶음"
        type="button"
      >
        ‹
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? "h-7 min-w-7 rounded-[4px] bg-[#4c63d9] px-2 text-[10px] font-bold text-white" : "h-7 min-w-7 rounded-[4px] border border-[#dfe2e7] bg-white px-2 text-[10px] text-[#737985]"}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          type="button"
        >
          {page}
        </button>
      ))}
      <button
        className={arrowClassName}
        onClick={() => onPageChange(groupEnd + 1)}
        disabled={groupEnd === totalPages}
        aria-label="다음 페이지 묶음"
        type="button"
      >
        ›
      </button>
    </nav>
  );
}
