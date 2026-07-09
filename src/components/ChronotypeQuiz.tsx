/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Sun, ShieldCheck, Moon, RefreshCw, Zap, Briefcase, Eye } from "lucide-react";
import { CHRONOTYPE_QUIZ } from "../data";
import { Chronotype } from "../types";

export default function ChronotypeQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [result, setResult] = useState<Chronotype | null>(null);

  const handleSelectOption = (score: number) => {
    const nextScores = [...scores, score];
    setScores(nextScores);

    if (currentIdx + 1 < CHRONOTYPE_QUIZ.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate final score
      const totalScore = nextScores.reduce((sum, s) => sum + s, 0);
      let calculatedType: Chronotype;

      if (totalScore <= 7) {
        calculatedType = Chronotype.Morning;
      } else if (totalScore <= 12) {
        calculatedType = Chronotype.Intermediate;
      } else {
        calculatedType = Chronotype.Evening;
      }
      setResult(calculatedType);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setScores([]);
    setResult(null);
  };

  const renderCircadianSchedule = (type: Chronotype) => {
    switch (type) {
      case Chronotype.Morning:
        return {
          title: "The Morning Lark",
          tagline: "Naturally early riser with morning peak performance",
          bg: "from-amber-500/10 to-yellow-500/5 border-amber-500/30",
          color: "text-amber-400",
          icon: <Sun className="w-8 h-8 text-amber-400" />,
          peakFocus: "8:00 AM – 11:30 AM",
          bestWorkout: "7:00 AM (Early cardio is excellent)",
          sunlightGuide: "Seek direct outdoor sunlight within 30 minutes of waking to ground your clock.",
          caffeineCutoff: "12:00 PM",
          sleepWindow: "9:30 PM – 5:30 AM / 6:00 AM",
          habits: "Morning Larks are sensitive to evening light. Dim screens and switch to warm, low-intensity lighting by 8:00 PM to protect melatonin onset."
        };
      case Chronotype.Evening:
        return {
          title: "The Night Owl",
          tagline: "Late peak of cognitive energy, struggle with early starts",
          bg: "from-indigo-500/10 to-purple-500/5 border-indigo-500/30",
          color: "text-indigo-400",
          icon: <Moon className="w-8 h-8 text-indigo-400" />,
          peakFocus: "5:00 PM – 9:00 PM",
          bestWorkout: "4:00 PM – 6:00 PM (Strength training is optimal)",
          sunlightGuide: "Get daylight in the late morning and early afternoon to help keep your schedule stable.",
          caffeineCutoff: "3:00 PM",
          sleepWindow: "12:30 AM – 8:30 AM",
          habits: "Night Owls are prone to social jet lag due to typical 9-to-5 schedules. Try to avoid shifting sleep by more than 1.5 hours on weekends, and use blue-light blocking glasses after sunset."
        };
      case Chronotype.Intermediate:
      default:
        return {
          title: "The Bear",
          tagline: "Circadian rhythm aligned with the solar cycle",
          bg: "from-blue-500/10 to-emerald-500/5 border-blue-500/30",
          color: "text-blue-400",
          icon: <Sparkles className="w-8 h-8 text-blue-400" />,
          peakFocus: "10:00 AM – 2:00 PM",
          bestWorkout: "12:00 PM or 5:30 PM",
          sunlightGuide: "Seek bright daylight at mid-day to anchor your circadian rhythm.",
          caffeineCutoff: "1:30 PM",
          sleepWindow: "11:00 PM – 7:00 AM",
          habits: "Bears transition smoothly with daylight. Ensure a consistent wind-down routine starting around 10:00 PM to sustain high sleep efficiency."
        };
    }
  };

  const progressPercent = Math.round((currentIdx / CHRONOTYPE_QUIZ.length) * 100);

  return (
    <div id="chronotype-quiz-container" className="bg-sleep-navy-light rounded-3xl p-8 border border-white/5 shadow-xl">
      {!result ? (
        <div id="quiz-active-state">
          {/* Progress bar */}
          <div className="w-full bg-sleep-dark h-1.5 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-sleep-blue h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-[11px] bg-sleep-blue/20 text-sleep-lavender px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Circadian Chronotype Quiz
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Question {currentIdx + 1} of {CHRONOTYPE_QUIZ.length}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white font-display leading-snug mb-6">
            {CHRONOTYPE_QUIZ[currentIdx].question}
          </h3>

          <div className="space-y-3">
            {CHRONOTYPE_QUIZ[currentIdx].options.map((opt, oIdx) => (
              <button
                key={oIdx}
                id={`btn-quiz-opt-${currentIdx}-${oIdx}`}
                onClick={() => handleSelectOption(opt.score)}
                className="w-full text-left bg-sleep-dark/50 border border-white/5 hover:border-sleep-blue hover:bg-sleep-dark rounded-2xl p-4 transition-all duration-200 group flex justify-between items-center"
              >
                <div className="pr-4">
                  <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                    {opt.text}
                  </span>
                  {opt.description && (
                    <p className="text-[11px] text-gray-400 mt-1">{opt.description}</p>
                  )}
                </div>
                <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-sleep-blue group-hover:bg-sleep-blue/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-sleep-blue"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div id="quiz-result-state">
          {/* Result Card */}
          {(() => {
            const sched = renderCircadianSchedule(result);
            return (
              <div id="quiz-result-report" className={`border p-6 rounded-3xl bg-gradient-to-br ${sched.bg}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    {sched.icon}
                    <div>
                      <span className="text-xs font-semibold text-sleep-lavender uppercase tracking-widest">
                        Your Circadian Rhythm
                      </span>
                      <h3 className={`text-2xl font-extrabold font-display ${sched.color}`}>
                        {sched.title}
                      </h3>
                      <p className="text-xs text-gray-300 italic">{sched.tagline}</p>
                    </div>
                  </div>
                  <button
                    id="btn-quiz-retry"
                    onClick={handleReset}
                    className="flex items-center gap-1 px-4 py-2 bg-sleep-dark border border-white/10 hover:border-white/30 text-gray-300 hover:text-white rounded-xl text-xs font-medium transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retake Quiz
                  </button>
                </div>

                {/* Circadian Schedule Breakdown */}
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sleep-blue" />
                  Scientifically Paced Routine for {sched.title}s
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-sleep-dark/60 border border-white/5 rounded-2xl p-5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sleep-blue flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Peak Cognitive Focus
                    </span>
                    <div className="text-base font-bold text-white mt-1">{sched.peakFocus}</div>
                    <p className="text-[11px] text-[#B0B8C1] mt-1">
                      Schedule demanding analytical tasks, heavy reading, or creative work during this high-vigilance block.
                    </p>
                  </div>

                  <div className="bg-sleep-dark/60 border border-white/5 rounded-2xl p-5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> Optimal Physical Activity
                    </span>
                    <div className="text-base font-bold text-white mt-1">{sched.bestWorkout}</div>
                    <p className="text-[11px] text-[#B0B8C1] mt-1">
                      Core body temperature peaks now, making workouts more efficient and reducing injury risk.
                    </p>
                  </div>

                  <div className="bg-sleep-dark/60 border border-white/5 rounded-2xl p-5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Outdoor Sunlight Anchor
                    </span>
                    <div className="text-xs font-medium text-white mt-1 leading-relaxed">
                      {sched.sunlightGuide}
                    </div>
                  </div>

                  <div className="bg-sleep-dark/60 border border-white/5 rounded-2xl p-5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" /> Caffeine Cutoff Time
                    </span>
                    <div className="text-base font-bold text-white mt-1">{sched.caffeineCutoff}</div>
                    <p className="text-[11px] text-[#B0B8C1] mt-1">
                      Consuming caffeine after this time will disrupt slow-wave deep sleep quality.
                    </p>
                  </div>
                </div>

                {/* Nighttime wind down advice */}
                <div className="bg-sleep-dark/40 border border-white/5 rounded-2xl p-5">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Optimal Sleep/Wake Window
                  </h5>
                  <div className="text-sm font-bold text-sleep-lavender mb-2">{sched.sleepWindow}</div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {sched.habits}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
