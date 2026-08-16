'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Globe2, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import careersData from '@/data/careers.json';
import { StudentProfile } from '@/lib/types';

interface CareerExplorerProps {
  currentProfile: StudentProfile | null;
  onSelectCareerToAssess: (careerId: string) => void;
  onSelectCareerToSwitch: (careerId: string) => void;
}

export const CareerExplorer: React.FC<CareerExplorerProps> = ({
  currentProfile,
  onSelectCareerToAssess,
  onSelectCareerToSwitch
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCareerId, setActiveCareerId] = useState<string>(careersData[0].id);

  const categories = ['All', 'Artificial Intelligence', 'Software Engineering', 'Data & Analytics', 'Cloud & DevOps', 'Cybersecurity', 'Hardware & IoT'];

  const filteredCareers = careersData.filter(career => {
    if (selectedCategory === 'All') return true;
    return career.category === selectedCategory;
  });

  const activeCareer = careersData.find(c => c.id === activeCareerId) || careersData[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. EXPLORER HEADER */}
      <section id="career-explorer-header" className="border-b border-slate-200 pb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-1">
              Future Skills & Industry Taxonomy
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-slate-900">
              Future Career Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore benchmarked competency profiles, cross-border industry demands, and verified technical stacks for 2026–2030 tech roles.
            </p>
          </div>

          {/* Active Profile Status */}
          {currentProfile && (
            <div className="border border-slate-200 bg-white p-3 rounded-sm text-xs space-y-0.5 self-start md:self-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Target:</span>
              <span className="font-bold text-slate-900">{currentProfile.careerGoalTitle}</span>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm border transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 2. CAREER CATALOG & DETAIL SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Career Cards Catalog (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredCareers.map((career) => {
            const isSelected = career.id === activeCareer.id;
            const isCurrentGoal = currentProfile?.careerGoalId === career.id;

            return (
              <div
                key={career.id}
                id={`career-card-${career.id}`}
                onClick={() => setActiveCareerId(career.id)}
                className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-white border-slate-900 ring-1 ring-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">
                      {career.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5 uppercase tracking-tight">{career.title}</h3>
                  </div>

                  {isCurrentGoal ? (
                    <span className="bg-emerald-100 text-emerald-900 text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-sm border border-emerald-300">
                      Active Target
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">
                      {career.marketDemand}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {career.tagline}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{career.requiredCoreSkills.length} Core Skills</span>
                  <span className="text-slate-900 font-bold uppercase tracking-wider flex items-center space-x-1">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Benchmark Specification (7 cols) */}
        <div className="lg:col-span-7 border border-slate-200 rounded-sm p-6 sm:p-8 bg-white space-y-6">
          
          {/* Header */}
          <div className="border-b border-slate-100 pb-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                {activeCareer.category}
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-sm border border-slate-200">
                {activeCareer.avgSalaryRange}
              </span>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">{activeCareer.title}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{activeCareer.description}</p>
          </div>

          {/* Action CTA */}
          <div className="border border-slate-200 bg-slate-50/70 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">Target This Role</span>
              <span className="text-slate-500">
                {currentProfile ? 'Switch your active roadmap to this track' : 'Start a tailored skill assessment'}
              </span>
            </div>

            {currentProfile ? (
              <button
                id="btn-switch-career-goal"
                onClick={() => onSelectCareerToSwitch(activeCareer.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm transition-colors border border-emerald-600 shadow-sm flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Re-align Profile to {activeCareer.title.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                id="btn-assess-for-career"
                onClick={() => onSelectCareerToAssess(activeCareer.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm transition-colors border border-emerald-600 shadow-sm flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Assessment for This Track</span>
              </button>
            )}
          </div>

          {/* Required Competencies Benchmark Table */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block">
              Required Industry Competencies & Benchmark Levels
            </span>

            <div className="space-y-3">
              {activeCareer.requiredCoreSkills.map((skill) => (
                <div 
                  key={skill.name}
                  className="p-3.5 border border-slate-100 bg-slate-50/40 rounded-sm space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 uppercase tracking-wider">{skill.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                        {skill.importance}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-[11px]">
                      Benchmark: {skill.benchmarkedLevel}/10
                    </span>
                  </div>

                  {/* Flat progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-sm overflow-hidden">
                    <div 
                      className="bg-slate-900 h-full rounded-sm" 
                      style={{ width: `${(skill.benchmarkedLevel / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Border Pakistan-China Tech Corridor Context */}
          <div className="bg-slate-900 text-white rounded-sm p-5 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Cross-Border Industry Linkage & Scope</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeCareer.pkCnRelevance}
            </p>
          </div>

          {/* Key Job Titles */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Representative Industry Job Titles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeCareer.popularJobTitles.map((title) => (
                <span 
                  key={title}
                  className="text-xs bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-sm border border-slate-200"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>

          {/* Emerging 2026-2030 Trends */}
          <div className="border border-slate-200 rounded-sm p-4 space-y-2 bg-white">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Emerging 2026–2030 Industry Shifts</span>
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {activeCareer.futureTrends.map((trend, tIdx) => (
                <li key={tIdx} className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
