import React from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, Avatar, RatingBadge, VoteButton } from "@/components/ui";
import { useColors } from "@/theme";
import type { Idea } from "@/types";

interface IdeaCardProps {
  idea: Idea;
  onPress: () => void;
  onVote: () => void;
  compact?: boolean;
}

export function IdeaCard({ idea, onPress, onVote, compact = false }: IdeaCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: pressed ? 0.95 : 1,
      })}
    >
      {/* Header: Author + Score */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Avatar
          name={idea.author?.displayName}
          size={32}
        />
        <View style={{ flex: 1 }}>
          <AppText variant="caption" weight="medium">
            {idea.author?.displayName ?? "Anonymous"}
          </AppText>
          <AppText variant="label" color="secondary">
            {idea.category}
          </AppText>
        </View>
        <RatingBadge score={idea.aiScore} size="md" />
      </View>

      {/* Title + Tagline */}
      <AppText variant="subtitle" style={{ marginBottom: 4 }}>
        {idea.name}
      </AppText>
      <AppText variant="body" color="secondary" numberOfLines={2} style={{ marginBottom: 12 }}>
        {idea.tagline}
      </AppText>

      {/* Footer: Vote + Time */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <VoteButton
          count={idea.voteCount ?? 0}
          hasVoted={idea.hasVoted ?? false}
          onPress={onVote}
        />
        <AppText variant="label" color="secondary">
          {formatTimeAgo(idea.createdAt)}
        </AppText>
      </View>
    </Pressable>
  );
}

interface FeaturedIdeaCardProps {
  idea: Idea;
  onPress: () => void;
  onVote: () => void;
}

export function FeaturedIdeaCard({ idea, onPress, onVote }: FeaturedIdeaCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 20,
        opacity: pressed ? 0.95 : 1,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <Feather name="trending-up" size={14} color="#FFFFFF" />
        <AppText
          variant="label"
          color="inherit"
          style={{ color: "rgba(255,255,255,0.85)", letterSpacing: 1 }}
        >
          FEATURED
        </AppText>
      </View>

      <AppText variant="h2" color="inherit" style={{ color: "#FFFFFF", marginBottom: 6 }}>
        {idea.name}
      </AppText>
      <AppText
        variant="body"
        color="inherit"
        style={{ color: "rgba(255,255,255,0.8)", marginBottom: 16 }}
        numberOfLines={2}
      >
        {idea.tagline}
      </AppText>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Avatar name={idea.author?.displayName} size={28} />
          <AppText variant="caption" color="inherit" style={{ color: "rgba(255,255,255,0.9)" }}>
            {idea.author?.displayName}
          </AppText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <AppText
              variant="caption"
              color="inherit"
              weight="bold"
              style={{ color: "#FFFFFF" }}
            >
              {idea.aiScore}/100
            </AppText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Feather name="arrow-up" size={12} color="#FFFFFF" />
            <AppText variant="caption" color="inherit" weight="bold" style={{ color: "#FFFFFF" }}>
              {idea.voteCount ?? 0}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

