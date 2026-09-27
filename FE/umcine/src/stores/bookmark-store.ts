import { create } from "zustand";
import { readBookmarkIds, saveBookmarkIds } from "../utils/bookmark-storage";
// import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
    bookmarkedMovieIds: number[];
    toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
    bookmarkedMovieIds: readBookmarkIds(),

    toggleBookmark: (movieId) =>
        set((state) => {
            const isBookmarked = state.bookmarkedMovieIds.includes(movieId);
            const updatedBookmarks = isBookmarked
                ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
                : [...state.bookmarkedMovieIds, movieId];

            saveBookmarkIds(updatedBookmarks);
            return { bookmarkedMovieIds: updatedBookmarks };
        }),
}));
// (
//   persist(
//     (set) => ({
//       bookmarkedMovieIds: [],
//       toggleBookmark: (movieId) =>
//         set((state) => ({
//           bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
//             ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
//             : [...state.bookmarkedMovieIds, movieId],
//         })),
//     }),
//     {
//       name: "umcine-bookmark-store",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         bookmarkedMovieIds: state.bookmarkedMovieIds,
//       }),
//     },
//   ),
// );