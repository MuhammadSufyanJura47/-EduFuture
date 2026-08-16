'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LandingView } from '@/components/landing/LandingView';
import { AssessmentWizard } from '@/components/onboarding/AssessmentWizard';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { RoadmapView } from '@/components/roadmap/RoadmapView';
import { CareerExplorer } from '@/components/careers/CareerExplorer';
import { GuidanceChat } from '@/components/guidance/GuidanceChat';
import { AboutView } from '@/components/about/AboutView';
import { StudentProfile, AssessmentResult, PersonalizedRoadmap } from '@/lib/types';
import { storage } from '@/lib/storage';
import { SAMPLE_STUDENT_PROFILE, SAMPLE_ASSESSMENT_RESULT, SAMPLE_ROADMAP } from '@/lib/sample-data';

const emptySubscribe = () => () => {};

export default function Home() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [profile, setProfile] = useState<StudentProfile | null>(() => storage.getProfile());
  const [assessment, setAssessment] = useState<AssessmentResult | null>(() => storage.getAssessment());
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(() => storage.getRoadmap());
  const [guidanceInitialPrompt, setGuidanceInitialPrompt] = useState<string | null>(null);

  // Handle Load Sample Profile
  const handleLoadSample = () => {
    storage.saveProfile(SAMPLE_STUDENT_PROFILE);
    storage.saveAssessment(SAMPLE_ASSESSMENT_RESULT);
    storage.saveRoadmap(SAMPLE_ROADMAP);

    setProfile(SAMPLE_STUDENT_PROFILE);
    setAssessment(SAMPLE_ASSESSMENT_RESULT);
    setRoadmap(SAMPLE_ROADMAP);
    setActiveTab('dashboard');
  };

  // Handle Reset Data
  const handleResetData = () => {
    if (window.confirm('Reset all your local profile, assessment, and roadmap data?')) {
      storage.clearAll();
      setProfile(null);
      setAssessment(null);
      setRoadmap(null);
      setActiveTab('landing');
    }
  };

  // Handle Assessment Completion
  const handleAssessmentComplete = (
    newProfile: StudentProfile,
    newAssessment: AssessmentResult,
    newRoadmap: PersonalizedRoadmap
  ) => {
    setProfile(newProfile);
    setAssessment(newAssessment);
    setRoadmap(newRoadmap);
    setActiveTab('dashboard');
  };

  // Handle Switching Career Goal from Explorer
  const handleSwitchCareerGoal = (careerId: string) => {
    setActiveTab('assessment');
  };

  const handleSelectCareerToAssess = (careerId: string) => {
    setActiveTab('assessment');
  };

  // Handle Opening Guidance with topic context
  const handleOpenGuidanceWithContext = (promptText?: string) => {
    if (promptText) {
      setGuidanceInitialPrompt(promptText);
    }
    setActiveTab('guidance');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Initializing 中巴 EduFuture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onLoadSample={handleLoadSample}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingView
            onStartAssessment={() => setActiveTab('assessment')}
            onExploreCareers={() => setActiveTab('careers')}
            onLoadSample={handleLoadSample}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentWizard
            existingProfile={profile}
            onComplete={handleAssessmentComplete}
            onCancel={() => setActiveTab(profile ? 'dashboard' : 'landing')}
          />
        )}

        {activeTab === 'dashboard' && profile && assessment && roadmap && (
          <DashboardView
            profile={profile}
            assessment={assessment}
            roadmap={roadmap}
            onNavigateTab={setActiveTab}
            onOpenAdaptModal={() => setActiveTab('roadmap')}
            onRetakeAssessment={() => setActiveTab('assessment')}
          />
        )}

        {activeTab === 'dashboard' && (!profile || !assessment || !roadmap) && (
          <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">No Active Student Profile Found</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Complete a 3-minute AI assessment or load a sample profile to explore the diagnostic dashboard and dynamic roadmap.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('assessment')}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Start Assessment
                </button>
                <button
                  onClick={handleLoadSample}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-5 py-2.5 rounded-lg border border-slate-300 transition-colors"
                >
                  Load Sample Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && profile && roadmap && (
          <RoadmapView
            profile={profile}
            roadmap={roadmap}
            onUpdateRoadmap={(newRoadmap) => setRoadmap(newRoadmap)}
            onOpenGuidance={handleOpenGuidanceWithContext}
          />
        )}

        {activeTab === 'roadmap' && (!profile || !roadmap) && (
          <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Roadmap Not Generated Yet</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Generate your personalized 5-stage roadmap by taking the quick diagnostic assessment.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('assessment')}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors"
                >
                  Start Assessment
                </button>
                <button
                  onClick={handleLoadSample}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-5 py-2.5 rounded-lg border border-slate-300 transition-colors"
                >
                  Load Sample Roadmap
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <CareerExplorer
            currentProfile={profile}
            onSelectCareerToAssess={handleSelectCareerToAssess}
            onSelectCareerToSwitch={handleSwitchCareerGoal}
          />
        )}

        {activeTab === 'guidance' && (
          <GuidanceChat
            profile={profile}
            assessment={assessment}
            roadmap={roadmap}
            initialPrompt={guidanceInitialPrompt}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            onStartAssessment={() => setActiveTab('assessment')}
          />
        )}
      </main>

      {/* Persistent Footer */}
      <Footer onNavigate={setActiveTab} />

    </div>
  );
}
