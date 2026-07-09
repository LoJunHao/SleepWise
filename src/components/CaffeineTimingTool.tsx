/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Coffee, ShieldAlert, Sparkles, HelpCircle, Flame, Clock } from "lucide-react";
import { CAFFEINE_ITEMS } from "../data";
import { simulateCaffeineClearance, timeStringToMinutes } from "../sleepMath";

export default function CaffeineTimingTool() {
  const [selectedBev, setSelectedBev] = useState("coffee");
  const [customCaffeine, setCustomCaffeine] = useState(100);
  const [isCustom, setIsCustom] = useState(false);
  
  const [caffeineTime, setCaffeineTime] = useState("15:00");
  const [bedtime, setBedtime] = useState("23:00");
  const [halfLife, setHalfLife] = useState(5); // average is 5 hours, range 3 to 7

  const activeBeverage = CAFFEINE_ITEMS.find((b) => b.id === selectedBev) || CAFFEINE_ITEMS[0];
  const initialMg = isCustom ? customCaffeine : activeBeverage.caffeineMg;

  // Calculate hours elapsed
  const drinkMin = timeStringToMinutes(caffeineTime);
  let bedMin = timeStringToMinutes(bedtime);
  if (bedMin < drinkMin) {
    bedMin += 1440; // crosses midnight
  }
  const hoursElapsed = (bedMin - drinkMin) / 60;

  const clearance = simulateCaffeineClearance(initialMg, hoursElapsed, halfLife);

  // Generate line points for decay graph
  const graphHours = Array.from({ length: 16 }, (_, i) => i); // 0 to 15 hours
  const graphData = graphHours.map((h) => {
    const sim = simulateCaffeineClearance(initialMg, h, halfLife);
    return { hour: h, mg: sim.remainingMg };
  });

  // Calculate SVG dimensions
  const svgWidth = 400;
  const svgHeight = 150;
  const paddingX = 40;
  const paddingY = 20;

  const maxVal = Math.max(120, initialMg);
  
  // Convert graph points to SVG coordinates
  const points = graphData
    .map((d) => {
      const x = paddingX + (d.hour / 15) * (svgWidth - 2 * paddingX);
      const y = svgHeight - paddingY - (d.mg / maxVal) * (svgHeight - 2 * paddingY);
      return `${x},${y}`;
    })
    .join(" ");

  // Coordinates of Bedtime point
  const bedX = paddingX + (Math.min(15, hoursElapsed) / 15) * (svgWidth - 2 * paddingX);
  const bedY = svgHeight - paddingY - (clearance.remainingMg / maxVal) * (svgHeight - 2 * paddingY);

  return (
    <div id="caffeine-timing-tool-container" className="bg-sleep-navy-light rounded-3xl p-8 border border-white/5 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Your Caffeine Source
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CAFFEINE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  id={`btn-caffeine-bev-${item.id}`}
                  onClick={() => {
                    setSelectedBev(item.id);
                    setIsCustom(false);
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    !isCustom && selectedBev === item.id
                      ? "bg-sleep-blue/20 border-[#2B7FFF] text-white"
                      : "bg-sleep-dark/50 border border-white/5 text-gray-400 hover:text-white hover:border-white/25"
                  }`}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-[10px] font-bold leading-tight truncate">{item.name.split(" (")[0]}</div>
                  <div className="text-[9px] text-sleep-lavender font-semibold font-mono mt-0.5">{item.caffeineMg} mg</div>
                </button>
              ))}
              <button
                id="btn-caffeine-bev-custom"
                onClick={() => setIsCustom(true)}
                className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col justify-center items-center ${
                  isCustom
                    ? "bg-sleep-blue/20 border-[#2B7FFF] text-white"
                    : "bg-sleep-dark/50 border border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <div className="text-lg mb-1">🧪</div>
                <div className="text-[10px] font-bold leading-tight">Custom dose</div>
                <div className="text-[9px] text-sleep-lavender font-semibold font-mono mt-0.5">Adjustable</div>
              </button>
            </div>
          </div>

          {isCustom && (
            <div>
              <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-1">
                Custom Caffeine (mg)
              </label>
              <input
                id="input-custom-caffeine"
                type="number"
                min="10"
                max="500"
                value={customCaffeine}
                onChange={(e) => setCustomCaffeine(Number(e.target.value))}
                className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-3 py-2 text-sm focus:ring-1 focus:ring-sleep-blue"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2">
                Last Drink Time
              </label>
              <input
                id="input-caffeine-time"
                type="time"
                value={caffeineTime}
                onChange={(e) => setCaffeineTime(e.target.value)}
                className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-3.5 py-2.5 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2">
                Target Bedtime
              </label>
              <input
                id="input-caffeine-bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full bg-sleep-dark text-white border border-white/10 rounded-2xl px-3.5 py-2.5 text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sleep-lavender uppercase tracking-wider mb-2 flex justify-between">
              <span>Metabolism Speed (Half-life: {halfLife}h)</span>
              <span className="text-[10px] text-gray-400">Genetic variance</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 7].map((h) => (
                <button
                  key={h}
                  id={`btn-halflife-${h}`}
                  onClick={() => setHalfLife(h)}
                  className={`py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    halfLife === h
                      ? "bg-sleep-blue/20 border-[#2B7FFF] text-white"
                      : "bg-sleep-dark border border-white/10 text-gray-400"
                  }`}
                >
                  {h === 3 ? "Fast (3h)" : h === 5 ? "Average (5h)" : "Slow (7h)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Decay Chart Section */}
        <div className="bg-sleep-dark/50 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sleep-blue" />
              Expected Bedtime Remaining Caffeine
            </h4>
            
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-3xl font-extrabold font-display text-white">
                  {clearance.remainingMg} <span className="text-xs text-gray-400 font-sans">mg</span>
                </div>
                <div className="text-[11px] text-[#B0B8C1] mt-0.5">
                  Elapsed: <strong className="text-white">{hoursElapsed.toFixed(1)} hours</strong> since drinking
                </div>
              </div>
              
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  clearance.effectLevel === "Strong"
                    ? "bg-red-500/20 text-red-400"
                    : clearance.effectLevel === "Moderate"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {clearance.effectLevel} Interference
                </span>
                <div className="text-[10px] text-gray-500 mt-1 font-mono">{clearance.clearancePercent}% metabolized</div>
              </div>
            </div>
          </div>

          {/* SVG Decay Curve */}
          <div className="relative bg-sleep-dark p-2 rounded-2xl border border-white/5">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible"
            >
              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={svgHeight - paddingY}
                x2={svgWidth - paddingX}
                y2={svgHeight - paddingY}
                className="stroke-gray-700 stroke-1"
              />
              <line
                x1={paddingX}
                y1={paddingY}
                x2={paddingX}
                y2={svgHeight - paddingY}
                className="stroke-gray-700 stroke-1"
              />

              {/* Threshold indicator line for sleep disruption (approx 50mg) */}
              {maxVal > 50 && (
                <g>
                  <line
                    x1={paddingX}
                    y1={svgHeight - paddingY - (50 / maxVal) * (svgHeight - 2 * paddingY)}
                    x2={svgWidth - paddingX}
                    y2={svgHeight - paddingY - (50 / maxVal) * (svgHeight - 2 * paddingY)}
                    className="stroke-red-500/40 stroke-1 stroke-dasharray"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={svgWidth - paddingX - 4}
                    y={svgHeight - paddingY - (50 / maxVal) * (svgHeight - 2 * paddingY) - 4}
                    className="fill-red-400 text-[8px] text-right font-semibold font-sans"
                    textAnchor="end"
                  >
                    Disruption zone (&gt;50mg)
                  </text>
                </g>
              )}

              {/* Clearance Decay Path */}
              <polyline
                fill="none"
                stroke="#2B7FFF"
                strokeWidth="2.5"
                points={points}
                strokeLinecap="round"
              />

              {/* Highlight Point at Bedtime */}
              {hoursElapsed <= 15 && (
                <g>
                  <circle
                    cx={bedX}
                    cy={bedY}
                    r="6"
                    className="fill-sleep-lavender stroke-white stroke-2 animate-pulse"
                  />
                  <text
                    x={bedX}
                    y={bedY - 12}
                    className="fill-white text-[9px] font-bold font-sans"
                    textAnchor="middle"
                  >
                    Bedtime ({clearance.remainingMg}mg)
                  </text>
                </g>
              )}

              {/* Chart labels */}
              <text x={paddingX} y={svgHeight - 4} className="fill-gray-500 text-[8px] font-mono" textAnchor="middle">
                0h
              </text>
              <text x={paddingX + (5 / 15) * (svgWidth - 2 * paddingX)} y={svgHeight - 4} className="fill-gray-500 text-[8px] font-mono" textAnchor="middle">
                5h
              </text>
              <text x={paddingX + (10 / 15) * (svgWidth - 2 * paddingX)} y={svgHeight - 4} className="fill-gray-500 text-[8px] font-mono" textAnchor="middle">
                10h
              </text>
              <text x={svgWidth - paddingX} y={svgHeight - 4} className="fill-gray-500 text-[8px] font-sans" textAnchor="middle">
                15h (hours post-consumption)
              </text>

              <text x={paddingX - 6} y={paddingY + 4} className="fill-gray-500 text-[8px] font-mono" textAnchor="end">
                {Math.round(maxVal)}mg
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Sleep Interferences Details */}
      {clearance.effectLevel !== "Negligible" ? (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300 leading-relaxed">
            <strong>Caffeine Warning:</strong> You have an active level of <strong>{clearance.remainingMg}mg</strong> remaining at bedtime. Even if you can fall asleep easily (subjective sleep latency), chemical caffeine remaining blocks adenosine receptors, severely fragmenting slow-wave (deep) and REM sleep. Try consuming caffeine earlier in the morning or opting for tea in the afternoon.
          </p>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-300 leading-relaxed">
            <strong>Caffeine Clear!</strong> Your consumption timing is well-suited. With less than 15mg of active caffeine in your bloodstream at bedtime, your slow-wave deep sleep cycles should proceed completely uninterrupted. Great job planning ahead!
          </p>
        </div>
      )}
    </div>
  );
}
