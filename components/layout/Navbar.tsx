'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Map, 
  Briefcase, 
  Bot, 
  Info, 
  LayoutDashboard, 
  Menu, 
  X, 
  CheckCircle2, 
  RotateCcw,
  GraduationCap
} from 'lucide-react';
import { StudentProfile } from '@/lib/types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile | null;
  onLoadSample: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onLoadSample,
  onResetData
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresProfile: true },
    { id: 'assessment', label: 'Assessment', icon: Sparkles },
    { id: 'roadmap', label: 'Roadmap', icon: Map, requiresProfile: true },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'guidance', label: 'AI Mentor', icon: Bot },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Title with Editorial Square Stamp */}
          <div 
            id="brand-logo-container" 
            onClick={() => handleNavClick('landing')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded-sm text-white font-bold text-xs tracking-tight flex-shrink-0">
              <span>中巴</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <h1 className="text-xl font-black tracking-tighter uppercase text-slate-900">
                EduFuture
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200 hidden sm:inline-block">
                AI Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links with Editorial uppercase tracking */}
          <nav id="desktop-nav" className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-widest uppercase">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`pb-1 transition-all uppercase ${
                    isActive
                      ? 'text-emerald-600 border-b-2 border-emerald-600 font-bold'
                      : 'text-slate-600 hover:text-emerald-600 border-b-2 border-transparent'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div id="nav-actions-container" className="hidden sm:flex items-center space-x-3">
            {profile ? (
              <div className="flex items-center space-x-3">
                <div 
                  onClick={() => handleNavClick('dashboard')}
                  className="text-right cursor-pointer group"
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Student Account</p>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate max-w-[120px]">
                    {profile.fullName}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 text-xs font-bold">
                  {profile.fullName.charAt(0) || 'S'}
                </div>
                <button
                  id="btn-reset-profile"
                  onClick={onResetData}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-sm transition-colors border border-slate-200"
                  title="Reset profile data"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-load-sample-profile"
                onClick={onLoadSample}
                className="text-[10px] uppercase font-bold tracking-widest bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-sm border border-slate-200 transition-colors flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Sample Student</span>
              </button>
            )}

            <button
              id="btn-nav-start-assessment"
              onClick={() => handleNavClick('assessment')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-colors border border-emerald-600 flex items-center space-x-1.5 shadow-sm"
            >
              <Sparkles className="w-3 h-3" />
              <span>{profile ? 'Retake' : 'Start Assessment'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm text-slate-700 hover:bg-slate-100 border border-slate-200 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-dropdown" className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigation</span>
            {profile ? (
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                {profile.fullName}
              </span>
            ) : (
              <button
                onClick={() => { onLoadSample(); setMobileMenuOpen(false); }}
                className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider underline"
              >
                Load Sample
              </button>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'text-emerald-600 bg-emerald-50 border-l-2 border-emerald-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-200 flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('assessment')}
              className="w-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest py-2.5 px-4 rounded-sm flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{profile ? 'Retake Assessment' : 'Start Assessment'}</span>
            </button>
            {profile && (
              <button
                onClick={() => { onResetData(); setMobileMenuOpen(false); }}
                className="w-full bg-slate-50 text-red-600 font-bold text-[10px] uppercase tracking-widest py-2 px-4 rounded-sm border border-slate-200 text-center"
              >
                Clear Profile Data & Reset
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
