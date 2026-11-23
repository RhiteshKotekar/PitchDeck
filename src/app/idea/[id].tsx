import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import {
  AppText,
  Avatar,
  VoteButton,
  IconButton,
  LoadingIndicator,
  ErrorState,
  ConfirmationDialog,
  useToast,
} from "@/components/ui";
import { useColors } from "@/theme";
import { ideasApi } from "@/lib/api";
import { useVote } from "@/hooks/useVote";
import type { Idea } from "@/types";

export default function IdeaDetailScreen() {
  const { id, new: isNew } = useLocalSearchParams<{ id: string; new?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { show } = useToast();
  const { user } = useUser();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchIdea = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await ideasApi.get(id);
      setIdea(data);
    } catch (err: any) {
      setError(err.message || "Failed to load idea");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  const { toggleVote, getVoteState } = useVote(() => {
    fetchIdea();
  });

  useFocusEffect(
    useCallback(() => {
      fetchIdea();
    }, [fetchIdea])
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)" as any);
    }
  };

  const onShare = async () => {
    if (!idea) return;
    try {
      await Share.share({
        message: `${idea.name} — "${idea.tagline}" | AI Score: ${idea.aiScore}/100 on Pitchboard`,
      });
    } catch {
      // User cancelled
    }
  };

  const onDelete = async () => {
    if (!idea) return;
    setDeleting(true);
    try {
      await ideasApi.delete(idea.id);
      show("success", "Idea deleted");
      handleBack();
    } catch (err: any) {
      show("error", err.message || "Failed to delete");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  if (loading) return <LoadingIndicator fullScreen />;
  if (error) return <ErrorState message={error} onRetry={fetchIdea} />;
  if (!idea) return <ErrorState message="Idea not found" />;

  const voteState = getVoteState(idea);
  const isOwner = user?.id === idea.author?.username; // We'll check by clerkUserId

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Exceptional potential";
    if (score >= 70) return "Promising potential";
    if (score >= 50) return "Moderate potential";
    if (score >= 30) return "Needs refinement";
    return "Early stage";
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 100,
          paddingHorizontal: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchIdea(); }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Nav bar */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <IconButton name="arrow-left" onPress={handleBack} />
          <View style={{ flexDirection: "row", gap: 4 }}>
            <IconButton name="share-2" onPress={onShare} />
            {isOwner && (
              <IconButton
                name="trash-2"
                color={colors.error}
                onPress={() => setShowDelete(true)}
              />
            )}
          </View>
        </View>

        {/* New idea badge */}
        {isNew === "true" && (
          <View
            style={{
              backgroundColor: colors.primary + "15",
              borderRadius: 12,
              padding: 14,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Feather name="check-circle" size={18} color={colors.primary} />
            <AppText variant="body" color="inherit" style={{ color: colors.primary, flex: 1 }}>
              Your idea has been evaluated!
            </AppText>
          </View>
        )}

        {/* Score ring */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 4,
              borderColor: colors.primary + "30",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <AppText
              variant="h1"
              style={{ fontSize: 36, fontFamily: "Manrope-Bold", color: colors.primary }}
            >
              {idea.aiScore}
            </AppText>
            <AppText variant="caption" color="secondary">/100</AppText>
          </View>
          <AppText variant="subtitle" style={{ color: colors.primary }}>
            {getScoreLabel(idea.aiScore)}
          </AppText>
          <AppText variant="label" color="secondary" style={{ marginTop: 4 }}>
            Simulated AI Evaluation
          </AppText>
        </View>

        {/* Title */}
        <AppText variant="h1" style={{ marginBottom: 4 }}>
          {idea.name}
        </AppText>
        <AppText variant="body" color="secondary" style={{ marginBottom: 16 }}>
          {idea.tagline}
        </AppText>

        {/* Author & Category */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Avatar name={idea.author?.displayName} size={32} />
          <View style={{ flex: 1 }}>
            <AppText variant="caption" weight="medium">
              {idea.author?.displayName}
            </AppText>
            <AppText variant="label" color="secondary">
              {idea.category} · {new Date(idea.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </AppText>
          </View>
          <VoteButton
            count={voteState.count}
            hasVoted={voteState.hasVoted}
            onPress={() => toggleVote(idea)}
          />
        </View>

        {/* Description */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <AppText variant="body" style={{ lineHeight: 24 }}>
            {idea.description}
          </AppText>
        </View>

        {/* Score breakdown */}
        <AppText variant="h3" style={{ marginBottom: 12 }}>Score Breakdown</AppText>
        <View style={{ gap: 10, marginBottom: 20 }}>
          {[
            { label: "Market Potential", score: idea.marketPotentialScore, icon: "trending-up" as const },
            { label: "Innovation", score: idea.innovationScore, icon: "zap" as const },
            { label: "Feasibility", score: idea.feasibilityScore, icon: "check-circle" as const },
          ].map((item) => (
            <View
              key={item.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Feather name={item.icon} size={18} color={colors.primary} />
              <AppText variant="body" weight="medium" style={{ flex: 1 }}>
                {item.label}
              </AppText>
              <AppText variant="subtitle" style={{ fontFamily: "Manrope-Bold" }}>
                {item.score}
              </AppText>
              <AppText variant="caption" color="secondary">/100</AppText>
            </View>
          ))}
        </View>

        {/* AI Feedback */}
        {idea.aiFeedback && (
          <>
            {/* Strengths */}
            {idea.aiFeedback.strengths.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <AppText variant="h3" style={{ marginBottom: 12 }}>
                  What looks promising
                </AppText>
                {idea.aiFeedback.strengths.map((s, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      marginBottom: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <Feather name="check" size={16} color={colors.success ?? "#5A7A52"} style={{ marginTop: 3 }} />
                    <AppText variant="body" style={{ flex: 1 }}>{s}</AppText>
                  </View>
                ))}
              </View>
            )}

            {/* Improvements */}
            {idea.aiFeedback.improvements.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <AppText variant="h3" style={{ marginBottom: 12 }}>
                  Areas to improve
                </AppText>
                {idea.aiFeedback.improvements.map((s, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      marginBottom: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <Feather name="arrow-right" size={16} color={colors.tertiary} style={{ marginTop: 3 }} />
                    <AppText variant="body" style={{ flex: 1 }}>{s}</AppText>
                  </View>
                ))}
              </View>
            )}

            {/* Summary */}
            {idea.aiFeedback.summary && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginBottom: 20,
                }}
              >
                <AppText variant="label" color="secondary" style={{ marginBottom: 6 }}>
                  EVALUATION SUMMARY
                </AppText>
                <AppText variant="body">{idea.aiFeedback.summary}</AppText>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <ConfirmationDialog
        visible={showDelete}
        title="Delete Idea"
        message="Are you sure you want to delete this idea? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={onDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </View>
  );
}

