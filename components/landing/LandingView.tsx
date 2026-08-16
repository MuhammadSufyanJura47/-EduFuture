'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Map, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Cpu, 
  GraduationCap, 
  Layers, 
  BarChart3,
  Bot,
  Zap
} from 'lucide-react';
import careersData from '@/data/careers.json';

interface LandingViewProps {
  onStartAssessment: () => void;
  onExploreCareers: () => void;
  onLoadSample: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartAssessment,
  onExploreCareers,
  onLoadSample,
}) => {
  const [selectedDemoCareer, setSelectedDemoCareer] = useState(careersData[0].id);
  const activeCareer = careersData.find(c => c.id === selectedDemoCareer) || careersData[0];

  return (
    <div className="space-y-16 lg:space-y-24 py-8 sm:py-12">
      
      {/* 1. HERO SECTION */}
      <section id="hero-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          
          {/* Top Editorial Label */}
          <div className="inline-flex items-center space-x-2 border border-slate-200 bg-white px-3 py-1 rounded-sm">
            <div className="w-2 h-2 bg-emerald-600 rounded-sm"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">
              中巴 EduFuture • AI-Powered Education for the Future Generation
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Personalized AI Learning Pathways for Tomorrow’s Tech Leaders
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Move from academic theory to industry readiness. We diagnose exact skill gaps, generate dynamic multi-stage roadmaps, and adapt in real time to your pace.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-hero-start"
              onClick={onStartAssessment}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-colors border border-emerald-600 shadow-sm flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Free AI Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>

            <button
              id="btn-hero-sample"
              onClick={onLoadSample}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-sm transition-colors border border-slate-200 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Sample Student</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Client-Side Privacy</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Adaptive Closed Loop</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-700" />
              <span>Pakistan–China Corridors</span>
            </span>
          </div>

        </div>
      </section>

      {/* 2. CORE PHILOSOPHY & CLOSED LOOP BANNER */}
      <section id="philosophy-section" className="bg-slate-900 text-white py-14 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              The Intelligent Closed Loop
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              The Roadmap Adapts to the Learner
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              中巴 EduFuture continuously recalibrates your pathway based on mastery, available hours, and project milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Understand',
                desc: 'Analyze education level, major, current coursework, and weekly available study hours.',
                icon: BookOpen,
              },
              {
                step: '02',
                title: 'Diagnose',
                desc: 'Calculate quantitative gap scores against verified industry benchmarks and prioritize by urgency.',
                icon: BarChart3,
              },
              {
                step: '03',
                title: 'Guide',
                desc: 'Generate tailored 5-stage roadmap with concrete project deliverables and verified resources.',
                icon: Map,
              },
              {
                step: '04',
                title: 'Develop',
                desc: 'Track milestones, build portfolio code artifacts, and consult contextual AI mentorship.',
                icon: Cpu,
              },
              {
                step: '05',
                title: 'Adapt & Prepare',
                desc: 'Dynamic adaptation when schedules shift or topics are mastered early for future career launch.',
                icon: Target,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.step}
                  className="bg-slate-800/80 border border-slate-700 rounded-sm p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-sm border border-slate-700">
                      PHASE {item.step}
                    </span>
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SKILL GAP DIAGNOSTIC SANDBOX */}
      <section id="interactive-gap-sandbox" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-200 rounded-sm p-6 sm:p-8 lg:p-10 bg-white space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block mb-1">
                Taxonomy Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                Career Benchmark Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Select a future tech track to see how student competencies map against industry baselines.
              </p>
            </div>

            {/* Career Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {careersData.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  id={`demo-career-btn-${c.id}`}
                  onClick={() => setSelectedDemoCareer(c.id)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm border transition-colors ${
                    selectedDemoCareer === c.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {c.title.split(' ')[0]} {c.title.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Career Benchmark Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Career Summary */}
            <div className="lg:col-span-4 border border-slate-200 bg-slate-50/50 rounded-sm p-5 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">{activeCareer.category}</span>
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 mt-1">{activeCareer.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{activeCareer.description}</p>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Market Demand:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 text-[10px] uppercase">
                    {activeCareer.marketDemand}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Global Comp:</span>
                  <span className="font-mono text-slate-900 font-bold">{activeCareer.avgSalaryRange.split('/')[0]}</span>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Cross-Border Relevance:</span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-sm border border-slate-200 leading-relaxed">
                    {activeCareer.pkCnRelevance}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Skill Gap Matrix Simulation */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                <span>Core Competency & Benchmark Target</span>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 bg-slate-400 rounded-sm"></span>
                    <span>Student Baseline</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 bg-slate-900 rounded-sm"></span>
                    <span>Target Benchmark</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {activeCareer.requiredCoreSkills.map((skill, index) => {
                  const simulatedUserLevel = Math.max(2, Math.min(8, skill.benchmarkedLevel - ((index % 3) + 2)));
                  const targetLevel = skill.benchmarkedLevel;
                  const gap = targetLevel - simulatedUserLevel;

                  return (
                    <div key={skill.name} className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">{skill.name}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-sm border ${
                            gap >= 4 
                              ? 'bg-orange-50 text-orange-700 border-orange-200' 
                              : gap >= 2 
                              ? 'bg-amber-50 text-amber-700 border-amber-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {gap >= 4 ? 'Critical' : gap >= 2 ? 'High' : 'Foundational'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-600">
                          {simulatedUserLevel}/10 → <strong className="text-slate-900">{targetLevel}/10</strong> (-{gap})
                        </span>
                      </div>

                      {/* Editorial Flat Progress Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-sm overflow-hidden relative">
                        <div 
                          className="bg-slate-300 h-full rounded-sm" 
                          style={{ width: `${(targetLevel / 10) * 100}%` }}
                        />
                        <div 
                          className={`h-full absolute top-0 left-0 rounded-sm ${
                            gap >= 4 ? 'bg-orange-500' : 'bg-slate-900'
                          }`} 
                          style={{ width: `${(simulatedUserLevel / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 text-center">
                <button
                  id="btn-sandbox-diagnose-mine"
                  onClick={onStartAssessment}
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm transition-colors border border-emerald-600"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Diagnose My Personal Skill Gaps</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. PAKISTAN-CHINA TECH CORRIDORS IN DETAIL */}
      <section id="pak-china-bridge" className="border-y border-slate-200 bg-slate-50/60 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block">
                Cross-Border Technology Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                Pakistan–China Tech Corridors
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                As cross-border tech joint ventures, cloud infrastructure, AI research hubs, and software export initiatives expand under the China-Pakistan Economic Corridor (CPEC) and global digital trade, students require a standardized bridge between academic curriculums and high-velocity engineering demands.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-4 rounded-sm border border-slate-200 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">Global Equivalence</span>
                  <p className="text-xs text-slate-500">Benchmark local coursework against international industry standards.</p>
                </div>
                <div className="bg-white p-4 rounded-sm border border-slate-200 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">Cross-Border Scope</span>
                  <p className="text-xs text-slate-500">Prepare for international remote internships, R&D labs, and tech ventures.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Emerging Tech Focus</span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">2026-2030 Horizon</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    {
                      hub: 'Smart City & Port Telemetry (Gwadar / CPEC Hub)',
                      tech: 'IoT Firmware, Edge Computing, C++, PyTorch Vision',
                      demand: 'High Growth'
                    },
                    {
                      hub: 'Cross-Border Digital Finance & E-Commerce',
                      tech: 'Distributed Systems, Next.js, Cloud Microservices, Security',
                      demand: 'Immediate'
                    },
                    {
                      hub: 'Joint AI Research & Multimodal Models',
                      tech: 'LLM Agents, RAG Pipelines, Vector Databases, MLOps',
                      demand: 'Surging'
                    },
                    {
                      hub: 'Clean Energy & Smart Grid Analytics',
                      tech: 'Data Science, Time-Series Modeling, Python, SQL',
                      demand: 'Strategic'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-sm space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{item.hub}</span>
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                          {item.demand}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] font-mono">
                        Stack: {item.tech}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section id="cta-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-900 bg-slate-900 text-white rounded-sm p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 block">
              Personalized Career Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Ready to Understand Your Standing & Shape Your Future?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Take the 3-minute diagnostic assessment. Receive your customized skill gap breakdown, 5-stage milestone roadmap, and 24/7 contextual AI guidance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-cta-start"
              onClick={onStartAssessment}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-colors border border-emerald-600 shadow-sm flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Begin Student Assessment</span>
            </button>

            <button
              id="btn-cta-explore-careers"
              onClick={onExploreCareers}
              className="w-full sm:w-auto bg-transparent hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-sm transition-colors border border-slate-700"
            >
              Explore Career Pathways
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
