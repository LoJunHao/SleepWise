/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Activity, HelpCircle, RefreshCw, CalendarRange, Clock } from "lucide-react";
import { timeStringToMinutes, minutesToTimeString, formatTo12Hour } from "../sleepMath";

interface DaySchedule {
  id: string;
  name: string;
  bedtime: string;
  wakeTime: string;
}

export default function SleepConsistencyTracker() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { id: "work1", name: "Workday / Weekday 1", bedtime: "22:30", wakeTime: "06:30" },
    { id: "work2", name: "Workday / Weekday 2", bedtime: "23:00", wakeTime: "07:00" },
    { id: "weekend", name: "Weekend / Day Off", bedtime: "00:30", wakeTime: "09:30" }
  ]);

  const handleTimeChange = (id: string, field: "bedtime" | "wakeTime", value: string) => {
    setSchedule(schedule.map((day) => (day.id === id ? { ...day, [field]: value } : day)));
  };

  // Convert bedtimes and waketimes to absolute minutes (handling crossings of midnight)
  const parsedSchedule = schedule.map((day) => {
    const bedMin = timeStringToMinutes(day.bedtime);
    let wakeMin = timeStringToMinutes(day.wakeTime);
    
    // Duration
    let durMin = wakeMin - bedMin;
    if (durMin < 0) {
      durMin += 1440; // crosses midnight
    }
    const durationHours = durMin / 60;

    return {
      ...day,
      bedMin,
      wakeMin,
      durationHours
    };
  });

  // Calculate variances
  const bedtimes = parsedSchedule.map((d) => d.bedMin);
  // To handle midnight wrap arounds for bedtimes (e.g. 22:30 is 1350 mins, 00:30 is 30 mins)
  const normalizedBedtimes = bedtimes.map((b) => (b > 1000 ? b - 1440 : b));
  
  const minBed = Math.min(...normalizedBedtimes);
  const maxBed = Math.max(...normalizedBedtimes);
  const bedVarianceHrs = (maxBed - minBed) / 60;

  const waketimes = parsedSchedule.map((d) => d.wakeMin);
  const minWake = Math.min(...waketimes);
  const maxWake = Math.max(...waketimes);
  const wakeVarianceHrs = (maxWake - minWake) / 60;

  // Average sleep duration
  const avgDuration = parsedSchedule.reduce((acc, d) => acc + d.durationHours, 0) / schedule.length;

  // Sleep Regularity Index (SRI)
  // Higher alignment = higher SRI. Max 100.
  // We deduct points for bedtime variance and wake variance.
  const sri = Math.max(
    25,
    Math.round(100 - bedVarianceHrs * 12 - wakeVarianceHrs * 15)
  );

  const getSriStatus = (val: number) => {
    if (val >= 85) return { text: "Optimal Regularity", color: "text-emerald-400", desc: "Your circadian anchor is highly stable, which enhances immune function and metabolic health." };
    if (val >= 65) return { text: "Moderate Regularity", color: "text-yellow-400", desc: "Some circadian drift exists. Weekend sleeping-in is creating mild 'social jet lag'." };
    return { text: "Irregular Rhythms", color: "text-red-400", desc: "High variance in sleep times forces your master biological clock to constantly recalibrate, causing fatigue." };
  };

  const status = getSriStatus(sri);

  return (
    <div id="sleep-consistency-tracker-container" className="bg-sleep-navy-light rounded-3xl p-8 border border-white/5 shadow-xl">
      {/* Inputs Header */}
      <h3 className="text-sm font-semibold text-sleep-lavender uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <CalendarRange className="w-4 h-4 text-sleep-blue" />
        Log Bed/Wake Times (Consistency Tracker)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {schedule.map((day) => (
          <div key={day.id} className="bg-sleep-dark/50 border border-white/5 rounded-2xl p-5">
            <span className="text-xs font-semibold text-white tracking-wide">{day.name}</span>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Bedtime</label>
                <input
                  id={`tracker-bedtime-${day.id}`}
                  type="time"
                  value={day.bedtime}
                  onChange={(e) => handleTimeChange(day.id, "bedtime", e.target.value)}
                  className="w-full bg-sleep-dark text-xs text-white border border-white/10 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-sleep-blue"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Wake Time</label>
                <input
                  id={`tracker-waketime-${day.id}`}
                  type="time"
                  value={day.wakeTime}
                  onChange={(e) => handleTimeChange(day.id, "wakeTime", e.target.value)}
                  className="w-full bg-sleep-dark text-xs text-white border border-white/10 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-sleep-blue"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SRI Score and Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-6">
        {/* SRI Circle Meter */}
        <div className="md:col-span-4 bg-sleep-dark/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <Activity className="w-6 h-6 text-sleep-blue mb-2" />
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Sleep Regularity Index</div>
          <div className={`text-4xl font-extrabold font-display my-1 ${status.color}`}>
            {sri} <span className="text-sm font-medium text-gray-400">/100</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed font-semibold mt-1">
            {status.text}
          </p>
        </div>

        {/* Variances Details */}
        <div className="md:col-span-8 bg-sleep-dark/30 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-sleep-dark/40 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Bedtime Drift</span>
              <div className="text-base font-bold text-white mt-1">
                {bedVarianceHrs === 0 ? "0h" : `${bedVarianceHrs.toFixed(1)}h variance`}
              </div>
            </div>

            <div className="bg-sleep-dark/40 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Wake-Up Drift</span>
              <div className="text-base font-bold text-white mt-1">
                {wakeVarianceHrs === 0 ? "0h" : `${wakeVarianceHrs.toFixed(1)}h variance`}
              </div>
            </div>

            <div className="bg-sleep-dark/40 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Avg Sleep Duration</span>
              <div className="text-base font-bold text-white mt-1">
                {avgDuration.toFixed(1)} hours
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            {status.desc} Consistent bedtime and wake times stabilize your body's temperature cycles and cortisol hormone spikes, leading to deeper restorative sleep stages and easier awakening.
          </p>
        </div>
      </div>

      {/* Custom Sleep Alignment SVG Timeline Visualizer */}
      <div className="bg-sleep-dark/60 rounded-2xl p-6 border border-white/5">
        <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-sleep-blue" />
          Circadian Alignment Timeline (Social Jet Lag visualizer)
        </h4>

        <div className="space-y-4">
          {parsedSchedule.map((day) => {
            // We want to draw a block representing sleep.
            // Let's draw a horizontal bar representing 24 hours (from 6:00 PM (18:00) to 12:00 PM (noon next day)).
            // Timeline starts at 18:00 (1080 minutes) and ends at 12:00 (720 minutes next day = 1080 + 1080 = 2160 total mins).
            // Width is 100%. Total represented span is 18 hours (1080 minutes).
            const timelineStartMin = 1080; // 6 PM
            const timelineTotalMin = 1080; // 18 hours span (from 6 PM to 12 PM next day)

            let sleepStart = day.bedMin;
            if (sleepStart < timelineStartMin && sleepStart > 200) {
              // Bedtime is earlier than 6 PM, or something. Standard bedtime is usually between 8 PM and 4 AM.
            }
            if (sleepStart >= 0 && sleepStart < 720) {
              sleepStart += 1440; // e.g. 1:00 AM becomes 1500 mins
            }

            let sleepEnd = day.wakeMin;
            if (sleepEnd >= 0 && sleepEnd < 720) {
              sleepEnd += 1440; // e.g. 7:00 AM becomes 1860 mins
            }

            const leftPercent = Math.max(0, Math.min(100, ((sleepStart - timelineStartMin) / timelineTotalMin) * 100));
            const widthPercent = Math.max(5, Math.min(100 - leftPercent, (day.durationHours * 60 / timelineTotalMin) * 100));

            return (
              <div key={day.id} className="relative">
                <div className="flex justify-between items-center mb-1 text-[11px] text-[#B0B8C1]">
                  <span className="font-semibold text-white">{day.name}</span>
                  <span>
                    {formatTo12Hour(day.bedtime)} – {formatTo12Hour(day.wakeTime)}
                  </span>
                </div>
                {/* Timeline background bar */}
                <div className="h-6 w-full bg-sleep-dark/80 rounded-full relative overflow-hidden border border-white/5">
                  {/* Sleep block */}
                  <div
                    className="absolute h-full bg-gradient-to-r from-sleep-blue to-[#B7B5FF]/60 rounded-full shadow-inner flex items-center justify-center text-[10px] font-bold text-white text-center"
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  >
                    Asleep
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline labels */}
        <div className="flex justify-between text-[9px] text-gray-500 mt-2 font-mono px-1">
          <span>6 PM</span>
          <span>9 PM</span>
          <span>12 AM</span>
          <span>3 AM</span>
          <span>6 AM</span>
          <span>9 AM</span>
          <span>12 PM</span>
        </div>
      </div>
    </div>
  );
}
