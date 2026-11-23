import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
  AppText,
  AppButton,
  TextField,
  CategoryChip,
  useToast,
} from "@/components/ui";
import { useColors, Categories } from "@/theme";
import { ideasApi } from "@/lib/api";

export default function CreateIdeaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { show } = useToast();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = Categories.filter((c) => c !== "All");

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Startup name is required";
    if (name.length > 60) e.name = "Name too long (max 60)";
    if (!tagline.trim()) e.tagline = "Tagline is required";
    if (tagline.length > 120) e.tagline = "Tagline too long (max 120)";
    if (!description.trim()) e.description = "Description is required";
    if (description.length > 1000) e.description = "Description too long (max 1000)";
    if (!category) e.category = "Pick a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const idea = await ideasApi.create({
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        category,
      });
      show("success", "Idea submitted for evaluation!");
      router.push(`/idea/${idea.id}?new=true` as any);
      // Reset form
      setName("");
      setTagline("");
      setDescription("");
      setCategory("");
    } catch (err: any) {
      show("error", err.message || "Failed to submit idea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 120,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <AppText variant="h1" style={{ marginBottom: 8 }}>
            Bring your idea to life
          </AppText>
          <AppText variant="body" color="secondary">
            Every great startup starts somewhere. Tell us yours.
          </AppText>
        </View>

        <View style={{ gap: 24 }}>
          <TextField
            label="Startup Name"
            placeholder="e.g. SkillBridge"
            value={name}
            onChangeText={setName}
            maxLength={60}
            showCount
            error={errors.name}
            icon="zap"
          />

          <TextField
            label="Tagline"
            placeholder="One line that captures your idea"
            value={tagline}
            onChangeText={setTagline}
            maxLength={120}
            showCount
            error={errors.tagline}
            icon="type"
          />

          <TextField
            label="Description"
            placeholder="Describe your startup idea, the problem it solves, and your approach..."
            value={description}
            onChangeText={setDescription}
            maxLength={1000}
            showCount
            multiline
            numberOfLines={5}
            error={errors.description}
            style={{ minHeight: 120, textAlignVertical: "top" }}
          />

          {/* Category */}
          <View style={{ gap: 8 }}>
            <AppText variant="label" color="secondary" style={{ marginLeft: 4 }}>
              Category
            </AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {categories.map((cat) => (
                <CategoryChip
                  key={cat}
                  label={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                />
              ))}
            </View>
            {errors.category && (
              <AppText variant="caption" color="error" style={{ marginLeft: 4 }}>
                {errors.category}
              </AppText>
            )}
          </View>

          {/* Submit */}
          <AppButton
            title="Submit for Evaluation"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            onPress={onSubmit}
            icon={<Feather name="send" size={18} color="#FFFFFF" />}
          />

          <AppText variant="caption" color="secondary" align="center">
            Your idea will receive a simulated AI evaluation
          </AppText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

