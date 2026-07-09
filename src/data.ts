/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion, SleepHygieneItem, CaffeineItem } from "./types";

export const CHRONOTYPE_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "If you had entirely free time and no commitments, what time would you prefer to wake up?",
    options: [
      { text: "5:00 AM – 6:30 AM", score: 1, description: "Early riser, typical morning type" },
      { text: "6:30 AM – 8:30 AM", score: 2, description: "Adaptable, intermediate type" },
      { text: "8:30 AM – 11:00 AM (or later)", score: 3, description: "Late riser, classic evening type" }
    ]
  },
  {
    id: 2,
    question: "During the first half-hour after waking up in the morning, how alert or energetic do you feel?",
    options: [
      { text: "Very alert and energetic", score: 1 },
      { text: "Fairly alert, with occasional grogginess", score: 2 },
      { text: "Completely exhausted and slow to start", score: 3 }
    ]
  },
  {
    id: 3,
    question: "What time of day do you find yourself feeling most focused, creative, and productive?",
    options: [
      { text: "Morning (8:00 AM – 12:00 PM)", score: 1 },
      { text: "Afternoon (12:00 PM – 5:00 PM)", score: 2 },
      { text: "Late evening (6:00 PM – 11:00 PM or night)", score: 3 }
    ]
  },
  {
    id: 4,
    question: "How easy do you find it to fall asleep in the evening within 15-20 minutes of getting into bed?",
    options: [
      { text: "Very easy, usually asleep by 9:30 PM – 10:30 PM", score: 1 },
      { text: "Moderate, usually asleep by 10:30 PM – 12:00 AM", score: 2 },
      { text: "Difficult to wind down, rarely asleep before 12:00 AM", score: 3 }
    ]
  },
  {
    id: 5,
    question: "If you have an important task or exam, when would you feel most capable of performing at your absolute peak?",
    options: [
      { text: "Early morning (8:30 AM)", score: 1 },
      { text: "Mid-day (1:30 PM)", score: 2 },
      { text: "Evening (7:00 PM)", score: 3 }
    ]
  }
];

export const SLEEP_HYGIENE_ITEMS: SleepHygieneItem[] = [
  {
    id: "dark_room",
    label: "Completely Dark Room",
    category: "environment",
    impact: 15,
    tip: "Use blackout curtains or an eye mask. Ambient light suppresses melatonin synthesis."
  },
  {
    id: "cool_room",
    label: "Cool Room Temperature (60-67°F / 15-19°C)",
    category: "environment",
    impact: 15,
    tip: "A drop in core body temperature is a biological signal for sleep. Keep your room cool."
  },
  {
    id: "no_caffeine_after_2",
    label: "No Caffeine after 2:00 PM (or 8-10h before bed)",
    category: "behavior",
    impact: 15,
    tip: "Caffeine blocks adenosine receptors. It has a long half-life (around 5 hours) and disrupts deep sleep."
  },
  {
    id: "regular_schedule",
    label: "Consistent Bed and Wake Times (±30 mins daily)",
    category: "timing",
    impact: 20,
    tip: "Anchoring your wake time strengthens your circadian clock, leading to smoother sleep onset."
  },
  {
    id: "screen_reduction",
    label: "No Blue Screens 1 Hour Before Bed",
    category: "behavior",
    impact: 20,
    tip: "Blue light blocks melatonin. Switch to warm lighting or read a physical book to wind down."
  },
  {
    id: "daily_exercise",
    label: "Regular Physical Exercise (but not right before bed)",
    category: "behavior",
    impact: 15,
    tip: "Moderate activity increases slow-wave (deep) sleep. Avoid vigorous workouts 2 hours before bedtime."
  }
];

export const CAFFEINE_ITEMS: CaffeineItem[] = [
  { id: "coffee", name: "Standard Brewed Coffee (8 oz)", caffeineMg: 95, icon: "☕" },
  { id: "espresso", name: "Double Shot Espresso (2 oz)", caffeineMg: 120, icon: "🔥" },
  { id: "black_tea", name: "Black Tea (8 oz)", caffeineMg: 47, icon: "🍵" },
  { id: "green_tea", name: "Green Tea (8 oz)", caffeineMg: 30, icon: "🌿" },
  { id: "energy_drink", name: "Energy Drink (12 oz)", caffeineMg: 110, icon: "⚡" },
  { id: "soda", name: "Cola / Soda (12 oz)", caffeineMg: 35, icon: "🥤" }
];

export const NAP_TYPES = [
  {
    id: "energy",
    title: "The Power Nap (20 Minutes)",
    duration: 20,
    benefits: "Boosts alertness, motor performance, and energy. Stops before entering slow-wave sleep, avoiding sleep inertia (grogginess).",
    bestTime: "Early afternoon (1:00 PM – 3:00 PM) when circadian alertness naturally dips.",
    warning: "Keep it under 25 minutes to avoid waking up groggy."
  },
  {
    id: "recovery",
    title: "The Cognitive Reboot (30-45 Minutes)",
    duration: 35,
    benefits: "Improves decision-making, memory retrieval, and cognitive stamina. Allows a brief dip into stage 2 and slow-wave sleep.",
    bestTime: "Early afternoon. Best suited for high-stress situations or when sleep-deprived.",
    warning: "Can cause mild sleep inertia. Give yourself 10-15 minutes to fully wake up."
  },
  {
    id: "learning",
    title: "The Full Sleep Cycle (90 Minutes)",
    duration: 90,
    benefits: "Runs through a full sleep cycle (Light -> Deep -> REM). Facilitates procedural memory consolidation, creativity, and emotional recovery.",
    bestTime: "When you have a safe time window. Highly restorative for shift workers or athletes.",
    warning: "Should be timed carefully to avoid disrupting nighttime sleep."
  }
];
