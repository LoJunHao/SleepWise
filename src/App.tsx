/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  Moon, 
  Sunrise, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  Award, 
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Calendar,
  Activity,
  Coffee,
  Plane,
  Heart,
  Star
} from "lucide-react";

// Import modular sub-components
import BedtimeWakeupCalculator from "./components/BedtimeWakeupCalculator";
import SleepDurationCalculator from "./components/SleepDurationCalculator";
import SleepDebtCalculator from "./components/SleepDebtCalculator";
import ChronotypeQuiz from "./components/ChronotypeQuiz";
import SleepHygieneScore from "./components/SleepHygieneScore";
import SleepConsistencyTracker from "./components/SleepConsistencyTracker";
import NapCalculator from "./components/NapCalculator";
import CaffeineTimingTool from "./components/CaffeineTimingTool";
import JetLagPlanner from "./components/JetLagPlanner";

type ActiveTab = 
  | "bedtime-wake"
  | "duration"
  | "debt"
  | "chronotype"
  | "hygiene"
  | "consistency"
  | "nap"
  | "caffeine"
  | "jetlag";

interface TabItem {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("bedtime-wake");
  const calculatorsRef = useRef<HTMLDivElement>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const TABS: TabItem[] = [
    {
      id: "bedtime-wake",
      label: "🌙 Bedtime & Wake-Up",
      shortLabel: "Bedtime",
      icon: <Moon className="w-4 h-4" />,
      description: "Find optimal sleep and wake boundaries based on cycle counts."
    },
    {
      id: "duration",
      label: "📊 Sleep Duration & Efficiency",
      shortLabel: "Duration",
      icon: <Heart className="w-4 h-4" />,
      description: "Estimate actual sleep duration and efficiency ratios."
    },
    {
      id: "debt",
      label: "📅 Weekly Sleep Debt",
      shortLabel: "Debt",
      icon: <Calendar className="w-4 h-4" />,
      description: "Calculate cumulative weekly deficit and plan recovery."
    },
    {
      id: "chronotype",
      label: "🧬 Chronotype Quiz",
      shortLabel: "Chronotype",
      icon: <Sparkles className="w-4 h-4" />,
      description: "Discover your circadian archetype (Lark, Bear, Owl)."
    },
    {
      id: "hygiene",
      label: "⭐ Sleep Hygiene Score",
      shortLabel: "Hygiene",
      icon: <Star className="w-4 h-4" />,
      description: "Evaluate your environment and bedtime behaviors."
    },
    {
      id: "consistency",
      label: "📈 Consistency Tracker",
      shortLabel: "Consistency",
      icon: <Activity className="w-4 h-4" />,
      description: "Measure sleep regularity and social jet lag."
    },
    {
      id: "nap",
      label: "🛌 Restorative Nap Planner",
      shortLabel: "Naps",
      icon: <Clock className="w-4 h-4" />,
      description: "Choose brief sleeps suited to physical and learning goals."
    },
    {
      id: "caffeine",
      label: "☕ Caffeine Clearance Curve",
      shortLabel: "Caffeine",
      icon: <Coffee className="w-4 h-4" />,
      description: "Simulate active bedtime stimulants using half-lives."
    },
    {
      id: "jetlag",
      label: "✈️ Jet Lag Phase Shifter",
      shortLabel: "Jet Lag",
      icon: <Plane className="w-4 h-4" />,
      description: "Pre-shift schedules to adapt quickly to new timezones."
    }
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    scrollToCalculators();
  };

  const scrollToCalculators = () => {
    calculatorsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "Does everyone sleep in exactly 90-minute increments?",
      a: "No. This is an extremely common sleep myth. While the average sleep cycle length for adults is approximately 90 minutes, individual cycles can fluctuate anywhere between 70 and 120 minutes depending on age, genetics, and current sleep debt. In addition, deep sleep dominates earlier cycles, while REM sleep is more prominent towards morning."
    },
    {
      q: "Can I catch up on a week's worth of sleep debt on weekends?",
      a: "Only partially. While extra sleep on weekends helps mitigate extreme acute sleep deprivation, sleeping in late on Saturdays and Sundays creates 'social jet lag' (a circadian mismatch). This shifts your internal master clock later, making it difficult to fall asleep Sunday night and leading to groggy Mondays. It's safer to spread recovery by adding 30-45 minutes of sleep across consecutive weeknights."
    },
    {
      q: "How does caffeine affect sleep even if I fall asleep quickly?",
      a: "Caffeine is an adenosine receptor antagonist; it blocks the natural chemical signal for 'sleep pressure' from building up. Because it has an average half-life of 5 hours (often up to 7 hours for some individuals), caffeine remains in your bloodstream long after drinking it. Even if you fall asleep easily, active caffeine fragments deep slow-wave sleep and REM sleep, reducing overall sleep quality."
    },
    {
      q: "What is the Sleep Regularity Index (SRI)?",
      a: "The SRI measures the likelihood that a person is in the same sleep-wake state (asleep vs awake) at any two timepoints exactly 24 hours apart. Emerging sleep research indicates that high sleep regularity (a stable schedule) is just as critical for metabolic health, mood, and cognitive longevity as overall sleep duration."
    }
  ];

  return (
    <div id="sleepwise-app-root" className="min-h-screen bg-sleep-dark text-gray-100 font-sans antialiased relative overflow-x-hidden selection:bg-sleep-blue selection:text-white">
      {/* Background ambient decorative glowing light effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sleep-blue/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sleep-lavender/10 blur-[120px] pointer-events-none"></div>
      
      {/* Upper Site Header */}
      <header className="border-b border-white/5 bg-sleep-dark sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-8 h-8 rounded-full bg-[#2B7FFF] flex items-center justify-center shadow-md shadow-sleep-blue/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M21 12.75A9 9 0 1111.25 3 7.5 7.5 0 0021 12.75z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">SleepWise</h1>
            <span className="ml-4 px-2 py-0.5 rounded border border-white/20 text-[10px] uppercase tracking-wider text-[#B7B5FF]">Science-First Analysis</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button onClick={scrollToCalculators} className="text-white border-b-2 border-sleep-blue pb-1 font-medium hover:text-white transition-all">
              Calculators
            </button>
            <a href="#research" className="text-white/60 hover:text-white transition-colors font-medium">
              Research Library
            </a>
            <a href="#faq" className="text-white/60 hover:text-white transition-colors font-medium">
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sleep-blue/10 border border-sleep-blue/20 text-xs font-bold text-sleep-lavender mb-6">
          <Sparkles className="w-3.5 h-3.5 text-sleep-blue" />
          Evidence-Based Circadian Insights
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-tight mb-6">
          Sleep Better with <span className="bg-clip-text text-transparent bg-gradient-to-r from-sleep-blue to-sleep-lavender">Science</span>
        </h1>
        <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
          Calculate your ideal bedtime, wake-up time, and improve sleep quality using evidence-based recommendations rather than rigid 90-minute myths.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            id="hero-btn-calculate"
            onClick={scrollToCalculators}
            className="px-8 py-4 rounded-xl bg-sleep-blue hover:bg-sleep-blue/90 font-bold text-white shadow-lg shadow-sleep-blue/20 hover:shadow-sleep-blue/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Calculate Now
            <Clock className="w-5 h-5" />
          </button>
          <a
            href="#faq"
            className="px-8 py-4 rounded-xl bg-sleep-navy-light/40 hover:bg-sleep-navy-light/60 border border-sleep-lavender/10 font-bold text-gray-200 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Read FAQs
            <HelpCircle className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          id="feature-card-bedtime"
          onClick={() => handleTabClick("bedtime-wake")}
          className="bg-sleep-navy-light border border-white/5 hover:border-sleep-blue/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-sleep-blue/5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-sleep-blue/10 flex items-center justify-center text-sleep-blue mb-4 group-hover:bg-sleep-blue group-hover:text-white transition-all">
            <Moon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-display text-white mb-2">🌙 Bedtime Calculator</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Discover the healthiest bedtime boundaries aligned with your required morning alarm, customized to your typical onset latency.
          </p>
          <span className="text-xs font-semibold text-sleep-blue group-hover:underline flex items-center gap-1">
            Access Calculator &rarr;
          </span>
        </div>

        <div
          id="feature-card-waketime"
          onClick={() => handleTabClick("bedtime-wake")}
          className="bg-sleep-navy-light border border-white/5 hover:border-sleep-blue/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-sleep-blue/5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-sleep-blue/10 flex items-center justify-center text-sleep-blue mb-4 group-hover:bg-sleep-blue group-hover:text-white transition-all">
            <Sunrise className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-display text-white mb-2">⏰ Wake Time Calculator</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Calculate your morning alarm times from a target bedtime, minimizing groggy states by awakening after full, healthy sleep cycles.
          </p>
          <span className="text-xs font-semibold text-sleep-blue group-hover:underline flex items-center gap-1">
            Access Calculator &rarr;
          </span>
        </div>

        <div
          id="feature-card-sleepanalysis"
          onClick={() => handleTabClick("duration")}
          className="bg-sleep-navy-light border border-white/5 hover:border-sleep-blue/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-sleep-blue/5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-sleep-blue/10 flex items-center justify-center text-sleep-blue mb-4 group-hover:bg-sleep-blue group-hover:text-white transition-all">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-display text-white mb-2">📊 Sleep Analysis</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Measure actual estimated time asleep, sleep efficiency percentages, weekly accumulated sleep debt, and schedule regularity.
          </p>
          <span className="text-xs font-semibold text-sleep-blue group-hover:underline flex items-center gap-1">
            Analyze Now &rarr;
          </span>
        </div>
      </section>

      {/* Main Core Dashboard Section */}
      <section ref={calculatorsRef} id="calculators-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="border-b border-white/5 pb-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">Scientific Workspace Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">Select from the 10 evidence-based calculators and clinical-sleep estimators below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`btn-sidebar-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 group relative overflow-hidden ${
                    isSelected
                      ? "bg-[#2B7FFF] text-white border-[#2B7FFF] shadow-lg shadow-sleep-blue/5"
                      : "bg-sleep-navy-light/40 border-white/5 text-gray-300 hover:bg-sleep-navy-light/80 hover:border-white/10"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-sleep-dark text-white" : "bg-sleep-dark/40 text-sleep-blue group-hover:text-white"} transition-colors shrink-0`}>
                    {tab.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold tracking-wide block">{tab.label}</span>
                    <span className={`text-[10.5px] block mt-0.5 line-clamp-1 ${isSelected ? "text-gray-100" : "text-gray-400"}`}>
                      {tab.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Active Calculator Panel Workspace */}
          <div className="lg:col-span-8">
            <div id="calculator-panel-viewport" className="transition-all duration-300">
              {activeTab === "bedtime-wake" && <BedtimeWakeupCalculator />}
              {activeTab === "duration" && <SleepDurationCalculator />}
              {activeTab === "debt" && <SleepDebtCalculator />}
              {activeTab === "chronotype" && <ChronotypeQuiz />}
              {activeTab === "hygiene" && <SleepHygieneScore />}
              {activeTab === "consistency" && <SleepConsistencyTracker />}
              {activeTab === "nap" && <NapCalculator />}
              {activeTab === "caffeine" && <CaffeineTimingTool />}
              {activeTab === "jetlag" && <JetLagPlanner />}
            </div>
          </div>
        </div>
      </section>

      {/* Research Highlights section */}
      <section id="research" className="bg-sleep-navy-light/30 border-y border-white/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sleep-blue">Empirical Foundations</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white mt-1">Research Highlights</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-2xl mx-auto">
              Our calculations and methodologies are grounded directly in reports published by leading medical sleep organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-sleep-dark/50 border border-white/5 rounded-3xl p-6">
              <span className="text-[10px] bg-sleep-blue/20 text-sleep-lavender px-2 py-1 rounded font-bold font-mono">
                AASM GUIDELINES
              </span>
              <h4 className="text-base font-bold text-white mt-3 mb-2">Duration Requirements</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                The American Academy of Sleep Medicine (AASM) and Sleep Research Society declare that adults need <strong>7 to 9 hours</strong> of sleep regularly to maintain biological vitality, support immunity, and prevent chronic metabolic syndrome. Teenagers require 8–10 hours.
              </p>
            </div>

            <div className="bg-sleep-dark/50 border border-white/5 rounded-3xl p-6">
              <span className="text-[10px] bg-sleep-blue/20 text-sleep-lavender px-2 py-1 rounded font-bold font-mono">
                CIRCADIAN BIOLOGY
              </span>
              <h4 className="text-base font-bold text-white mt-3 mb-2"> Rhythmic Consistency</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Circadian rhythm consistency (having stable bedtime and wake boundaries ±30 mins) is associated with higher mental acuity, stable metabolic rates, and lower cortisol profiles. A highly fluctuating sleep schedule impairs cognitive resilience, regardless of total duration.
              </p>
            </div>

            <div className="bg-sleep-dark/50 border border-white/5 rounded-3xl p-6">
              <span className="text-[10px] bg-sleep-blue/20 text-sleep-lavender px-2 py-1 rounded font-bold font-mono">
                SLEEP PHYSIOLOGY
              </span>
              <h4 className="text-base font-bold text-white mt-3 mb-2">Duration vs Quality</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Healthy sleep is multi-dimensional. Optimal sleep is characterized by passing sequentially through light, deep slow-wave, and REM phases. Unchecked environmental noises, late-night high lux screens, and active chemical caffeine disrupt this fragile architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-center text-white mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-sleep-navy-light/30 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  id={`btn-faq-toggle-${idx}`}
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 flex justify-between items-center text-white hover:bg-sleep-navy-light/50 font-semibold text-sm transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-sleep-blue transition-transform duration-300 ${isExpanded ? "transform rotate-180" : ""}`} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-60 p-4 border-t border-white/5" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p className="text-xs text-gray-400 leading-relaxed">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials - strictly educational and clinical-safe, no medical diagnoses or guarantees */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-sleep-blue">User Experiences</span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Actionable Lifestyle Success Stories</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-sleep-navy-light/40 p-6 rounded-3xl border border-white/5">
            <p className="text-xs text-gray-300 italic leading-relaxed">
              "Mapping out my weekday vs weekend sleep log in the consistency tracker opened my eyes. I realized my 'weekend recharge' was giving me nearly 3 hours of social jet lag, which explains my Sunday night insomnia. Shifting to a more stable wake target has done wonders for my focus."
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sleep-blue/20 text-xs font-bold text-sleep-blue flex items-center justify-center">
                M
              </div>
              <div>
                <div className="text-xs font-bold text-white">Sarah M.</div>
                <div className="text-[10px] text-gray-500">Working Professional</div>
              </div>
            </div>
          </div>

          <div className="bg-sleep-navy-light/40 p-6 rounded-3xl border border-white/5">
            <p className="text-xs text-gray-300 italic leading-relaxed">
              "The caffeine timing clearance curve completely adjusted my afternoon work habits. Seeing that a large espresso drank at 4 PM leaves nearly 60mg of chemical stimulant active at my midnight bedtime made it obvious why my sleep felt so shallow. Stopping caffeine by 1:30 PM works."
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sleep-blue/20 text-xs font-bold text-sleep-blue flex items-center justify-center">
                D
              </div>
              <div>
                <div className="text-xs font-bold text-white">Daniel K.</div>
                <div className="text-[10px] text-gray-500">Graduate Student</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Prominent Legal/Disclaimers */}
      <footer className="bg-sleep-dark border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Medical & Ethical Disclaimer */}
          <div className="p-4 bg-sleep-dark border border-white/5 rounded-2xl leading-relaxed text-gray-400">
            <h4 className="font-bold text-gray-200 uppercase tracking-widest text-[10px] mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-sleep-blue" />
              IMPORTANT SAFETY & MEDICAL DISCLAIMER
            </h4>
            <p className="text-[11px] leading-relaxed">
              SleepWise is entirely an educational and lifestyle tool designed around public statistical models published by sleep organizations. It is <strong>NOT</strong> a clinical diagnostic service. It does not provide medical advice, diagnosis, or treatment recommendations. Persistent sleep troubles (such as persistent insomnia, excessive daytime somnolence, heavy snoring with breathing pauses, or sleep paralysis) should be examined immediately by a qualified healthcare professional or licensed clinical somnologist.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-white/5 pt-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-sleep-blue"></div>
                <span className="font-bold text-white">SleepWise Calculator</span>
              </div>
              <p className="text-[11px]">© 2026 SleepWise. All calculations are grounded in peer-reviewed scientific studies.</p>
            </div>

            <div className="flex flex-wrap gap-4 text-gray-400 text-[11px]">
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <span>•</span>
              <a href="#research" className="hover:text-white transition-colors">Research Citations</a>
              <span>•</span>
              <span className="text-gray-500">AASM, National Sleep Foundation, Sleep Research Society</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
