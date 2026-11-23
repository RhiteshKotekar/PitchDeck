import React, { useState, useCallback } from "react";
import { View, FlatList, RefreshControl, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import {
  AppText,
  Avatar,
  StatCard,
  RatingBadge,
  IdeaCardSkeleton,
  EmptyState,
  ErrorState,
  IconButton,
} from "@/components/ui";
import { useColors } from "@/theme";
import { ideasApi, userApi, profileApi } from "@/lib/api";
import type { Idea, User, ProfileStats } from "@/types";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user: clerkUser } = useUser();

  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [profileData, statsData, ideasData] = await Promise.all([
        userApi.getMe(),
        profileApi.stats(),
        ideasApi.myIdeas(),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setIdeas(ideasData);
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  if (error && !refreshing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
        <ErrorState message={error} onRetry={fetchData} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={ideas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 100,
          paddingHorizontal: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={{ gap: 20, marginBottom: 20 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText variant="h2">Profile</AppText>
              <IconButton
                name="settings"
                onPress={() => router.push("/settings" as any)}
              />
            </View>

            {/* Profile card */}
            <View style={{ alignItems: "center", gap: 12 }}>
              <Avatar
                name={profile?.displayName ?? clerkUser?.firstName ?? "U"}
                size={72}
              />
              <View style={{ alignItems: "center" }}>
                <AppText variant="h2">
                  {profile?.displayName ?? clerkUser?.firstName ?? "User"}
                </AppText>
                {profile?.username && (
                  <AppText variant="body" color="secondary">
                    @{profile.username}
                  </AppText>
                )}
                {profile?.bio && (
                  <AppText
                    variant="body"
                    color="secondary"
                    align="center"
                    style={{ marginTop: 4, maxWidth: 280 }}
                  >
                    {profile.bio}
                  </AppText>
                )}
              </View>
            </View>

            {/* Stats */}
            {stats && (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <StatCard
                  label="Ideas"
                  value={stats.ideasCount}
                  icon={<Feather name="zap" size={18} color={colors.primary} />}
                />
                <StatCard
                  label="Votes"
                  value={stats.totalVotes}
                  icon={<Feather name="arrow-up" size={18} color={colors.tertiary} />}
                />
                <StatCard
                  label="Avg Score"
                  value={stats.averageScore}
                  icon={<Feather name="star" size={18} color={colors.secondary} />}
                />
              </View>
            )}

            {ideas.length > 0 && (
              <AppText variant="h3">My Ideas</AppText>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/idea/${item.id}` as any)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <AppText variant="subtitle" numberOfLines={1}>{item.name}</AppText>
              <AppText variant="caption" color="secondary" numberOfLines={1}>
                {item.tagline}
              </AppText>
            </View>
            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <RatingBadge score={item.aiScore} size="sm" />
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Feather name="arrow-up" size={11} color={colors.textSecondary} />
                <AppText variant="label" color="secondary">{item.voteCount ?? 0}</AppText>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          loading ? (
            <View style={{ gap: 12 }}>
              <IdeaCardSkeleton />
              <IdeaCardSkeleton />
            </View>
          ) : (
            <EmptyState
              icon="zap"
              title="No ideas yet"
              message="Share your first startup idea with the community"
              actionLabel="Create Idea"
              onAction={() => router.push("/(tabs)/create" as any)}
            />
          )
        }
      />
    </View>
  );
}

