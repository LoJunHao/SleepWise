/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Chronotype {
  Morning = "Morning Chronotype (Lark)",
  Intermediate = "Intermediate Chronotype (Bear)",
  Evening = "Evening Chronotype (Night Owl)"
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    score: number; // 1 = Morning, 2 = Intermediate, 3 = Evening
    description?: string;
  }[];
}

export interface SleepHygieneItem {
  id: string;
  label: string;
  category: "environment" | "behavior" | "timing";
  impact: number; // weight of this item in the 100-point score
  tip: string;
}

export interface DailySleepLog {
  id: string;
  day: string; // e.g., "Monday", "Tuesday", etc.
  bedtime: string; // "HH:MM"
  wakeTime: string; // "HH:MM"
  actualDuration: number; // hours
  quality: 1 | 2 | 3 | 4 | 5; // 1-5 scale
}

export interface CaffeineItem {
  id: string;
  name: string;
  caffeineMg: number;
  icon: string;
}

export interface JetLagInput {
  originTimezone: string;
  destinationTimezone: string;
  direction: "east" | "west";
  departureTime: string; // "HH:MM" or "YYYY-MM-DDTHH:MM"
  arrivalTime: string;
  daysToTrip: number;
}

export interface SleepCalculationResult {
  bedtime: string;
  wakeTime: string;
  durationHours: number;
  cyclesCount: number;
  sleepOnsetMinutes: number;
  scienceNote: string;
  uncertaintyMessage: string;
}
