"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useApp } from "../context/AppContext"
import Card from "../components/Card"

const { width } = Dimensions.get("window")

export default function MoodCalendarScreen() {
  const { moodEntries } = useApp()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }

  const getMoodForDate = (day: number) => {
    const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return moodEntries.find((entry) => entry.date === dateString)
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#EC4899", "#8B5CF6", "#3B82F6"]} style={styles.background} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Mood Calendar 📅</Text>
          <Text style={styles.subtitle}>Track your emotional journey</Text>
        </View>

        <Card style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <TouchableOpacity
              onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>←</Text>
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </Text>

            <TouchableOpacity
              onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              if (day === null) {
                return <View key={index} style={styles.emptyDay} />
              }

              const mood = getMoodForDate(day)
              const isToday =
                new Date().toDateString() ===
                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString()

              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayCell, isToday && styles.todayCell, mood && styles.moodCell]}
                >
                  <Text style={[styles.dayNumber, isToday && styles.todayText]}>{day}</Text>
                  {mood && <Text style={styles.dayMood}>{mood.emoji}</Text>}
                </TouchableOpacity>
              )
            })}
          </View>
        </Card>
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
  calendarCard: {
    margin: 20,
    padding: 20,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  weekDays: {
    flexDirection: "row",
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emptyDay: {
    width: (width - 80) / 7,
    height: 50,
  },
  dayCell: {
    width: (width - 80) / 7,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  todayCell: {
    backgroundColor: "#4F46E5",
  },
  moodCell: {
    backgroundColor: "#F0F9FF",
  },
  dayNumber: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  todayText: {
    color: "white",
    fontWeight: "bold",
  },
  dayMood: {
    fontSize: 12,
    marginTop: 2,
  },
})
