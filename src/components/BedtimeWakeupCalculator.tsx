/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Moon, Sunrise, Clock, AlertCircle, Sparkles } from "lucide-react";
import { calculateBedtimes, calculateWakeTimes, formatTo12Hour } from "../sleepMath";

export default function BedtimeWakeupCalculator() {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [bedtime, setBedtime] = useState("22:30");
  const [sleepOnset, setSleepOnset] = useState(15);
  const [cycleLength, setCycleLength] = useState(90);
  const [activeTab, setActiveTab] = useState<"bedtime" | "wake">("bedtime");

  const bedtimesResult = calculateBedtimes(wakeTime, sleepOnset, cycleLength);
  const wakeTimesResult = calculateWakeTimes(bedtime, sleepOnset, cycleLength);

  return (
    <div id="bedtime-wake-calc-container" className="bg-sleep-navy-light rounded-3xl p-8 border border-white/5 shadow-xl">
      {/* Tab Selector */}
      <div className="flex bg-sleep-dark/60 p-1.5 rounded-xl mb-6">
        <button
          id="btn-tab-bedtime"
          onClick={() => setActiveTab("bedtime")}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === "bedtime"
              ? "bg-sleep-blue text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-sleep-navy-light/30"
          }`}
        >
          <Moon className="w-4 h-4" />
          Find Bedtime
        </button>
        <button
          id="btn-tab-waketime"
          onClick={() => setActiveTab("wake")}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === "wake"
              ? "bg-sleep-blue text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-sleep-navy-light/30"
          }`}
        >
          <Sunrise className="w-4 h-4" />
          Find Wake-Up Time
        </button>
      </div>

      {/* Shared Configuration Controls (Sleep Onset & Cycle Duration) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-sleep-dark/50 rounded-2xl border border-white/5">
        <div>
          <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sleep-blue" />
            Sleep Onset Latency (Customizable)
          </label>
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 15, 20, 30].map((mins) => (
              <button
                key={mins}
                id={`btn-onset-${mins}`}
                onClick={() => setSleepOnset(mins)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  sleepOnset === mins
                    ? "bg-[#2B7FFF] border-[#2B7FFF] text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Average adults take 10–20 minutes to fall asleep once in bed.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Average Cycle Length: {cycleLength} mins</span>
            <span className="text-[10px] bg-sleep-blue/20 text-sleep-lavender px-2 py-0.5 rounded-full font-mono">
              Research Variant
            </span>
          </label>
          <input
            id="slider-cycle-length"
            type="range"
            min="70"
            max="120"
            step="5"
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="w-full accent-sleep-blue cursor-pointer h-1.5 bg-sleep-dark rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
            <span>70m (Shorter)</span>
            <span>90m (Standard)</span>
            <span>120m (Longer)</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "bedtime" ? (
        <div id="bedtime-calculator-form">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What time do you need to wake up?
            </label>
            <div className="relative">
              <input
                id="input-wake-time"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sleep-blue text-lg font-semibold tracking-wide"
              />
              <Sunrise className="absolute right-4 top-4 text-sleep-lavender/40 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <h3 className="text-sm font-semibold text-sleep-lavender uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sleep-lavender" />
            Recommended Bedtimes (Based on Sleep Cycles)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {bedtimesResult.map((res, index) => {
              // Highlight 5 cycles as optimal
              const isOptimal = res.cycles === 5;
              return (
                <div
                  key={res.cycles}
                  id={`bedtime-card-cycles-${res.cycles}`}
                  className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isOptimal
                      ? "bg-sleep-dark/50 border-[#2B7FFF]/20 text-white shadow-lg scale-[1.02] md:scale-105"
                      : "bg-sleep-dark/50 border-white/5 text-gray-300"
                  }`}
                >
                  {isOptimal && (
                    <div className="absolute top-0 right-0 p-2">
                      <svg width="12" height="12" fill="#2B7FFF" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold uppercase text-[#B0B8C1] tracking-wider">
                        {res.cycles} Cycles ({res.cycles * 1.5}h)
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {formatTo12Hour(res.bedtime)}
                    </div>
                    <div className="text-[10px] text-[#B7B5FF] mt-1">
                      Variance: {formatTo12Hour(res.bedtime)}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#B0B8C1] mt-4 border-t border-white/5 pt-2">
                    Head to bed at <span className="text-white font-medium">{formatTo12Hour(res.bedtime)}</span> to allow {sleepOnset}m to drift off.
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div id="waketime-calculator-form">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What time do you plan on going to bed?
            </label>
            <div className="relative">
              <input
                id="input-bed-time"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sleep-blue text-lg font-semibold tracking-wide"
              />
              <Moon className="absolute right-4 top-4 text-sleep-lavender/40 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <h3 className="text-sm font-semibold text-sleep-lavender uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sleep-lavender" />
            Recommended Wake-Up Times
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {wakeTimesResult.map((res) => {
              const isOptimal = res.cycles === 5;
              return (
                <div
                  key={res.cycles}
                  id={`waketime-card-cycles-${res.cycles}`}
                  className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isOptimal
                      ? "bg-sleep-dark/50 border-[#2B7FFF]/20 text-white shadow-lg scale-[1.02] md:scale-105"
                      : "bg-sleep-dark/50 border-white/5 text-gray-300"
                  }`}
                >
                  {isOptimal && (
                    <div className="absolute top-0 right-0 p-2">
                      <svg width="12" height="12" fill="#2B7FFF" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold uppercase text-[#B0B8C1] tracking-wider">
                        {res.cycles} Cycles ({res.cycles * 1.5}h)
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {formatTo12Hour(res.wakeTime)}
                    </div>
                    <div className="text-[10px] text-[#B7B5FF] mt-1">
                      Variance: {formatTo12Hour(res.wakeTime)}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#B0B8C1] mt-4 border-t border-white/5 pt-2">
                    Wake up fresh after full sleep cycles, minimizing sleep inertia.
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scientific Uncertainty Alert Callout */}
      <div className="bg-sleep-dark/40 border border-white/5 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-sleep-blue mt-0.5 shrink-0" />
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">
            Understanding Individual Variation (AASM Evidence-Based Note)
          </h4>
          <p className="text-xs text-[#B0B8C1] leading-relaxed">
            Many people average around <strong>90-minute sleep cycles</strong>, but cycle lengths vary dynamically between <strong>70 and 120 minutes</strong> throughout the night. Your first sleep cycles are richer in deep NREM sleep, while later cycles are dominated by REM (dream) sleep. These calculations represent high-probability cycles, but should be used as a guideline rather than strict laws.
          </p>
        </div>
      </div>
    </div>
  );
}
