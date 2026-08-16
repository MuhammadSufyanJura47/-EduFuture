'use client';

import React from 'react';
import { 
  Sparkles, 
  Globe2, 
  Lock
} from 'lucide-react';

interface AboutViewProps {
  onStartAssessment: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartAssessment }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. VISION HERO */}
      <section id="about-hero" className="border-b border-slate-200 pb-8 space-y-4">
        <div className="max-w-3xl space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block">
            Vision & Architectural Manifesto
          </span>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Democratizing Elite Educational Architecture for Future Generations
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            <strong>中巴 EduFuture</strong> is an adaptive, AI-driven educational platform designed to empower students across Pakistan, China, and emerging economies. We bridge the critical divide between university coursework and high-velocity engineering roles in modern AI, Cloud, and Software infrastructure.
          </p>
        </div>
      </section>

      {/* 2. THE CORE PROBLEM VS. OUR SOLUTION */}
      <section id="problem-solution-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* The Problem */}
        <div className="border border-slate-200 rounded-sm p-6 sm:p-8 space-y-4 bg-white">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block border-b border-slate-100 pb-2">
            Status Quo Limitations
          </span>

          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
            Fragmentation of Self-Learning
          </h2>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="text-slate-400 font-bold">•</span>
              <span><strong>Generic Chatbots Lack Direction:</strong> Chat interfaces provide isolated answers without measuring progressive skill mastery or long-term accountability.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-400 font-bold">•</span>
              <span><strong>Static Course Libraries:</strong> Video platforms dump hundreds of hours of video without diagnosing an individual&apos;s exact starting gaps.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-slate-400 font-bold">•</span>
              <span><strong>Curriculum Mismatch:</strong> Academic syllabi often trail industry-grade tools (PyTorch, Docker, Kubernetes, LLM Agents) by 3–5 years.</span>
            </li>
          </ul>
        </div>

        {/* The EduFuture Solution */}
        <div className="border border-slate-200 rounded-sm p-6 sm:p-8 space-y-4 bg-slate-50/50">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block border-b border-slate-200 pb-2">
            The EduFuture Architecture
          </span>

          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
            Intelligent Closed-Loop Adaptation
          </h2>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Mathematical Skill Diagnosis:</strong> Quantitative gap calculation between learner competencies and verified industry benchmarks.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Dynamic 5-Stage Roadmap:</strong> Scaffolds learning into concrete topics, time estimates, and verifiable GitHub project deliverables.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Adaptive Pacing:</strong> When students progress faster, encounter exam schedules, or shift interests, the curriculum adapts in real time.</span>
            </li>
          </ul>
        </div>

      </section>

      {/* 3. PAKISTAN-CHINA TECH CORRIDORS IN DETAIL */}
      <section id="cross-border-context" className="bg-slate-900 text-white rounded-sm p-6 sm:p-10 border border-slate-800 space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            Strategic Regional Context
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Pakistan–China Educational & Technological Cooperation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The bilateral relationship between Pakistan and China is advancing into joint technological incubation, CPEC digital logistics, robotics research, and software outsourcing. 中巴 EduFuture provides the standardized competency frameworks needed for cross-border talent readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800/90 p-5 rounded-sm border border-slate-700 space-y-2">
            <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider block">1. Research Linkages</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aligning university coursework with state laboratories in AI, edge computing, and distributed networks.
            </p>
          </div>

          <div className="bg-slate-800/90 p-5 rounded-sm border border-slate-700 space-y-2">
            <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider block">2. Software Export Standards</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Equipping South Asian graduates with international engineering practices, test-driven development, and cloud scalability.
            </p>
          </div>

          <div className="bg-slate-800/90 p-5 rounded-sm border border-slate-700 space-y-2">
            <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider block">3. Inclusive Opportunity</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ensuring students across all regions have equal access to world-class educational roadmap synthesis.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRIVACY, SAFETY & ETHICS */}
      <section id="privacy-standards" className="border border-slate-200 rounded-sm p-6 sm:p-8 bg-white space-y-4">
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Security & Data Ethics Guarantees</span>
        </div>

        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
          Client-First Privacy & Zero-Database Architecture
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In strict accordance with modern privacy principles, 中巴 EduFuture operates with zero centralized student databases. All assessments, skill evaluations, and custom roadmaps reside strictly inside your browser&apos;s local storage. AI processing is performed over stateless server-side endpoints with enterprise-grade encryption.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Ready to experience personalized AI education?
          </span>
          <button
            onClick={onStartAssessment}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm transition-colors border border-emerald-600 shadow-sm flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Your Free Assessment</span>
          </button>
        </div>
      </section>

    </div>
  );
};
