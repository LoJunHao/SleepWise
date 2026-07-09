/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Clock, CheckCircle2, ShieldAlert, Heart } from "lucide-react";
import { analyzeSleepDuration, formatTo12Hour } from "../sleepMath";

export default function SleepDurationCalculator() {
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepOnset, setSleepOnset] = useState(15);

  const analysis = analyzeSleepDuration(bedtime, wakeTime, sleepOnset);
  const hoursNum = parseFloat(analysis.durationHours);

  return (
    <div id="sleep-duration-calc-container" className="bg-sleep-navy-light rounded-3xl p-8 border border-white/5 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What time do you get into bed? (Bedtime)
          </label>
          <input
            id="duration-bedtime-input"
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sleep-blue text-base font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What time do you wake up?
          </label>
          <input
            id="duration-waketime-input"
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sleep-blue text-base font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sleep Onset Latency
          </label>
          <select
            id="duration-onset-select"
            value={sleepOnset}
            onChange={(e) => setSleepOnset(Number(e.target.value))}
            className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sleep-blue text-base font-semibold"
          >
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
          </select>
        </div>
      </div>

      {/* Analysis Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-sleep-dark/50 border border-white/5 rounded-2xl p-6 text-center">
          <Clock className="w-6 h-6 text-sleep-blue mx-auto mb-2" />
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Time in Bed</div>
          <div className="text-2xl font-bold font-display text-white">
            {Math.floor(analysis.timeInBedMinutes / 60)}h {analysis.timeInBedMinutes % 60}m
          </div>
          <p className="text-[10px] text-[#B0B8C1] mt-1">Total physical hours in bed</p>
        </div>

        <div className="bg-sleep-dark/50 border border-white/5 rounded-2xl p-6 text-center">
          <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Estimated Sleep</div>
          <div className="text-2xl font-bold font-display text-pink-400">
            {analysis.durationHours} hours
          </div>
          <p className="text-[10px] text-[#B0B8C1] mt-1">Adjusted for onset & micro-awakenings</p>
        </div>

        <div className="bg-sleep-dark/50 border border-white/5 rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Sleep Efficiency</div>
          <div className="text-2xl font-bold font-display text-emerald-400">
            {analysis.sleepEfficiency}%
          </div>
          <p className="text-[10px] text-[#B0B8C1] mt-1">Goal is &gt;85% efficiency</p>
        </div>
      </div>

      {/* Sleep Science Interpretation Panel */}
      <div className="bg-sleep-dark/30 rounded-2xl p-6 border border-white/5">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
          {hoursNum >= 7 && hoursNum <= 9 ? (
            <span className="flex items-center gap-2 text-emerald-400 text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" /> Healthy Target Achieved
            </span>
          ) : (
            <span className="flex items-center gap-2 text-yellow-500 text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" /> Sleep Duration Alert
            </span>
          )}
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          {analysis.feedback}
        </p>
        <div className="text-[11px] text-[#B0B8C1] leading-relaxed border-t border-white/5 pt-3">
          <strong>Why Sleep Efficiency Matters:</strong> Simply being in bed doesn't mean you are sleeping. Human sleep contains natural micro-arousals lasting 30-90 seconds (often completely unremembered), which are fully normal and add up to around 10-20 minutes total each night. This calculator subtracts your selected <strong>{sleepOnset} minutes</strong> sleep onset plus 15 minutes of expected micro-arousals to estimate your actual clinical sleep time.
        </div>
      </div>
    </div>
  );
}
