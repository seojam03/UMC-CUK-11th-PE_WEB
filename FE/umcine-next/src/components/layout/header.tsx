"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { useLogout } from "../../hooks/use-logout";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";

// TanStack Router의 <Link activeProps>를 대신해요.
// next/link에는 activeProps가 없어서 usePathname()으로 현재 주소를 읽고 직접 비교해요.
function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  // "/"는 정확히 같을 때만, 나머지는 하위 주소(/my/edit)에서도 활성으로 봐요.
  const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={isActive ? "text-[11px] font-bold text-[#000000] underline underline-offset-2" : "text-[11px] text-[#6e737d] no-underline"}
    >
      {children}
    </Link>
  );
}

// 주소를 알기 전에 보여 줄 메뉴예요. 링크는 같고 활성 표시만 없어요.
function NavLinksFallback() {
  return (
    <>
      <Link href="/" className="text-[11px] text-[#6e737d] no-underline">영화</Link>
      <Link href="/search" className="text-[11px] text-[#6e737d] no-underline">검색</Link>
      <Link href="/my" className="text-[11px] text-[#6e737d] no-underline">내 정보</Link>
    </>
  );
}

// 토큰(zustand store)과 클릭 이벤트를 쓰는 헤더라서 Client Component예요.
export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  const logout = useLogout();

  return (
    <header className="flex h-[56px] items-center justify-between border-b border-[#e7e9ed] bg-white px-12 max-[1080px]:px-7 max-[700px]:h-[52px] max-[700px]:px-4">
      <div className="flex items-center gap-7 max-[700px]:gap-4">
        <div className="flex items-center gap-[7px] text-[14px] font-extrabold tracking-[-0.4px] text-[#16181d]">
          <Image
            src="/icons/movie-icons/movie.svg"
            alt=""
            aria-hidden="true"
            className="grid h-[19px] w-[19px] place-items-center rounded-[5px] border-[1.5px] border-[#16181d]" width={19} height={19} />
          UMCine
        </div>
        <nav className="flex items-center gap-[22px] max-[700px]:gap-3" aria-label="주요 메뉴">
          {/* usePathname()은 주소가 정해져야 알 수 있어요. /movies/[movieId]처럼 빌드 때 주소를 모르는 페이지에서도
              헤더의 나머지는 미리 그려 둘 수 있도록, 활성 표시가 필요한 메뉴만 Suspense로 감쌌어요. */}
          <Suspense fallback={<NavLinksFallback />}>
            <NavLink href="/">영화</NavLink>
            <NavLink href="/search">검색</NavLink>
            <NavLink href="/my">내 정보</NavLink>
          </Suspense>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/search" className="grid h-[26px] w-[26px] place-items-center rounded-[5px] border border-[#e1e4e9] bg-white" aria-label="검색">
          <Image className="h-[15px] w-[15px]" src="/icons/movie-icons/search.svg" alt="" width={15} height={15} />
        </Link>
        {/* 로그인 전 → 로그인 링크, 첫 조회 중 → 같은 크기의 로딩 표시, 조회 후 → 닉네임과 로그아웃 */}
        {!accessToken ? (
          <Link href="/login" className="grid h-[26px] place-items-center rounded-[5px] bg-[#4c63d9] px-3 text-[10px] font-bold text-white no-underline max-[420px]:hidden">로그인</Link>
        ) : meQuery.isLoading ? (
          // enabled가 false일 때도 isPending은 참이라, 실제 첫 요청 중인지는 isLoading으로 확인해요.
          <span className="h-[26px] w-[88px] animate-pulse rounded-[5px] bg-[#e7e9ed]" aria-label="내 정보를 불러오는 중" />
        ) : (
          <>
            <Link href="/my" className="grid h-[26px] place-items-center rounded-[5px] border border-[#e1e4e9] bg-white px-3 text-[10px] font-bold text-[#17191f] no-underline max-[420px]:hidden">
              {meQuery.data ? `${meQuery.data.nickname}님` : "마이페이지"}
            </Link>
            <button type="button" onClick={logout} className="h-[26px] rounded-[5px] bg-[#4c63d9] px-3 text-[10px] font-bold text-white">
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}
