import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import { BlurView } from "expo-blur"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  blur?: boolean
}

export default function Card({ children, style, blur = false }: CardProps) {
  if (blur) {
    return (
      <BlurView intensity={20} tint="light" style={[styles.card, style]}>
        {children}
      </BlurView>
    )
  }

  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
})
