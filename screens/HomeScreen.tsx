"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Share,
  Vibration,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useApp } from "../context/AppContext"
import Card from "../components/Card"
import EmojiSelector from "../components/EmojiSelector"
import PulseAnimation from "../components/PulseAnimation"

const { width, height } = Dimensions.get("window")

const jokes = [
  "Why don't skeletons fight each other? They don't have the guts! 💀😄",
  "What do you call a bear with no teeth? A gummy bear! 🐻🦷",
  "Why don't scientists trust atoms? Because they make up everything! ⚛️😂",
  "What's orange and sounds like a parrot? A carrot! 🥕🦜",
  "Why did the scarecrow win an award? He was outstanding in his field! 🌾🏆",
  "What do you call a fake noodle? An impasta! 🍝😆",
  "Why don't eggs tell jokes? They'd crack each other up! 🥚😂",
  "What's the best thing about Switzerland? I don't know, but the flag is a big plus! 🇨🇭➕",
]

const moodEmojis = [
  { emoji: "😭", label: "Terrible", color: "#EF4444", intensity: 1 },
  { emoji: "😢", label: "Sad", color: "#F97316", intensity: 2 },
  { emoji: "😔", label: "Down", color: "#EAB308", intensity: 3 },
  { emoji: "😐", label: "Okay", color: "#84CC16", intensity: 4 },
  { emoji: "🙂", label: "Good", color: "#22C55E", intensity: 5 },
  { emoji: "😊", label: "Happy", color: "#06B6D4", intensity: 6 },
  { emoji: "😄", label: "Great", color: "#3B82F6", intensity: 7 },
  { emoji: "🤩", label: "Amazing", color: "#8B5CF6", intensity: 8 },
  { emoji: "🥳", label: "Fantastic", color: "#EC4899", intensity: 9 },
  { emoji: "🚀", label: "Incredible", color: "#F59E0B", intensity: 10 },
]

export default function HomeScreen() {
  const { streak, buddy, medsTaken, todaysMood, updateStreak, setMedsTaken, setTodaysMood, addMoodEntry } = useApp()

  const [currentJoke, setCurrentJoke] = useState("")
  const [showJokePunchline, setShowJokePunchline] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(todaysMood)

  const bounceAnim = useRef(new Animated.Value(1)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    setCurrentJoke(jokes[Math.floor(Math.random() * jokes.length)])

    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleCheckIn = async () => {
    await updateStreak()
    Vibration.vibrate(50)

    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleMedsResponse = (taken: boolean) => {
    setMedsTaken(taken)
    Vibration.vibrate(30)
  }

  const handleMoodSelect = (emoji: string, intensity: number) => {
    setSelectedMood(emoji)
    setTodaysMood(emoji)

    const today = new Date().toISOString().split("T")[0]
    addMoodEntry({
      date: today,
      emoji,
      intensity,
    })

    Vibration.vibrate(40)
  }

  const shareJoke = async () => {
    try {
      await Share.share({
        message: `${currentJoke}\n\nShared from HeyBuddy - Your daily dose of joy! 😊`,
      })
    } catch (error) {
      console.error("Error sharing joke:", error)
    }
  }

  const revealPunchline = () => {
    setShowJokePunchline(true)
    setTimeout(() => setShowJokePunchline(false), 3000)
  }

  const getStreakMessage = () => {
    if (streak === 0) return "Ready to start your wellness journey? 🌟"
    if (streak === 1) return "Great start! You're building momentum! 🎉"
    if (streak < 7) return `${streak} days strong! You're on fire! 🔥`
    if (streak < 30) return `Wow! ${streak} days of consistency! 💪`
    return `Incredible! ${streak} days of wellness! You're a champion! 🏆`
  }

  const getBuddyMessage = () => {
    const messages = buddy.messages
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4F46E5", "#7C3AED", "#EC4899"]} style={styles.background} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.appTitle}>HeyBuddy</Text>
            <PulseAnimation>
              <Text style={[styles.buddyEmoji, { color: buddy.color }]}>{buddy.emoji}</Text>
            </PulseAnimation>
          </View>
        </Animated.View>

        {/* Buddy Greeting */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Card style={styles.greetingCard}>
            <Text style={styles.greetingText}>{buddy.name} says hi! 👋</Text>
            <Text style={styles.buddyMessage}>{getBuddyMessage()}</Text>
          </Card>
        </Animated.View>

        {/* Check-in Button */}
        <Animated.View style={[{ opacity: fadeAnim }, { transform: [{ scale: bounceAnim }] }]}>
          <Card style={styles.checkInCard}>
            <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn} activeOpacity={0.8}>
              <LinearGradient colors={["#F97316", "#EA580C"]} style={styles.checkInGradient}>
                <Text style={styles.checkInText}>Today's Check-In</Text>
                <Text style={styles.checkInEmoji}>✨</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.streakContainer}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakText}>{getStreakMessage()}</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Medication Tracker */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Card style={styles.medsCard}>
            <Text style={styles.cardTitle}>Did you take your meds? 💊</Text>
            <View style={styles.medsButtons}>
              <TouchableOpacity
                style={[styles.medsButton, styles.yesButton, medsTaken && styles.selectedButton]}
                onPress={() => handleMedsResponse(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.medsButtonText, medsTaken && styles.selectedButtonText]}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.medsButton, styles.noButton, medsTaken === false && styles.selectedButton]}
                onPress={() => handleMedsResponse(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.medsButtonText, medsTaken === false && styles.selectedButtonText]}>No</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>

        {/* Mood Selector */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Card style={styles.moodCard}>
            <Text style={styles.cardTitle}>How do you feel? 💭</Text>
            <EmojiSelector emojis={moodEmojis} selectedEmoji={selectedMood} onSelect={handleMoodSelect} />
          </Card>
        </Animated.View>

        {/* Daily Joke */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Card style={styles.jokeCard}>
            <Text style={styles.cardTitle}>Here's a joke for you: 😄</Text>
            <Text style={styles.jokeText}>{currentJoke}</Text>

            <View style={styles.jokeActions}>
              <TouchableOpacity style={styles.shareButton} onPress={shareJoke} activeOpacity={0.8}>
                <Text style={styles.shareButtonText}>Share Joy 📤</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.newJokeButton}
                onPress={() => setCurrentJoke(jokes[Math.floor(Math.random() * jokes.length)])}
                activeOpacity={0.8}
              >
                <Text style={styles.newJokeButtonText}>New Joke 🎲</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>

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
    height: height,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginRight: 15,
  },
  buddyEmoji: {
    fontSize: 40,
  },
  greetingCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  buddyMessage: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 22,
  },
  checkInCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
  },
  checkInButton: {
    marginBottom: 20,
  },
  checkInGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkInText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginRight: 8,
  },
  checkInEmoji: {
    fontSize: 18,
  },
  streakContainer: {
    alignItems: "center",
  },
  streakEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#F97316",
    marginBottom: 5,
  },
  streakText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  medsCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
    textAlign: "center",
  },
  medsButtons: {
    flexDirection: "row",
    gap: 12,
  },
  medsButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  yesButton: {
    backgroundColor: "#DBEAFE",
  },
  noButton: {
    backgroundColor: "#DBEAFE",
  },
  selectedButton: {
    backgroundColor: "#3B82F6",
  },
  medsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
  },
  selectedButtonText: {
    color: "white",
  },
  moodCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
  },
  jokeCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
  },
  jokeText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  jokeActions: {
    flexDirection: "row",
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  shareButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  newJokeButton: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  newJokeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  bottomSpacer: {
    height: 20,
  },
})
