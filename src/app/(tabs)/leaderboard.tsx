import React, { useState, useCallback } from "react";
import { View, FlatList, Pressable, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
  AppText,
  RatingBadge,
  CategoryChip,
  IdeaCardSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui";
import { useColors } from "@/theme";
import { leaderboardApi } from "@/lib/api";
import type { LeaderboardEntry } from "@/types";

type Period = "week" | "all";
type Mode = "most_voted" | "highest_rated";

export default function LeaderboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("all");
  const [mode, setMode] = useState<Mode>("most_voted");

  const fetchLeaderboard = useCallback(async () => {
    try {
      setError(null);
      const data = await leaderboardApi.get({ period, mode });
      setEntries(data);
    } catch (err: any) {
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period, mode]);

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard();
    }, [fetchLeaderboard])
  );

  const podiumColors = [colors.gold, colors.silver, colors.bronze];

  const renderPodium = () => {
    const top3 = entries.slice(0, 3);
    if (top3.length === 0) return null;

    return (
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 8, marginVertical: 24 }}>
        {/* 2nd place */}
        {top3[1] && (
          <Pressable
            onPress={() => router.push(`/idea/${top3[1].idea.id}` as any)}
            style={{ alignItems: "center", flex: 1 }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: podiumColors[1] + "20",
                borderWidth: 2,
                borderColor: podiumColors[1],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <AppText variant="h3" style={{ fontFamily: "Manrope-Bold" }}>2</AppText>
            </View>
            <AppText variant="caption" weight="semibold" numberOfLines={1}>
              {top3[1].idea.name}
            </AppText>
            <AppText variant="label" color="secondary">
              {mode === "most_voted"
                ? `${top3[1].idea.voteCount ?? 0} votes`
                : `Score: ${top3[1].idea.aiScore}`}
            </AppText>
          </Pressable>
        )}

        {/* 1st place */}
        {top3[0] && (
          <Pressable
            onPress={() => router.push(`/idea/${top3[0].idea.id}` as any)}
            style={{ alignItems: "center", flex: 1 }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: podiumColors[0] + "20",
                borderWidth: 3,
                borderColor: podiumColors[0],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Feather name="award" size={24} color={podiumColors[0]} />
            </View>
            <AppText variant="subtitle" weight="bold" numberOfLines={1}>
              {top3[0].idea.name}
            </AppText>
            <AppText variant="caption" color="secondary">
              {mode === "most_voted"
                ? `${top3[0].idea.voteCount ?? 0} votes`
                : `Score: ${top3[0].idea.aiScore}`}
            </AppText>
          </Pressable>
        )}

        {/* 3rd place */}
        {top3[2] && (
          <Pressable
            onPress={() => router.push(`/idea/${top3[2].idea.id}` as any)}
            style={{ alignItems: "center", flex: 1 }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: podiumColors[2] + "20",
                borderWidth: 2,
                borderColor: podiumColors[2],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <AppText variant="h3" style={{ fontFamily: "Manrope-Bold" }}>3</AppText>
            </View>
            <AppText variant="caption" weight="semibold" numberOfLines={1}>
              {top3[2].idea.name}
            </AppText>
            <AppText variant="label" color="secondary">
              {mode === "most_voted"
                ? `${top3[2].idea.voteCount ?? 0} votes`
                : `Score: ${top3[2].idea.aiScore}`}
            </AppText>
          </Pressable>
        )}
      </View>
    );
  };

  if (error && !refreshing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <ErrorState message={error} onRetry={fetchLeaderboard} />
      </View>
    );
  }

  const remaining = entries.slice(3);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={remaining}
        keyExtractor={(item) => item.idea.id}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 100,
          paddingHorizontal: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchLeaderboard(); }}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <AppText variant="h1" style={{ marginBottom: 4 }}>
              Hall of Fame
            </AppText>
            <AppText variant="body" color="secondary" style={{ marginBottom: 20 }}>
              The ideas getting the most attention
            </AppText>

            {/* Filters */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              <CategoryChip label="All Time" selected={period === "all"} onPress={() => setPeriod("all")} />
              <CategoryChip label="This Week" selected={period === "week"} onPress={() => setPeriod("week")} />
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              <CategoryChip label="Most Voted" selected={mode === "most_voted"} onPress={() => setMode("most_voted")} />
              <CategoryChip label="Highest Rated" selected={mode === "highest_rated"} onPress={() => setMode("highest_rated")} />
            </View>

            {loading ? (
              <View style={{ gap: 12, marginTop: 20 }}>
                <IdeaCardSkeleton />
                <IdeaCardSkeleton />
              </View>
            ) : (
              renderPodium()
            )}

            {remaining.length > 0 && (
              <AppText variant="h3" style={{ marginTop: 8, marginBottom: 12 }}>
                Runner-ups
              </AppText>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/idea/${item.idea.id}` as any)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 14,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <AppText
              variant="subtitle"
              style={{ width: 28, textAlign: "center", fontFamily: "Manrope-Bold" }}
            >
              {item.rank}
            </AppText>
            <View style={{ flex: 1 }}>
              <AppText variant="subtitle" numberOfLines={1}>{item.idea.name}</AppText>
              <AppText variant="caption" color="secondary" numberOfLines={1}>
                {item.idea.author?.displayName} · {item.idea.category}
              </AppText>
            </View>
            <View style={{ alignItems: "flex-end", gap: 2 }}>
              <RatingBadge score={item.idea.aiScore} size="sm" />
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Feather name="arrow-up" size={12} color={colors.textSecondary} />
                <AppText variant="label" color="secondary">{item.idea.voteCount ?? 0}</AppText>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="award"
              title="No entries yet"
              message="Submit ideas and vote to see the leaderboard"
            />
          ) : undefined
        }
      />
    </View>
  );
}

