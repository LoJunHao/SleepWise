/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Coffee, ShieldCheck, Activity, Award, Flame, Brain, Clock } from "lucide-react";
import { NAP_TYPES } from "../data";

export default function NapCalculator() {
  const [selectedNap, setSelectedNap] = useState("energy");

  const nap = NAP_TYPES.find((n) => n.id === selectedNap) || NAP_TYPES[0];

  const getIcon = (id: string) => {
    switch (id) {
      case "learning":
        return <Brain className="w-5 h-5 text-purple-400" />;
      case "recovery":
        return <Award className="w-5 h-5 text-pink-400" />;
      case "energy":
      default:
        return <Flame className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div id="nap-calculator-container" className="bg-sleep-navy-light rounded-3xl p-8 border border-white/5 shadow-xl">
      <h3 className="text-sm font-semibold text-sleep-lavender uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-sleep-blue" />
        Select Your Nap Objective
      </h3>

      {/* Selector Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {NAP_TYPES.map((n) => (
          <button
            key={n.id}
            id={`btn-nap-type-${n.id}`}
            onClick={() => setSelectedNap(n.id)}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              selectedNap === n.id
                ? "bg-sleep-blue/20 border-[#2B7FFF] shadow-lg"
                : "bg-sleep-dark/50 border border-white/5 hover:border-white/20"
            }`}
          >
            <div className={`p-2 rounded-lg bg-sleep-dark ${selectedNap === n.id ? "text-sleep-blue" : "text-gray-400"}`}>
              {getIcon(n.id)}
            </div>
            <div>
              <div className="text-xs font-semibold text-white tracking-wide">{n.title.split(" (")[0]}</div>
              <div className="text-[10px] text-sleep-lavender font-semibold font-mono">{n.duration} Mins</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main recommendation Display card */}
      <div className="bg-sleep-dark/50 border border-white/5 rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          {getIcon(nap.id)}
          <h4 className="text-lg font-bold font-display text-white">{nap.title}</h4>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-sleep-blue">Benefits & Physiology</span>
            <p className="text-sm text-gray-300 leading-relaxed mt-1">
              {nap.benefits}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-sleep-dark/80 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Best Time Frame
              </span>
              <p className="text-xs text-[#B0B8C1] mt-1">
                {nap.bestTime}
              </p>
            </div>

            <div className="bg-sleep-dark/80 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Sleep Inertia Danger
              </span>
              <p className="text-xs text-[#B0B8C1] mt-1">
                {nap.warning}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Tip: Coffee Nap combo */}
      <div className="bg-sleep-dark/30 border border-white/5 p-4 rounded-xl flex items-start gap-3">
        <Coffee className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-0.5">
            The Science of the "Coffee Nap" (Caffeine Co-administration)
          </h5>
          <p className="text-xs text-[#B0B8C1] leading-relaxed">
            Consuming an espresso or cup of coffee <em>immediately</em> before a 20-minute power nap is a research-supported technique. Because caffeine takes roughly 20-30 minutes to travel through the gastrointestinal tract and bind to adenosine receptors in the brain, it kicks in exactly as you wake up, compounding the alertness benefits of the nap.
          </p>
        </div>
      </div>
    </div>
  );
}
