"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useApp } from "../context/AppContext"
import Card from "../components/Card"
import PulseAnimation from "../components/PulseAnimation"

const buddyPersonalities = [
  {
    id: "cheerful",
    name: "Sunny",
    emoji: "🌞",
    color: "#FFD700",
    description: "Bright, optimistic, and always sees the good in everything",
    messages: [
      "Good morning sunshine! ☀️ Ready to make today amazing?",
      "You're absolutely glowing today! ✨",
      "Every day with you is a gift! 🎁",
      "Your smile could light up the whole world! 😊",
    ],
  },
  {
    id: "caring",
    name: "Luna",
    emoji: "🌙",
    color: "#9333EA",
    description: "Gentle, nurturing, and always there when you need support",
    messages: [
      "I'm here for you, always 💜",
      "Take your time, you're doing great 🤗",
      "Remember to be gentle with yourself 🌸",
      "You matter more than you know 💫",
    ],
  },
  {
    id: "energetic",
    name: "Spark",
    emoji: "⚡",
    color: "#F59E0B",
    description: "High-energy, motivational, and ready to conquer the world",
    messages: [
      "Let's conquer this day together! 🚀",
      "You've got the power! 💪",
      "Energy level: MAXIMUM! ⚡",
      "Nothing can stop us today! 🔥",
    ],
  },
  {
    id: "wise",
    name: "Sage",
    emoji: "🦉",
    color: "#059669",
    description: "Thoughtful, wise, and offers deep insights",
    messages: [
      "Every challenge is a chance to grow 🌱",
      "Wisdom comes from experience, and you're gaining both 📚",
      "Take a moment to reflect on how far you've come 🔮",
      "The journey is just as important as the destination 🛤️",
    ],
  },
]

export default function BuddyScreen() {
  const { buddy, setBuddy } = useApp()
  const [selectedBuddy, setSelectedBuddy] = useState(buddy)

  const handleBuddySelect = (newBuddy: typeof buddy) => {
    setSelectedBuddy(newBuddy)
  }

  const saveBuddy = () => {
    setBuddy(selectedBuddy)
    Alert.alert("Buddy Updated! 🎉", `${selectedBuddy.name} is now your companion!`, [
      { text: "Awesome!", style: "default" },
    ])
  }

  const previewMessage = () => {
    const message = selectedBuddy.messages[Math.floor(Math.random() * selectedBuddy.messages.length)]
    Alert.alert(`${selectedBuddy.name} says:`, message)
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#10B981", "#059669", "#047857"]} style={styles.background} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Buddy 🤗</Text>
          <Text style={styles.subtitle}>Pick your perfect wellness companion</Text>
        </View>

        {/* Current Buddy Preview */}
        <Card style={styles.previewCard}>
          <PulseAnimation>
            <Text style={[styles.previewEmoji, { color: selectedBuddy.color }]}>{selectedBuddy.emoji}</Text>
          </PulseAnimation>
          <Text style={styles.previewName}>{selectedBuddy.name}</Text>
          <Text style={styles.previewDescription}>{selectedBuddy.description}</Text>

          <TouchableOpacity style={styles.previewButton} onPress={previewMessage}>
            <Text style={styles.previewButtonText}>Hear a Message 🎵</Text>
          </TouchableOpacity>
        </Card>

        {/* Buddy Selection */}
        <View style={styles.buddyList}>
          {buddyPersonalities.map((buddyOption) => (
            <TouchableOpacity key={buddyOption.id} onPress={() => handleBuddySelect(buddyOption)} activeOpacity={0.8}>
              <Card style={[styles.buddyCard, selectedBuddy.id === buddyOption.id && styles.selectedBuddyCard]}>
                <View style={styles.buddyHeader}>
                  <Text style={[styles.buddyEmoji, { color: buddyOption.color }]}>{buddyOption.emoji}</Text>
                  <View style={styles.buddyInfo}>
                    <Text style={styles.buddyName}>{buddyOption.name}</Text>
                    <Text style={styles.buddyDescription}>{buddyOption.description}</Text>
                  </View>
                  {selectedBuddy.id === buddyOption.id && <Text style={styles.checkmark}>✓</Text>}
                </View>

                <Text style={styles.sampleMessage}>Sample: "{buddyOption.messages[0]}"</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveBuddy}>
          <LinearGradient colors={["#10B981", "#059669"]} style={styles.saveGradient}>
            <Text style={styles.saveButtonText}>Save My Buddy! ✨</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  previewCard: {
    margin: 20,
    padding: 30,
    alignItems: "center",
  },
  previewEmoji: {
    fontSize: 80,
    marginBottom: 15,
  },
  previewName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  previewButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  previewButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buddyList: {
    paddingHorizontal: 20,
  },
  buddyCard: {
    marginBottom: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedBuddyCard: {
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  buddyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  buddyEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  buddyInfo: {
    flex: 1,
  },
  buddyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  buddyDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 18,
  },
  checkmark: {
    fontSize: 24,
    color: "#10B981",
    fontWeight: "bold",
  },
  sampleMessage: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
    lineHeight: 18,
  },
  saveButton: {
    margin: 20,
    marginTop: 10,
  },
  saveGradient: {
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomSpacer: {
    height: 100,
  },
})
