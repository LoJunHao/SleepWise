/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to convert HH:MM string to minutes of the day
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}

// Helper to convert minutes of the day to HH:MM string
export function minutesToTimeString(minutes: number): string {
  const normalized = (minutes % 1440 + 1440) % 1440; // ensure non-negative
  const hours = Math.floor(normalized / 60);
  const mins = Math.floor(normalized % 60);
  const hoursStr = String(hours).padStart(2, "0");
  const minsStr = String(mins).padStart(2, "0");
  return `${hoursStr}:${minsStr}`;
}

// Convert HH:MM string to 12-hour format with AM/PM
export function formatTo12Hour(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = String(minutes).padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

// Calculate Sleep Cycle Times
// Feature 1: Bedtime Calculator - Wake-up time minus cycles + sleep onset
export function calculateBedtimes(
  wakeTimeStr: string,
  sleepOnsetMin: number,
  cycleLengthMin: number = 90
): { cycles: number; bedtime: string; durationHours: number }[] {
  const wakeMin = timeStringToMinutes(wakeTimeStr);
  
  // Return for 4, 5, and 6 sleep cycles
  return [6, 5, 4].map((cycles) => {
    const totalSleepMin = cycles * cycleLengthMin;
    // We go backwards by sleep duration and also subtract sleep onset to find when to get under the covers
    const bedtimeMin = wakeMin - totalSleepMin - sleepOnsetMin;
    return {
      cycles,
      bedtime: minutesToTimeString(bedtimeMin),
      durationHours: Number((totalSleepMin / 60).toFixed(1))
    };
  });
}

// Feature 2: Wake-up Calculator - Bedtime plus cycles + sleep onset
export function calculateWakeTimes(
  bedtimeStr: string,
  sleepOnsetMin: number,
  cycleLengthMin: number = 90
): { cycles: number; wakeTime: string; durationHours: number }[] {
  const bedtimeMin = timeStringToMinutes(bedtimeStr);
  
  // Return for 4, 5, and 6 sleep cycles
  return [4, 5, 6].map((cycles) => {
    const totalSleepMin = cycles * cycleLengthMin;
    // We go forwards by sleep onset to fall asleep, then add total sleep cycles
    const wakeMin = bedtimeMin + sleepOnsetMin + totalSleepMin;
    return {
      cycles,
      wakeTime: minutesToTimeString(wakeMin),
      durationHours: Number((totalSleepMin / 60).toFixed(1))
    };
  });
}

// Feature 3: Sleep Duration and Efficiency Calculator
export interface SleepDurationAnalysis {
  timeInBedMinutes: number;
  timeAsleepMinutes: number;
  sleepEfficiency: number;
  durationHours: string;
  feedback: string;
}

export function analyzeSleepDuration(
  bedtimeStr: string,
  wakeTimeStr: string,
  sleepOnsetMin: number
): SleepDurationAnalysis {
  let bedMin = timeStringToMinutes(bedtimeStr);
  let wakeMin = timeStringToMinutes(wakeTimeStr);

  if (wakeMin < bedMin) {
    wakeMin += 1440; // Sleep crosses midnight
  }

  const timeInBedMinutes = wakeMin - bedMin;
  
  // Deduct sleep onset, and allow a standard micro-arousal adjustment (typically 15 minutes of nighttime awake time is healthy and normal)
  const typicalWakingMin = 15;
  const timeAsleepMinutes = Math.max(0, timeInBedMinutes - sleepOnsetMin - typicalWakingMin);
  
  const sleepEfficiency = Math.round(
    timeInBedMinutes > 0 ? (timeAsleepMinutes / timeInBedMinutes) * 100 : 0
  );

  const durationHours = (timeAsleepMinutes / 60).toFixed(1);
  const hoursNum = parseFloat(durationHours);

  let feedback = "";
  if (hoursNum < 6) {
    feedback = "This sleep duration is significantly below the recommended 7–9 hours for adults. Over time, this builds sleep debt and impacts immune response, memory, and cognitive performance.";
  } else if (hoursNum >= 6 && hoursNum < 7) {
    feedback = "A bit on the shorter side. Many adults need at least 7 hours to avoid building up mild physical and cognitive fatigue.";
  } else if (hoursNum >= 7 && hoursNum <= 9) {
    feedback = "Optimal sleep duration! You are in the recommended 7–9 hour range for healthy adults, which supports physical cell repair, cognitive restoration, and emotional stability.";
  } else {
    feedback = "Longer than average sleep duration. While occasionally normal for active recovery, consistent sleep over 9 hours can sometimes be a sign of poor sleep quality or other physiological factors.";
  }

  return {
    timeInBedMinutes,
    timeAsleepMinutes,
    sleepEfficiency: Math.min(100, Math.max(0, sleepEfficiency)),
    durationHours,
    feedback
  };
}

// Feature 4: Sleep Debt Accumulation
export function calculateSleepDebt(
  dailyHours: number[], // Monday (0) to Sunday (6)
  targetHours: number
): {
  totalSlept: number;
  averageSlept: number;
  debt: number;
  recommendation: string;
} {
  const totalSlept = dailyHours.reduce((sum, h) => sum + h, 0);
  const averageSlept = Number((totalSlept / 7).toFixed(1));
  
  // Calculate deficit day by day, avoiding negative debt (oversleeping on one night doesn't perfectly erase previous sleep debt)
  // Scientific consensus is that catching up on sleep helps, but you can't undo several days of sleep deprivation in one session.
  const debt = dailyHours.reduce((acc, h) => {
    const dailyDeficit = targetHours - h;
    return acc + (dailyDeficit > 0 ? dailyDeficit : 0);
  }, 0);

  let recommendation = "";
  if (debt === 0) {
    recommendation = "Incredible sleep consistency! You have zero sleep debt. Keep up this regular rhythm to optimize daytime focus.";
  } else if (debt <= 3) {
    recommendation = "Mild sleep debt. You can easily catch up by going to bed 15-30 minutes earlier for the next 2-3 nights, or with a brief 20-minute power nap in the afternoon.";
  } else if (debt <= 7) {
    recommendation = "Moderate sleep debt. To recover, avoid sleeping in excessively on weekends (which causes 'social jet lag'). Instead, extend your sleep duration by 30-45 minutes over several consecutive nights.";
  } else {
    recommendation = `Significant sleep debt of ${debt.toFixed(1)} hours. To pay this back without disrupting your circadian rhythm, spread your recovery sleep across the upcoming week (adding 45-60 minutes per night) rather than oversleeping in a single day. Make regular bedtime and wake times a priority.`;
  }

  return {
    totalSlept,
    averageSlept,
    debt: Number(debt.toFixed(1)),
    recommendation
  };
}

// Feature 9: Caffeine Clearance Curve Simulation
export function simulateCaffeineClearance(
  initialMg: number,
  hoursElapsed: number,
  halfLifeHours: number = 5
): {
  remainingMg: number;
  effectLevel: "Strong" | "Moderate" | "Negligible";
  clearancePercent: number;
} {
  // Caffeine clearance formula: C(t) = C_0 * (0.5 ^ (t / T_1/2))
  const remainingMg = initialMg * Math.pow(0.5, hoursElapsed / halfLifeHours);
  
  let effectLevel: "Strong" | "Moderate" | "Negligible" = "Negligible";
  if (remainingMg > 50) {
    effectLevel = "Strong";
  } else if (remainingMg > 15) {
    effectLevel = "Moderate";
  }

  const clearancePercent = Math.round(((initialMg - remainingMg) / initialMg) * 100);

  return {
    remainingMg: Number(remainingMg.toFixed(1)),
    effectLevel,
    clearancePercent
  };
}

// Feature 10: Jet Lag Shift Schedule Planner
export interface JetLagPlan {
  daysBeforeDeparture: number;
  shiftDirection: string;
  lightExposureTip: string;
  avoidLightTip: string;
  melatoninTip: string;
  medicalDisclaimer: string;
}

export function generateJetLagPlan(
  direction: "east" | "west",
  timeDiffHours: number,
  daysToTrip: number
): JetLagPlan {
  const medicalDisclaimer = "Disclaimer: Melatonin recommendations are educational and for jet lag management only. Consult a healthcare provider before taking supplements, especially if you have existing health conditions.";

  if (timeDiffHours === 0) {
    return {
      daysBeforeDeparture: 0,
      shiftDirection: "No timezone change detected.",
      lightExposureTip: "Enjoy standard sunlight during daytime to maintain current rhythms.",
      avoidLightTip: "Avoid intense blue screens within 1 hour of your regular bedtime.",
      melatoninTip: "No melatonin needed as you aren't crossing any timezone boundaries.",
      medicalDisclaimer
    };
  }

  if (direction === "east") {
    // Eastbound: advancing circadian rhythm (moving bedtime and wake-up earlier)
    return {
      daysBeforeDeparture: Math.min(daysToTrip, 3),
      shiftDirection: `Eastward Travel (Phase Advance by +${timeDiffHours} hours). You need to shift your internal clock EARLIER.`,
      lightExposureTip: "Seek bright sunlight early in the morning (around 7 AM to 9 AM local time) to help pull your circadian rhythm forward.",
      avoidLightTip: "Avoid strong indoor lighting and screens in the evening (after 7 PM local time) to allow melatonin to naturally rise earlier.",
      melatoninTip: `Take a low dose of melatonin (0.5mg – 1.5mg) about 2–3 hours before your desired bedtime in the new timezone (usually starting the evening of arrival, or 1 day before departure if shifting early).`,
      medicalDisclaimer
    };
  } else {
    // Westbound: delaying circadian rhythm (moving bedtime and wake-up later)
    return {
      daysBeforeDeparture: Math.min(daysToTrip, 3),
      shiftDirection: `Westward Travel (Phase Delay by -${timeDiffHours} hours). You need to shift your internal clock LATER.`,
      lightExposureTip: "Seek bright daylight or sunlight in the late afternoon and evening (5 PM to 8 PM destination time) to help delay your clock.",
      avoidLightTip: "Avoid bright light if you wake up in the middle of the night or too early in the destination morning (before 6 AM local time).",
      melatoninTip: `Melatonin is generally less required for westward trips, but if needed, a small dose can be taken if you wake up too early in the local morning to help you fall back asleep, or at your desired local bedtime if struggling to stay asleep.`,
      medicalDisclaimer
    };
  }
}
