'use client';

import React from 'react';
import Image from 'next/image';
import { 
  GraduationCap, 
  ShieldCheck, 
  Globe2, 
  Sparkles, 
  Cpu, 
  Layers 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1 & 2: Brand & Core Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="中巴 EduFuture logo" 
                width={56} 
                height={56}
                className="h-11 w-11 sm:h-12 sm:w-12 object-contain flex-shrink-0"
                priority
              />
              <div>
                <span className="text-white text-base font-black tracking-tight uppercase">中巴 EduFuture</span>
                <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  AI-Powered Education for the Future Generation
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students across Pakistan, China, and international tech ecosystems to navigate the gap between academic theory and future industrial leadership through personalized, closed-loop AI mentorship.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700 rounded-sm px-3 py-1.5 text-[10px] text-slate-300">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-sm"></span>
                <span className="font-bold text-emerald-300 uppercase tracking-wider">Closed Loop:</span>
                <span>Understand → Diagnose → Guide → Develop → Prepare</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Platform</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('landing')}
                  className="hover:text-white transition-colors"
                >
                  Platform Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('assessment')}
                  className="hover:text-white transition-colors"
                >
                  AI Skill Assessment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('roadmap')}
                  className="hover:text-white transition-colors"
                >
                  Personalized Roadmap
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('careers')}
                  className="hover:text-white transition-colors"
                >
                  Future Career Explorer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('guidance')}
                  className="hover:text-white transition-colors"
                >
                  Contextual AI Mentor
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Pakistan-China Tech Corridors */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Cross-Border Vision</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>CPEC Digital Innovation Corridors</span>
              </li>
              <li className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Joint AI & Robotics Research</span>
              </li>
              <li className="flex items-center space-x-2">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Higher Education Linkages</span>
              </li>
              <li className="flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Talent Mobility & Skill Standards</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Data Privacy & Ethics */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Trust & Ethics</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Zero-Database MVP:</strong> All profile analysis is processed client-side with secure server-side AI endpoints.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Advisory Guidance:</strong> Algorithmic roadmap recommendations designed for self-directed mastery.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 space-y-4 sm:space-y-0">
          <p>© 2026 中巴 EduFuture. Developed for the Future Generation of Global Innovators.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300 transition-colors uppercase font-bold text-[10px] tracking-wider">
              About Project
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 font-mono">Vercel Ready</span>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider">AI Education Track</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
