"use client"

import React from "react"
import { View, TouchableOpacity, Text, StyleSheet, Animated } from "react-native"

interface EmojiOption {
  emoji: string
  label: string
  color: string
  intensity: number
}

interface EmojiSelectorProps {
  emojis: EmojiOption[]
  selectedEmoji: string | null
  onSelect: (emoji: string, intensity: number) => void
}

export default function EmojiSelector({ emojis, selectedEmoji, onSelect }: EmojiSelectorProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current

  const handlePress = (emoji: EmojiOption) => {
    onSelect(emoji.emoji, emoji.intensity)

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  return (
    <View style={styles.container}>
      <View style={styles.emojiGrid}>
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.emojiButton,
              selectedEmoji === emoji.emoji && {
                backgroundColor: emoji.color,
                transform: [{ scale: 1.1 }],
              },
            ]}
            onPress={() => handlePress(emoji)}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: selectedEmoji === emoji.emoji ? scaleAnim : 1 }] }}>
              <Text style={styles.emojiText}>{emoji.emoji}</Text>
            </Animated.View>
            <Text style={[styles.emojiLabel, selectedEmoji === emoji.emoji && styles.selectedLabel]}>
              {emoji.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  emojiButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 70,
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    marginBottom: 8,
  },
  emojiText: {
    fontSize: 24,
    marginBottom: 4,
  },
  emojiLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },
  selectedLabel: {
    color: "white",
    fontWeight: "bold",
  },
})
