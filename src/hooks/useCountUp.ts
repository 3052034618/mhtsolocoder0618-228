import { useState, useEffect, useRef } from 'react'

type EasingFn = (t: number) => number

const easings: Record<string, EasingFn> = {
  linear: (t) => t,
  easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
}

interface UseCountUpOptions {
  duration?: number
  easing?: keyof typeof easings | EasingFn
  startOnMount?: boolean
  decimals?: number
}

interface UseCountUpReturn {
  value: number
  start: () => void
  reset: () => void
  pause: () => void
  resume: () => void
  isAnimating: boolean
}

export function useCountUp(
  target: number,
  options: UseCountUpOptions = {}
): UseCountUpReturn {
  const {
    duration = 2000,
    easing = 'easeOutCubic',
    startOnMount = true,
    decimals = 0,
  } = options

  const [value, setValue] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState<boolean>(startOnMount)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedAtRef = useRef<number>(0)
  const startValueRef = useRef<number>(0)

  const easingFn: EasingFn =
    typeof easing === 'function' ? easing : easings[easing] || easings.easeOutCubic

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp - pausedAtRef.current
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easingFn(progress)
    const currentValue = startValueRef.current + (target - startValueRef.current) * easedProgress

    setValue(Number(currentValue.toFixed(decimals)))

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      setIsAnimating(false)
    }
  }

  const start = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    startValueRef.current = 0
    startTimeRef.current = null
    pausedAtRef.current = 0
    setIsAnimating(true)
    animationRef.current = requestAnimationFrame(animate)
  }

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    startTimeRef.current = null
    pausedAtRef.current = 0
    startValueRef.current = 0
    setValue(0)
    setIsAnimating(false)
  }

  const pause = () => {
    if (animationRef.current && startTimeRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
      pausedAtRef.current = performance.now() - startTimeRef.current
      startValueRef.current = value
      setIsAnimating(false)
    }
  }

  const resume = () => {
    if (!isAnimating && pausedAtRef.current > 0) {
      setIsAnimating(true)
      startTimeRef.current = null
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (startOnMount) {
      animationRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [target, duration])

  return { value, start, reset, pause, resume, isAnimating }
}
