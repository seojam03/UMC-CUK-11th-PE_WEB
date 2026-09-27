import { useState, useEffect } from "react";
import { readBookmarkIds, saveBookmarkIds } from "../utils/bookmark-storage";

export function useBookmark() {
  // 1. readBookmarkIds 유틸리티를 사용해 초기 상태를 설정합니다.
    const [bookmarks, setBookmarks] = useState<number[]>(() => readBookmarkIds());

  // 2. bookmarks 상태가 변경될 때마다 saveBookmarkIds 유틸리티를 호출해 스토리지에 저장합니다.
    useEffect(() => {
    saveBookmarkIds(bookmarks);
    }, [bookmarks]);

  // 3. 북마크를 추가/제거하는 액션 함수입니다.
    const toggleBookmark = (movieId: number) => {
        setBookmarks((prevBookmarks) =>
        prevBookmarks.includes(movieId)
        ? prevBookmarks.filter((id) => id !== movieId)
        : [...prevBookmarks, movieId]
        );
    };

  // 4. 컴포넌트에서 사용할 수 있도록 상태와 함수를 반환합니다.
    return { bookmarks, toggleBookmark };
}