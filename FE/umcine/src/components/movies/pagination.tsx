type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-8 flex justify-center gap-2" aria-label="페이지 이동">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
    </nav>
  );
}
