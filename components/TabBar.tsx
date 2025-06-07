import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native"
import { BlurView } from "expo-blur"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

const tabs = [
  { name: "Home", icon: "🏠", activeIcon: "🏡" },
  { name: "Mood", icon: "😊", activeIcon: "🥰" },
  { name: "Buddy", icon: "🤖", activeIcon: "🤗" },
  { name: "Stats", icon: "📊", activeIcon: "📈" },
]

interface TabBarProps {
  state: any
  descriptors: any
  navigation: any
}

export default function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <BlurView intensity={100} tint="light" style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          const tab = tabs[index]

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[styles.tab, isFocused && styles.activeTab]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabIcon, isFocused && styles.activeTabIcon]}>
                {isFocused ? tab.activeIcon : tab.icon}
              </Text>
              <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>{tab.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  tabContainer: {
    flexDirection: "row",
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 15,
  },
  activeTab: {
    backgroundColor: "rgba(79, 70, 229, 0.1)",
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  activeTabIcon: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabLabel: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
})
