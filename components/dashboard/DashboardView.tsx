'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Map, 
  Bot, 
  Clock, 
  GraduationCap, 
  ArrowRight, 
  RefreshCw, 
  BookOpen, 
  Sliders, 
  ExternalLink
} from 'lucide-react';
import { StudentProfile, AssessmentResult, PersonalizedRoadmap } from '@/lib/types';
import careersData from '@/data/careers.json';

interface DashboardViewProps {
  profile: StudentProfile;
  assessment: AssessmentResult;
  roadmap: PersonalizedRoadmap;
  onNavigateTab: (tab: string) => void;
  onOpenAdaptModal: () => void;
  onRetakeAssessment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  assessment,
  roadmap,
  onNavigateTab,
  onOpenAdaptModal,
  onRetakeAssessment
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Critical' | 'High' | 'Foundational'>('All');

  const careerInfo = careersData.find(c => c.id === profile.careerGoalId) || careersData[0];
  const activeStage = roadmap.stages.find(s => s.stageNumber === roadmap.currentStageNumber) || roadmap.stages[0];

  const filteredGaps = assessment.skillGaps.filter(gap => {
    if (activeFilter === 'All') return true;
    return gap.priority === activeFilter;
  });

  const criticalGapsCount = assessment.skillGaps.filter(g => g.priority === 'Critical').length;
  const highGapsCount = assessment.skillGaps.filter(g => g.priority === 'High').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. TOP DIAGNOSTIC BANNER */}
      <section id="dashboard-lead-banner" className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-1">
            Personalized Diagnostic Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-slate-900">
            Student Intelligence Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-dash-retake"
            onClick={onRetakeAssessment}
            className="text-[10px] uppercase font-bold tracking-widest bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-sm border border-slate-200 transition-colors"
          >
            Update Profile
          </button>
          <button
            id="btn-dash-adapt-roadmap"
            onClick={onOpenAdaptModal}
            className="text-[10px] uppercase font-bold tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-sm transition-colors border border-emerald-600 shadow-sm flex items-center space-x-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Adapt Roadmap</span>
          </button>
        </div>
      </section>

      {/* 2. THREE-PANEL EDITORIAL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Profile & Goal Metric (3 cols) */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Profile Overview */}
          <div className="border border-slate-200 rounded-sm p-5 space-y-4 bg-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-100 pb-2">
              Profile Overview
            </span>

            <div>
              <p className="text-base font-bold text-slate-900">{profile.fullName}</p>
              <p className="text-xs text-slate-500">{profile.major}</p>
            </div>

            <div className="space-y-2.5 text-xs pt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Education Level</span>
                <span className="font-semibold text-slate-800">{profile.educationLevel}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Year</span>
                <span className="font-semibold text-slate-800">{profile.currentYearOrSemester}</span>
              </div>

              {profile.institution && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Institution</span>
                  <span className="font-semibold text-slate-800">{profile.institution}</span>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Interests</span>
                <div className="flex flex-wrap gap-1">
                  {profile.interests.map(interest => (
                    <span key={interest} className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold uppercase tracking-tighter text-slate-700 rounded-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Target Direction */}
          <div className="border border-slate-200 rounded-sm p-5 space-y-3 bg-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block border-b border-slate-100 pb-2">
              Target Direction
            </span>

            <div className="p-3.5 bg-slate-50 rounded-sm border border-slate-100 space-y-1">
              <span className="text-[10px] font-black text-emerald-600 uppercase block tracking-wider">
                Future Goal
              </span>
              <p className="text-base font-bold text-slate-900 leading-tight">
                {profile.careerGoalTitle}
              </p>
              <p className="text-[11px] text-slate-500 italic pt-1">
                {careerInfo.avgSalaryRange} • {careerInfo.marketDemand}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{profile.weeklyAvailableHours} hrs/week committed</span>
            </div>
          </div>

          {/* Preparation Status Dark Box */}
          <div className="bg-slate-900 text-white p-6 rounded-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block">
                Readiness Score
              </span>
              <div className="text-5xl font-black text-white font-mono mt-1">
                {assessment.readinessScore}%
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Calculated against {careerInfo.title} benchmark.
              </p>
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-sm overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-sm" 
                style={{ width: `${assessment.readinessScore}%` }}
              />
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Duration</span>
              <span className="font-mono text-emerald-400 font-bold">{assessment.estimatedTimeToReadinessWeeks} Weeks</span>
            </div>
          </div>

        </aside>

        {/* CENTER COLUMN: Skill Gap Diagnosis Engine (6 cols) */}
        <main className="lg:col-span-6 space-y-6">
          
          {/* Executive Summary Card */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-sm p-5 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Diagnostic Assessment Overview</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {assessment.overallDiagnosis}
            </p>
          </div>

          {/* Skill Gap Analysis Section */}
          <div className="border border-slate-200 rounded-sm p-6 bg-white space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-1">
                  Taxonomy Evaluation
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  Skill Gap Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {criticalGapsCount} critical & {highGapsCount} high-priority developmental areas.
                </p>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center space-x-1">
                {(['All', 'Critical', 'High', 'Foundational'] as const).map(filter => (
                  <button
                    key={filter}
                    id={`btn-filter-gaps-${filter.toLowerCase()}`}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm border transition-colors ${
                      activeFilter === filter
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Gap List */}
            <div className="space-y-4">
              {filteredGaps.map((gap) => (
                <div 
                  key={gap.skillName}
                  className="p-4 border border-slate-100 bg-slate-50/50 rounded-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        {gap.skillName}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-sm border ${
                        gap.priority === 'Critical'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : gap.priority === 'High'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="text-slate-500">{gap.userLevel}/10</span>
                      <span className="text-slate-300">→</span>
                      <span className="text-slate-900 font-bold">{gap.targetLevel}/10</span>
                      <span className="text-orange-600 font-bold ml-1">(-{gap.gapScore})</span>
                    </div>
                  </div>

                  {/* Progress Bar (Solid, flat editorial style) */}
                  <div className="w-full bg-slate-200 h-2 rounded-sm overflow-hidden relative">
                    <div 
                      className="bg-slate-300 h-full absolute top-0 left-0" 
                      style={{ width: `${(gap.targetLevel / 10) * 100}%` }}
                    />
                    <div 
                      className={`h-full absolute top-0 left-0 ${
                        gap.priority === 'Critical' ? 'bg-orange-500' : 'bg-slate-900'
                      }`}
                      style={{ width: `${(gap.userLevel / 10) * 100}%` }}
                    />
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="leading-relaxed">{gap.explanation}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      <strong>Recommended Topic:</strong> {gap.recommendedFirstTopic}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rationale Callout */}
            <div className="border-t border-slate-100 pt-4 text-xs text-slate-600">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Sequencing Rationale
              </span>
              <p className="leading-relaxed">{assessment.learningOrderRationale}</p>
            </div>

          </div>

          {/* Action Recommendation Banner */}
          <div className="p-5 bg-emerald-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-sm">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-80 block mb-0.5">
                Next Immediate Priority
              </span>
              <p className="text-sm font-bold">
                {assessment.keyRecommendations[0] || 'Begin Stage 1 Foundations'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="bg-white text-emerald-600 hover:bg-emerald-50 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-colors border border-white flex-shrink-0"
            >
              Open Stage 1
            </button>
          </div>

          {/* Diagnostic Profile Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-sm p-4 bg-white space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Validated Strengths
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {assessment.strengths.map((str, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-slate-200 rounded-sm p-4 bg-white space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Pitfalls to Watch
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {assessment.potentialWeaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </main>

        {/* RIGHT COLUMN: Adaptive Roadmap Rail (3 cols) */}
        <aside className="lg:col-span-3 space-y-6">
          
          <div className="border border-slate-200 rounded-sm p-5 bg-white space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Adaptive Roadmap
              </span>
              <button
                onClick={() => onNavigateTab('roadmap')}
                className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700"
              >
                View Full
              </button>
            </div>

            {/* Vertical Timeline */}
            <div className="border-l-2 border-slate-100 ml-2 pl-4 space-y-6 text-xs">
              {roadmap.stages.map((stage) => {
                const isCurrent = stage.stageNumber === roadmap.currentStageNumber;
                const isDone = stage.milestoneCompleted;

                return (
                  <div key={stage.id} className="relative group cursor-pointer" onClick={() => onNavigateTab('roadmap')}>
                    {/* Node Dot */}
                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-white absolute -left-[23px] top-0.5 ${
                      isDone
                        ? 'bg-emerald-600'
                        : isCurrent
                        ? 'bg-slate-900'
                        : 'bg-slate-300'
                    }`} />

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          Stage {stage.stageNumber} • {stage.estimatedWeeks}w
                        </span>
                        {isDone ? (
                          <span className="text-[9px] font-bold text-emerald-600 uppercase">Done</span>
                        ) : isCurrent ? (
                          <span className="text-[9px] font-bold text-slate-900 uppercase">Active</span>
                        ) : null}
                      </div>

                      <p className={`font-bold leading-tight ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>
                        {stage.title}
                      </p>

                      <div className="flex items-center space-x-2 pt-1 text-[10px] text-slate-500">
                        <span>{stage.topics.filter(t => t.completed).length}/{stage.topics.length} Topics</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contextual AI Mentor Box */}
          <div className="border border-slate-200 rounded-sm p-5 bg-slate-50 space-y-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Contextual AI Mentor
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask specific technical questions, practice problems, or sequencing rationale for Stage {activeStage.stageNumber}.
            </p>
            <button
              onClick={() => onNavigateTab('guidance')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-sm transition-colors text-center"
            >
              Consult Mentor
            </button>
          </div>

          {/* Cross Border Linkage Box */}
          <div className="border border-slate-200 rounded-sm p-5 bg-white space-y-2">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Cross-Border Linkage
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Curriculum benchmarked against CPEC technology corridors and joint Pakistan-China AI research programs.
            </p>
            <button
              onClick={() => onNavigateTab('careers')}
              className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 pt-1"
            >
              <span>Explore taxonomy</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </aside>

      </div>

    </div>
  );
};
