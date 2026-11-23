import { useCallback } from "react";
import { ideasApi } from "@/lib/api";
import { useAppStore } from "@/store";
import { useToast } from "@/components/ui";
import type { Idea } from "@/types";

export function useVote(onMutate?: () => void) {
  const { optimisticVotes, setOptimisticVote } = useAppStore();
  const { show } = useToast();

  const toggleVote = useCallback(
    async (idea: Idea) => {
      const currentVoted = optimisticVotes[idea.id]?.voted ?? idea.hasVoted ?? false;
      const currentCount = optimisticVotes[idea.id]?.count ?? idea.voteCount ?? 0;

      // Optimistic update
      const newVoted = !currentVoted;
      const newCount = newVoted ? currentCount + 1 : currentCount - 1;
      setOptimisticVote(idea.id, newCount, newVoted);

      try {
        const result = newVoted
          ? await ideasApi.vote(idea.id)
          : await ideasApi.unvote(idea.id);
        setOptimisticVote(idea.id, result.voteCount, newVoted);
        onMutate?.();
      } catch {
        // Revert
        setOptimisticVote(idea.id, currentCount, currentVoted);
        show("error", "Failed to update vote");
      }
    },
    [optimisticVotes, setOptimisticVote, onMutate, show]
  );

  const getVoteState = useCallback(
    (idea: Idea) => {
      const opt = optimisticVotes[idea.id];
      return {
        count: opt?.count ?? idea.voteCount ?? 0,
        hasVoted: opt?.voted ?? idea.hasVoted ?? false,
      };
    },
    [optimisticVotes]
  );

  return { toggleVote, getVoteState };
}

