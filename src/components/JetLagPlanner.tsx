/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plane, Compass, HelpCircle, Sun, Moon, Info, ShieldAlert } from "lucide-react";
import { generateJetLagPlan } from "../sleepMath";

export default function JetLagPlanner() {
  const [originZone, setOriginZone] = useState("New York (EST)");
  const [destZone, setDestZone] = useState("London (GMT)");
  const [direction, setDirection] = useState<"east" | "west">("east");
  const [hoursDiff, setHoursDiff] = useState(5);
  const [daysToTrip, setDaysToTrip] = useState(3);

  const plan = generateJetLagPlan(direction, hoursDiff, daysToTrip);

  return (
    <div id="jet-lag-planner-container" className="bg-sleep-navy-light rounded-3xl p-8 border border-white/5 shadow-xl">
      {/* Route Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2">
            Origin Location / Timezone
          </label>
          <input
            id="input-jetlag-origin"
            type="text"
            value={originZone}
            onChange={(e) => setOriginZone(e.target.value)}
            className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-sleep-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2">
            Destination Location / Timezone
          </label>
          <input
            id="input-jetlag-dest"
            type="text"
            value={destZone}
            onChange={(e) => setDestZone(e.target.value)}
            className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-sleep-blue"
          />
        </div>
      </div>

      {/* Settings Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-sleep-dark/30 rounded-2xl border border-white/5">
        <div>
          <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Travel Direction
          </label>
          <div className="flex bg-sleep-dark rounded-xl p-1 border border-white/5">
            <button
              id="btn-direction-east"
              onClick={() => setDirection("east")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                direction === "east"
                  ? "bg-[#2B7FFF] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Eastbound (+ hrs)
            </button>
            <button
              id="btn-direction-west"
              onClick={() => setDirection("west")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                direction === "west"
                  ? "bg-[#2B7FFF] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Westbound (- hrs)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2">
            Timezones Crossed ({hoursDiff} Hours)
          </label>
          <input
            id="input-jetlag-hours"
            type="range"
            min="1"
            max="12"
            step="1"
            value={hoursDiff}
            onChange={(e) => setHoursDiff(Number(e.target.value))}
            className="w-full accent-sleep-blue cursor-pointer h-1.5 bg-sleep-dark rounded-lg appearance-none mt-2"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>1 Hour</span>
            <span>6 Hours</span>
            <span>12 Hours</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2">
            Days To Pre-Shift Schedule
          </label>
          <div className="flex gap-2">
            {[1, 2, 3].map((days) => (
              <button
                key={days}
                id={`btn-preshift-${days}`}
                onClick={() => setDaysToTrip(days)}
                className={`flex-1 py-2 text-xs font-semibold border rounded-xl transition-all ${
                  daysToTrip === days
                    ? "bg-sleep-blue/20 border-[#2B7FFF] text-white"
                    : "bg-sleep-dark border border-white/10 text-gray-400"
                }`}
              >
                {days} {days === 1 ? "Day" : "Days"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation Output Display */}
      <div id="jetlag-plan-output" className="bg-sleep-dark/50 border border-white/5 rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <Plane className="w-6 h-6 text-sleep-blue" />
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Circadian Phase Adjustment Strategy
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">{plan.shiftDirection}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-sleep-dark/80 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-1.5 mb-2">
                <Sun className="w-4 h-4" /> Seek Bright Light
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {plan.lightExposureTip}
              </p>
            </div>
            <div className="text-[10px] text-gray-500 mt-3 border-t border-white/5 pt-2">
              Light suppresses melatonin and anchors cortisol cycles.
            </div>
          </div>

          <div className="bg-sleep-dark/80 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5 mb-2">
                <Moon className="w-4 h-4" /> Avoid Bright Light
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {plan.avoidLightTip}
              </p>
            </div>
            <div className="text-[10px] text-gray-500 mt-3 border-t border-white/5 pt-2">
              Darkness encourages endogenous melatonin secretion.
            </div>
          </div>

          <div className="bg-sleep-dark/80 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5 mb-2">
                <Info className="w-4 h-4" /> Melatonin Guidance
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {plan.melatoninTip}
              </p>
            </div>
            <div className="text-[10px] text-gray-500 mt-3 border-t border-white/5 pt-2">
              Assists with temporary clock shifting.
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Medical Disclaimer callout */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-0.5">
            Medical Disclaimer (AASM & FDA Ethical Policy)
          </h5>
          <p className="text-xs text-yellow-200/80 leading-relaxed">
            {plan.medicalDisclaimer} SleepWise recommendations are entirely educational, calculated using high-probability circadian research. They do not constitute diagnostic medical advice. Consult a licensed clinical sleep specialist or practitioner before initiating melatonin supplementation or if suffering from persistent insomnia.
          </p>
        </div>
      </div>
    </div>
  );
}
