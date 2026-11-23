import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import {
  AppText,
  SearchField,
  CategoryChip,
  Avatar,
  IdeaCardSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui";
import { IdeaCard, FeaturedIdeaCard } from "@/components/ideas";
import { useColors, Categories } from "@/theme";
import { ideasApi, type GetIdeasParams } from "@/lib/api";
import { useVote } from "@/hooks/useVote";
import type { Idea } from "@/types";

type SortMode = "trending" | "newest" | "highest_rated" | "most_voted";

export default function DiscoverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user } = useUser();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortMode>("trending");

  const fetchIdeas = useCallback(async () => {
    try {
      setError(null);
      const params: GetIdeasParams = { sort, pageSize: 20 };
      if (category !== "All") params.category = category;
      if (search.trim()) params.search = search.trim();
      const res = await ideasApi.list(params);
      setIdeas(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load ideas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sort, category, search]);

  const { toggleVote, getVoteState } = useVote(() => {
    fetchIdeas();
  });

  useFocusEffect(
    useCallback(() => {
      fetchIdeas();
    }, [fetchIdeas])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchIdeas();
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const featured = ideas.length > 0 ? ideas[0] : null;
  const remaining = ideas.length > 1 ? ideas.slice(1) : [];

  const sortOptions: { key: SortMode; label: string }[] = [
    { key: "trending", label: "Trending" },
    { key: "newest", label: "Newest" },
    { key: "highest_rated", label: "Top Rated" },
    { key: "most_voted", label: "Most Voted" },
  ];

  if (error && !refreshing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <ErrorState message={error} onRetry={fetchIdeas} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={remaining}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 100,
          paddingHorizontal: 20,
          gap: 12,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={{ gap: 20, marginBottom: 8 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <AppText variant="h2">
                  {greeting()},{" "}
                  <AppText variant="h2" color="inherit" style={{ color: colors.primary }}>
                    founder
                  </AppText>
                </AppText>
                <AppText variant="body" color="secondary" style={{ marginTop: 2 }}>
                  What&apos;s the next big idea?
                </AppText>
              </View>
              <Avatar name={user?.firstName ?? "U"} size={40} />
            </View>

            {/* Search */}
            <SearchField
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => fetchIdeas()}
              returnKeyType="search"
            />

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {Categories.map((cat) => (
                  <CategoryChip
                    key={cat}
                    label={cat}
                    selected={category === cat}
                    onPress={() => setCategory(cat)}
                  />
                ))}
              </View>
            </ScrollView>

            {/* Sort */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {sortOptions.map((opt) => (
                  <CategoryChip
                    key={opt.key}
                    label={opt.label}
                    selected={sort === opt.key}
                    onPress={() => setSort(opt.key)}
                  />
                ))}
              </View>
            </ScrollView>

            {/* Featured */}
            {loading ? (
              <View style={{ gap: 12 }}>
                <IdeaCardSkeleton />
                <IdeaCardSkeleton />
              </View>
            ) : featured ? (
              <FeaturedIdeaCard
                idea={featured}
                onPress={() => router.push(`/idea/${featured.id}` as any)}
                onVote={() => toggleVote(featured)}
              />
            ) : null}

            {remaining.length > 0 && (
              <AppText variant="h3" style={{ marginTop: 4 }}>
                Recent Ideas
              </AppText>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const vs = getVoteState(item);
          return (
            <IdeaCard
              idea={{ ...item, voteCount: vs.count, hasVoted: vs.hasVoted }}
              onPress={() => router.push(`/idea/${item.id}` as any)}
              onVote={() => toggleVote(item)}
            />
          );
        }}
        ListEmptyComponent={
          loading ? (
            <View style={{ gap: 12 }}>
              <IdeaCardSkeleton />
              <IdeaCardSkeleton />
              <IdeaCardSkeleton />
            </View>
          ) : (
            <EmptyState
              icon="compass"
              title="No ideas yet"
              message="Be the first to share your startup idea with the community."
              actionLabel="Create Idea"
              onAction={() => router.push("/(tabs)/create" as any)}
            />
          )
        }
      />
    </View>
  );
}

