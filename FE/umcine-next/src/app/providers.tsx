"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const ONE_MINUTE = 60 * 1000;

// Vite의 main.tsx에서 하던 Provider 설정을 옮긴 곳이에요.
// QueryClientProvider는 Context를 쓰기 때문에 Client Component에서만 쓸 수 있어서 "use client"를 붙였어요.
export function Providers({ children }: { children: ReactNode }) {
  // 모듈 최상단에서 만들면 서버에서는 여러 사용자의 요청이 같은 캐시를 함께 쓰게 돼요.
  // useState로 컴포넌트마다(요청마다) 한 번만 만들어요.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // 1분 동안은 받아 온 데이터를 최신(fresh)으로 보고 다시 요청하지 않아요.
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
