import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  // 사용자가 직접 로그아웃했는지 표시해요. (토큰 만료로 비워진 경우와 구분하려고 둬요)
  didLogout: boolean;
  setAccessToken: (accessToken: string | null) => void;
  logout: () => void;
}

// 9주차: Next.js는 Client Component도 서버에서 한 번 미리 그려요. 서버에는 localStorage가 없어서
// 서버에서는 아무것도 저장하지 않는 빈 저장소를 쓰고, 브라우저에서만 진짜 localStorage를 써요.
const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

// 토큰은 서버가 발급했지만, 원본을 들고 있는 곳은 브라우저예요. 그래서 query 캐시가 아니라 store에 둬요.
// 새로고침해도 로그인이 유지되도록 localStorage에 저장해요.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      didLogout: false,
      setAccessToken: (accessToken) => set({ accessToken, didLogout: false }),
      logout: () => set({ accessToken: null, didLogout: true }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => (typeof window === "undefined" ? serverStorage : localStorage)),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);

// localStorage에서 토큰을 다 읽어 왔는지 알려줘요.
// 서버 HTML과 첫 화면(hydration)이 같아야 해서, 그동안에는 토큰이 있어도 null로 보여요.
// 그래서 "토큰이 없다"와 "아직 못 읽었다"를 구분하려면 이 값을 함께 봐야 해요.
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false, // 서버와 hydration 중에는 항상 "아직"이에요.
  );
}
