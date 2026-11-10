"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuthHydrated, useAuthStore } from "../../stores/auth-store";

// 로그인 전용 페이지들의 공통 Layout이에요. 안의 페이지는 children 자리에 그려져요.
// TanStack Router에서는 beforeLoad의 redirect와 <Navigate />로 막았어요.
// 토큰이 브라우저(localStorage)에만 있어서 서버는 로그인 여부를 알 수 없으니, 브라우저에서 확인하고 이동시켜요.
export function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const didLogout = useAuthStore((state) => state.didLogout);
  // 새로고침 직후 첫 화면에서는 토큰이 있어도 null로 보여요. 다 읽은 뒤에만 로그인 여부를 판단해요.
  const isHydrated = useAuthHydrated();

  // 보호 페이지에 새로 들어왔다면 예전 로그아웃 표시는 지워요. (지우지 않으면 아래 이동이 막혀요)
  // 로그아웃 버튼을 누를 때는 이 레이아웃이 이미 떠 있는 상태라 이 effect가 다시 실행되지 않아요.
  useEffect(() => {
    useAuthStore.setState({ didLogout: false });
  }, []);

  // 토큰 없이 들어왔거나, 페이지에 있는 동안 토큰이 만료(401)되면 로그인 화면으로 보내요.
  // 직접 로그아웃한 경우는 useLogout이 홈("/")으로 보내는 중이라 여기서 다시 보내지 않아요.
  // 이동은 렌더링 중이 아니라 useEffect에서 해요. (렌더링 중에 router를 바꾸면 경고가 나요)
  useEffect(() => {
    if (isHydrated && !accessToken && !didLogout) {
      router.replace("/login");
    }
  }, [isHydrated, accessToken, didLogout, router]);

  if (!isHydrated || !accessToken) {
    return null;
  }

  return <>{children}</>;
}
