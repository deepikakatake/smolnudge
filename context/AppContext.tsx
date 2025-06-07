"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface MoodEntry {
  date: string
  emoji: string
  intensity: number
  note?: string
}

interface BuddyPersonality {
  id: string
  name: string
  emoji: string
  color: string
  messages: string[]
}

interface AppContextType {
  streak: number
  lastCheckIn: string | null
  buddy: BuddyPersonality
  moodEntries: MoodEntry[]
  medsTaken: boolean
  todaysMood: string | null
  updateStreak: () => Promise<void>
  setBuddy: (buddy: BuddyPersonality) => void
  addMoodEntry: (entry: MoodEntry) => void
  setMedsTaken: (taken: boolean) => void
  setTodaysMood: (mood: string) => void
}

const buddyPersonalities: BuddyPersonality[] = [
  {
    id: "cheerful",
    name: "Sunny",
    emoji: "🌞",
    color: "#FFD700",
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
    messages: [
      "Let's conquer this day together! 🚀",
      "You've got the power! 💪",
      "Energy level: MAXIMUM! ⚡",
      "Nothing can stop us today! 🔥",
    ],
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState(0)
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null)
  const [buddy, setBuddyState] = useState<BuddyPersonality>(buddyPersonalities[0])
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [medsTaken, setMedsTakenState] = useState(false)
  const [todaysMood, setTodaysMoodState] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const savedStreak = await AsyncStorage.getItem("streak")
      const savedLastCheckIn = await AsyncStorage.getItem("lastCheckIn")
      const savedBuddy = await AsyncStorage.getItem("buddy")
      const savedMoodEntries = await AsyncStorage.getItem("moodEntries")
      const savedMedsTaken = await AsyncStorage.getItem("medsTaken")
      const savedTodaysMood = await AsyncStorage.getItem("todaysMood")

      if (savedStreak) setStreak(Number.parseInt(savedStreak))
      if (savedLastCheckIn) setLastCheckIn(savedLastCheckIn)
      if (savedBuddy) setBuddyState(JSON.parse(savedBuddy))
      if (savedMoodEntries) setMoodEntries(JSON.parse(savedMoodEntries))
      if (savedMedsTaken) setMedsTakenState(JSON.parse(savedMedsTaken))
      if (savedTodaysMood) setTodaysMoodState(savedTodaysMood)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const updateStreak = async () => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    if (lastCheckIn === today) return

    let newStreak = 1
    if (lastCheckIn === yesterday) {
      newStreak = streak + 1
    }

    setStreak(newStreak)
    setLastCheckIn(today)

    await AsyncStorage.setItem("streak", newStreak.toString())
    await AsyncStorage.setItem("lastCheckIn", today)
  }

  const setBuddy = async (newBuddy: BuddyPersonality) => {
    setBuddyState(newBuddy)
    await AsyncStorage.setItem("buddy", JSON.stringify(newBuddy))
  }

  const addMoodEntry = async (entry: MoodEntry) => {
    const newEntries = [...moodEntries.filter((e) => e.date !== entry.date), entry]
    setMoodEntries(newEntries)
    await AsyncStorage.setItem("moodEntries", JSON.stringify(newEntries))
  }

  const setMedsTaken = async (taken: boolean) => {
    setMedsTakenState(taken)
    await AsyncStorage.setItem("medsTaken", JSON.stringify(taken))
  }

  const setTodaysMood = async (mood: string) => {
    setTodaysMoodState(mood)
    await AsyncStorage.setItem("todaysMood", mood)
  }

  return (
    <AppContext.Provider
      value={{
        streak,
        lastCheckIn,
        buddy,
        moodEntries,
        medsTaken,
        todaysMood,
        updateStreak,
        setBuddy,
        addMoodEntry,
        setMedsTaken,
        setTodaysMood,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
