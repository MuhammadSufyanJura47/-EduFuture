'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Loader2, 
  RotateCcw,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { StudentProfile, AssessmentResult, PersonalizedRoadmap } from '@/lib/types';

interface GuidanceChatProps {
  profile: StudentProfile | null;
  assessment: AssessmentResult | null;
  roadmap: PersonalizedRoadmap | null;
  initialPrompt?: string | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export const GuidanceChat: React.FC<GuidanceChatProps> = ({
  profile,
  assessment,
  roadmap,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Welcome to the 中巴 EduFuture AI Guidance Mentor

I am your dedicated future educational architect. I have direct context on:
- **Target Career Track:** ${profile ? profile.careerGoalTitle : 'General technology exploration'}
- **Academic Background:** ${profile ? `${profile.major}, ${profile.educationLevel}` : 'Not yet configured'}
- **Active Roadmap:** ${roadmap ? `Stage ${roadmap.currentStageNumber} (${roadmap.stages.find(s => s.stageNumber === roadmap.currentStageNumber)?.title})` : 'Awaiting assessment'}

Ask me anything regarding **curriculum sequencing**, **project architecture**, **technical interview preparation**, or **cross-border industry opportunities**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How should I structure my Stage 1 Project repository?',
        'Why was this specific skill diagnosed as a Critical Gap?',
        'How do I balance 10 weekly hours between theory and coding?',
        'What tech stack skills are high-demand in Pak-China joint ventures?'
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState<string>(initialPrompt || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showContextDrawer, setShowContextDrawer] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          profile,
          roadmap,
          assessment,
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) throw new Error('Guidance request failed');

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am here to guide your learning roadmap.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an issue connecting to the AI mentor. Please check your network connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, profile, roadmap, assessment, messages]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Chat history cleared. How can I assist your educational roadmap today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Break down my current stage project into milestones',
          'How do I test my understanding for this stage?',
          'What are the best open-source resources for this gap?'
        ]
      }
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. TOP HEADER */}
      <div className="border border-slate-200 bg-white rounded-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-slate-900 rounded-sm flex items-center justify-center text-white flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
                Contextual AI Education Mentor
              </h1>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-sm border border-emerald-200">
                Gemini 3.7 Agent
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized guidance grounded in your active profile, stage progress, and skill gap matrix.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowContextDrawer(!showContextDrawer)}
            className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors flex items-center space-x-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{showContextDrawer ? 'Hide Context' : 'Inspect Context'}</span>
          </button>

          <button
            onClick={handleClearChat}
            className="text-xs text-slate-400 hover:text-red-600 p-2 rounded-sm hover:bg-slate-50 border border-slate-200"
            title="Reset chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CONTEXT INSPECTOR DRAWER */}
      {showContextDrawer && (
        <div className="bg-slate-900 text-white rounded-sm p-5 text-xs space-y-3 border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="font-bold uppercase tracking-[0.2em] text-[10px] text-emerald-400">
              Active Context Parameters Sent to AI
            </span>
            <span className="text-slate-400 text-[10px]">Zero centralized database</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/80 p-3 rounded-sm border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Student Baseline</span>
              <span className="font-bold text-white block mt-0.5">
                {profile ? `${profile.fullName} (${profile.major})` : 'Anonymous Student'}
              </span>
              <span className="text-slate-400 text-[10px] block mt-0.5">
                {profile?.weeklyAvailableHours || 10} hrs/week committed
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-sm border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Career</span>
              <span className="font-bold text-emerald-400 block mt-0.5">
                {profile?.careerGoalTitle || 'General Technology'}
              </span>
              <span className="text-slate-400 text-[10px] block mt-0.5">
                Readiness: {assessment?.readinessScore || 'N/A'}%
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-sm border border-slate-700">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Milestone</span>
              <span className="font-bold text-white block mt-0.5">
                {roadmap ? `Stage ${roadmap.currentStageNumber}: ${roadmap.stages.find(s => s.stageNumber === roadmap.currentStageNumber)?.milestoneTitle}` : 'None'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHAT MESSAGES WINDOW */}
      <div className="border border-slate-200 rounded-sm bg-white shadow-sm flex flex-col h-[600px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-sm p-4 text-xs sm:text-sm space-y-2 ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 border border-slate-100 text-slate-800'
              }`}>
                <div className="markdown-content prose prose-sm max-w-none text-slate-800 leading-relaxed dark:prose-invert">
                  <div className={msg.role === 'user' ? 'text-white' : 'text-slate-800'}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>

                <div className={`text-[9px] text-right font-mono ${
                  msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </div>

                {/* AI Follow-up Suggestion Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-slate-200 space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                      Suggested Next Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          className="text-left text-[10px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-medium px-2 py-1 rounded-sm border border-slate-200 hover:border-emerald-300 transition-colors"
                        >
                          &ldquo;{sug}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-7 h-7 rounded-sm bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 text-xs flex items-center space-x-2 text-slate-600">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>Synthesizing guidance from profile context & active stage...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* 3. INPUT AREA */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 space-y-2">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center space-x-2"
          >
            <input
              id="input-guidance-message"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your AI mentor about sequencing, code architecture, or interview prep..."
              className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
            />
            <button
              type="submit"
              id="btn-send-guidance"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-sm transition-colors border border-emerald-600 flex-shrink-0 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Closed-loop pedagogical advisor</span>
            </span>
            <span>Gemini 3.7 Intelligence</span>
          </div>
        </div>

      </div>

    </div>
  );
};
