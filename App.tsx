import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import HomeScreen from "./screens/HomeScreen"
import MoodCalendarScreen from "./screens/MoodCalendarScreen"
import BuddyScreen from "./screens/BuddyScreen"
import StatsScreen from "./screens/StatsScreen"
import { AppProvider } from "./context/AppContext"
import TabBar from "./components/TabBar"

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#4F46E5" />
            <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Mood" component={MoodCalendarScreen} />
              <Tab.Screen name="Buddy" component={BuddyScreen} />
              <Tab.Screen name="Stats" component={StatsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}