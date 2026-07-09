/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Check, Info, ShieldAlert, Sparkles, Star } from "lucide-react";
import { SLEEP_HYGIENE_ITEMS } from "../data";

export default function SleepHygieneScore() {
  const [checkedIds, setCheckedIds] = useState<string[]>([
    "dark_room",
    "cool_room",
    "daily_exercise"
  ]); // pre-check some for nice initial visual score

  const handleToggle = (id: string) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((item) => item !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  // Calculate score based on weights of checked items
  const score = checkedIds.reduce((acc, id) => {
    const item = SLEEP_HYGIENE_ITEMS.find((h) => h.id === id);
    return acc + (item ? item.impact : 0);
  }, 0);

  // Get recommendations for unchecked items
  const recommendations = SLEEP_HYGIENE_ITEMS.filter(
    (item) => !checkedIds.includes(item.id)
  );

  const getScoreDescription = (s: number) => {
    if (s >= 85) return { text: "Elite Sleep Environment", color: "text-emerald-400", desc: "Your room and bedtime routines are optimized beautifully to support high deep sleep quality." };
    if (s >= 50) return { text: "Average Sleep Hygiene", color: "text-yellow-400", desc: "You have a solid foundation, but environmental or timing factors are likely reducing sleep depth." };
    return { text: "Disrupted Sleep Habits", color: "text-red-400", desc: "Your bedtime routine features major stimulators that inhibit melatonin and delay circadian rhythms." };
  };

  const status = getScoreDescription(score);

  return (
    <div id="sleep-hygiene-score-container" className="bg-sleep-navy-light rounded-3xl p-8 border border-white/5 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-6">
        {/* Left Side: Score display meter */}
        <div className="md:col-span-5 bg-sleep-dark/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-sleep-dark/80 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-sleep-blue fill-none transition-all duration-500 ease-out"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 * (1 - score / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="z-10">
              <div className="text-4xl font-extrabold font-display text-white">{score}</div>
              <div className="text-[10px] text-sleep-lavender font-semibold tracking-widest uppercase">Score</div>
            </div>
          </div>

          <h3 className={`text-base font-bold font-display mt-4 ${status.color}`}>
            {status.text}
          </h3>
          <p className="text-xs text-[#B0B8C1] mt-1 leading-relaxed">
            {status.desc}
          </p>
        </div>

        {/* Right Side: Checklist */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-sleep-blue" />
              Scientific Sleep Hygiene Audit
            </h4>
            <div className="space-y-2.5">
              {SLEEP_HYGIENE_ITEMS.map((item) => {
                const isChecked = checkedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    id={`btn-hygiene-toggle-${item.id}`}
                    onClick={() => handleToggle(item.id)}
                    className={`w-full text-left p-3 rounded-2xl border flex items-start gap-3 transition-all duration-200 ${
                      isChecked
                        ? "bg-sleep-blue/10 border-sleep-blue/30"
                        : "bg-sleep-dark/40 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isChecked
                          ? "bg-sleep-blue border-sleep-blue text-white"
                          : "border-white/20"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {item.label}
                        </span>
                        <span className="text-[9px] bg-sleep-dark px-1.5 py-0.5 rounded font-mono text-sleep-lavender">
                          +{item.impact} pts
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        {item.tip}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations based on unchecked items */}
      {recommendations.length > 0 ? (
        <div className="bg-sleep-dark/30 border border-white/5 p-6 rounded-2xl">
          <h4 className="text-xs font-semibold text-yellow-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Recommended Action Steps
          </h4>
          <ul className="space-y-2.5">
            {recommendations.map((rec) => (
              <li key={rec.id} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-sleep-blue shrink-0 mt-1.5"></span>
                <span>
                  <strong className="text-white">{rec.label.split(" (")[0]}:</strong>{" "}
                  {rec.tip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <p className="text-xs text-emerald-300">
            <strong>Perfect Score!</strong> Your sleep environment and sleep hygiene routine are outstandingly configured. Keep this up for elite physical recovery!
          </p>
        </div>
      )}
    </div>
  );
}
