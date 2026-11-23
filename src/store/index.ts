import { create } from "zustand";

interface AppState {
  // Vote optimistic updates
  optimisticVotes: Record<string, { count: number; voted: boolean }>;
  setOptimisticVote: (ideaId: string, count: number, voted: boolean) => void;
  clearOptimisticVote: (ideaId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  optimisticVotes: {},
  setOptimisticVote: (ideaId, count, voted) =>
    set((state) => ({
      optimisticVotes: {
        ...state.optimisticVotes,
        [ideaId]: { count, voted },
      },
    })),
  clearOptimisticVote: (ideaId) =>
    set((state) => {
      const { [ideaId]: _, ...rest } = state.optimisticVotes;
      return { optimisticVotes: rest };
    }),
}));

