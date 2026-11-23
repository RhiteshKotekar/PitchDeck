import React from "react";
import { View, Pressable, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@/components/ui";
import { useColors } from "@/theme";

type TabIconName = "compass" | "award" | "plus-circle" | "user";

interface TabBarProps {
  state: any;
  descriptors?: any;
  navigation?: any;
  emitter?: any;
  navigateToTab?: (key: string) => void;
  [key: string]: any;
}

function CustomTabBar({ state, descriptors, navigation, navigateToTab }: TabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const icons: TabIconName[] = ["compass", "award", "plus-circle", "user"];
  const labels = ["Discover", "Leaderboard", "Create", "Profile"];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: Platform.OS === "ios" ? insets.bottom : 10,
        paddingTop: 8,
        paddingHorizontal: 8,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const isCreate = index === 2;

        return (
          <Pressable
            key={route.key}
            onPress={() => {
              if (navigation?.emit) {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              } else if (navigateToTab) {
                navigateToTab(route.key);
              }
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 4,
              gap: 3,
            }}
          >
            {isCreate ? (
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: -20,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Feather name="plus" size={24} color="#FFFFFF" />
              </View>
            ) : (
              <>
                <Feather
                  name={icons[index]}
                  size={22}
                  color={isFocused ? colors.primary : colors.textSecondary}
                />
                <AppText
                  variant="label"
                  color="inherit"
                  style={{
                    color: isFocused ? colors.primary : colors.textSecondary,
                    fontSize: 11,
                  }}
                >
                  {labels[index]}
                </AppText>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Discover" }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
      <Tabs.Screen name="create" options={{ title: "Create" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

