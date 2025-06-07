import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useApp } from "../context/AppContext"
import Card from "../components/Card"

const { width } = Dimensions.get("window")

export default function StatsScreen() {
  const { streak, moodEntries } = useApp()

  const getWeeklyMoodAverage = () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentMoods = moodEntries.filter((entry) => new Date(entry.date) >= oneWeekAgo)

    if (recentMoods.length === 0) return 0

    const average = recentMoods.reduce((sum, entry) => sum + entry.intensity, 0) / recentMoods.length
    return Math.round(average * 10) / 10
  }

  const getMoodTrend = () => {
    if (moodEntries.length < 2) return "stable"

    const recent = moodEntries.slice(-3)
    const older = moodEntries.slice(-6, -3)

    const recentAvg = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length
    const olderAvg = older.reduce((sum, entry) => sum + entry.intensity, 0) / older.length

    if (recentAvg > olderAvg + 0.5) return "improving"
    if (recentAvg < olderAvg - 0.5) return "declining"
    return "stable"
  }

  const getTrendEmoji = () => {
    const trend = getMoodTrend()
    switch (trend) {
      case "improving":
        return "📈"
      case "declining":
        return "📉"
      default:
        return "➡️"
    }
  }

  const getTrendColor = () => {
    const trend = getMoodTrend()
    switch (trend) {
      case "improving":
        return "#10B981"
      case "declining":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#3B82F6", "#1D4ED8", "#1E40AF"]} style={styles.background} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Stats 📊</Text>
          <Text style={styles.subtitle}>Track your wellness journey</Text>
        </View>

        {/* Streak Card */}
        <Card style={styles.streakCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statEmoji}>🔥</Text>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Current Streak</Text>
              <Text style={styles.statValue}>{streak} days</Text>
            </View>
          </View>
          <Text style={styles.statDescription}>
            {streak === 0
              ? "Start your wellness journey today!"
              : streak < 7
                ? "Great start! Keep building momentum!"
                : streak < 30
                  ? "You're on fire! Amazing consistency!"
                  : "Incredible dedication! You're a wellness champion!"}
          </Text>
        </Card>

        {/* Mood Average */}
        <Card style={styles.moodCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statEmoji}>😊</Text>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Weekly Mood Average</Text>
              <Text style={styles.statValue}>{getWeeklyMoodAverage()}/10</Text>
            </View>
          </View>
          <View style={styles.moodBar}>
            <View style={[styles.moodBarFill, { width: `${(getWeeklyMoodAverage() / 10) * 100}%` }]} />
          </View>
        </Card>

        {/* Mood Trend */}
        <Card style={styles.trendCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statEmoji}>{getTrendEmoji()}</Text>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Mood Trend</Text>
              <Text style={[styles.statValue, { color: getTrendColor() }]}>
                {getMoodTrend().charAt(0).toUpperCase() + getMoodTrend().slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.statDescription}>
            {getMoodTrend() === "improving"
              ? "Your mood is trending upward! 🌟"
              : getMoodTrend() === "declining"
                ? "Take care of yourself. You've got this! 💪"
                : "Your mood is steady. Keep up the good work! ✨"}
          </Text>
        </Card>

        {/* Total Check-ins */}
        <Card style={styles.checkInsCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statEmoji}>✅</Text>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Total Check-ins</Text>
              <Text style={styles.statValue}>{moodEntries.length}</Text>
            </View>
          </View>
          <Text style={styles.statDescription}>Every check-in is a step toward better wellness!</Text>
        </Card>

        {/* Achievements */}
        <Card style={styles.achievementsCard}>
          <Text style={styles.achievementsTitle}>Achievements 🏆</Text>
          <View style={styles.achievementsList}>
            {streak >= 1 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementEmoji}>🌟</Text>
                <Text style={styles.achievementText}>First Check-in</Text>
              </View>
            )}
            {streak >= 7 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementEmoji}>🔥</Text>
                <Text style={styles.achievementText}>Week Warrior</Text>
              </View>
            )}
            {streak >= 30 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementEmoji}>💎</Text>
                <Text style={styles.achievementText}>Month Master</Text>
              </View>
            )}
            {moodEntries.length >= 10 && (
              <View style={styles.achievement}>
                <Text style={styles.achievementEmoji}>📊</Text>
                <Text style={styles.achievementText}>Data Collector</Text>
              </View>
            )}
          </View>
        </Card>

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
  streakCard: {
    margin: 20,
    marginBottom: 15,
    padding: 20,
  },
  moodCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
  },
  trendCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
  },
  checkInsCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  moodBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  moodBarFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  achievementsCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
    textAlign: "center",
  },
  achievementsList: {
    gap: 12,
  },
  achievement: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 12,
  },
  achievementEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  bottomSpacer: {
    height: 100,
  },
})
