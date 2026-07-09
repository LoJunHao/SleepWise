/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Calculator, Calendar, HelpCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { calculateSleepDebt } from "../sleepMath";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SleepDebtCalculator() {
  const [targetHours, setTargetHours] = useState(8);
  const [dailyHours, setDailyHours] = useState<number[]>([7, 6.5, 8, 5.5, 6, 7.5, 8]); // default values

  const handleHourChange = (index: number, val: number) => {
    const updated = [...dailyHours];
    updated[index] = Math.min(16, Math.max(0, val));
    setDailyHours(updated);
  };

  const debtAnalysis = calculateSleepDebt(dailyHours, targetHours);

  return (
    <div id="sleep-debt-calc-container" className="bg-sleep-navy-light rounded-3xl p-8 border border-white/5 shadow-xl">
      {/* Target Hours Config */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-white/5 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-white font-display">Target Sleep Duration</h3>
          <p className="text-xs text-[#B0B8C1]">Select your recommended target based on your age range (e.g., Adults 7–9h)</p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 7.5, 8, 8.5, 9].map((hrs) => (
            <button
              key={hrs}
              id={`btn-target-hrs-${hrs}`}
              onClick={() => setTargetHours(hrs)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                targetHours === hrs
                  ? "bg-[#2B7FFF] text-white border-[#2B7FFF]"
                  : "bg-sleep-dark border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {hrs}h
            </button>
          ))}
        </div>
      </div>

      {/* Week Log Grid */}
      <h4 className="text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-sleep-blue" />
        Log Hours Slept Per Day
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
        {DAYS_OF_WEEK.map((day, idx) => {
          const hours = dailyHours[idx];
          const hasDebt = hours < targetHours;
          return (
            <div
              key={day}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-between transition-all ${
                hasDebt
                  ? "bg-sleep-dark/50 border-yellow-500/20"
                  : "bg-sleep-dark/50 border-white/5"
              }`}
            >
              <span className="text-[11px] font-medium text-gray-400">{day.slice(0, 3)}</span>
              <div className="text-lg font-bold font-display text-white my-1.5">
                {hours}h
              </div>
              <input
                id={`slider-debt-${day}`}
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={hours}
                onChange={(e) => handleHourChange(idx, Number(e.target.value))}
                className="w-full accent-sleep-blue cursor-pointer h-1 bg-sleep-dark rounded-lg appearance-none"
              />
              <span className="text-[9px] mt-1 text-gray-500 font-mono">
                {hasDebt ? `-${(targetHours - hours).toFixed(1)}h` : "Optimal"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Debt Report Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-4 bg-sleep-dark/60 border border-white/5 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
          <Calculator className="w-8 h-8 text-sleep-blue mb-2" />
          <div className="text-xs text-[#B0B8C1] font-medium uppercase tracking-wider mb-1">Total Sleep Debt</div>
          <div className={`text-4xl font-extrabold font-display ${debtAnalysis.debt > 0 ? "text-yellow-400" : "text-emerald-400"}`}>
            {debtAnalysis.debt} hours
          </div>
          <div className="text-[11px] text-[#B0B8C1] mt-2 leading-relaxed">
            Average slept: <strong className="text-white">{debtAnalysis.averageSlept}h / night</strong>
          </div>
        </div>

        <div className="md:col-span-8 bg-sleep-dark/30 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
              {debtAnalysis.debt > 0 ? (
                <span className="flex items-center gap-1.5 text-yellow-500 text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" /> Recovery Guidelines
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-400 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Excellent Sleep Rhythm
                </span>
              )}
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {debtAnalysis.recommendation}
            </p>
          </div>

          <div className="text-[11px] text-[#B0B8C1] leading-relaxed border-t border-white/5 pt-3 mt-4 flex items-start gap-1.5">
            <HelpCircle className="w-4 h-4 text-sleep-blue shrink-0 mt-0.5" />
            <span>
              <strong>Circadian Caution:</strong> Trying to make up sleep debt in a single long sleep-in on weekends creates <em>"social jet lag"</em>, confusing your internal clock. The best scientific approach to debt clearance is to slowly add 30–60 minutes of sleep over consecutive regular nights.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
