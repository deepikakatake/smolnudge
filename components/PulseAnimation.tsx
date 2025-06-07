"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Animated } from "react-native"

interface PulseAnimationProps {
  children: React.ReactNode
  duration?: number
}

export default function PulseAnimation({ children, duration = 2000 }: PulseAnimationProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start(() => pulse())
    }

    pulse()
  }, [pulseAnim, duration])

  return <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>{children}</Animated.View>
}
