import { create } from "zustand";

interface ProfileImageStore {
  // 브라우저에서 고른 이미지의 미리보기 주소예요. 없으면 기본 아이콘을 보여줘요.
  profileImageUrl: string | null;
  setProfileImageUrl: (profileImageUrl: string | null) => void;
}

// 닉네임·이메일은 서버 상태라 query 캐시(["members", "me"])에서 가져와요.
// 프로필 이미지는 아직 업로드 API가 없어 이 브라우저에만 있는 클라이언트 상태라서 store에 따로 둬요.
export const useProfileImageStore = create<ProfileImageStore>((set) => ({
  profileImageUrl: null,
  setProfileImageUrl: (profileImageUrl) => set({ profileImageUrl }),
}));
