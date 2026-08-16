'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  Map, 
  Sliders, 
  Download, 
  BookOpen, 
  ExternalLink, 
  Layers, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  History, 
  Check, 
  Copy,
  Loader2,
  FolderGit2
} from 'lucide-react';
import { PersonalizedRoadmap, StudentProfile, RoadmapStage } from '@/lib/types';
import { storage } from '@/lib/storage';

interface RoadmapViewProps {
  profile: StudentProfile;
  roadmap: PersonalizedRoadmap;
  onUpdateRoadmap: (newRoadmap: PersonalizedRoadmap) => void;
  onOpenGuidance: (topicContext?: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  profile,
  roadmap,
  onUpdateRoadmap,
  onOpenGuidance
}) => {
  const [expandedStages, setExpandedStages] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false
  });

  const [isAdaptModalOpen, setIsAdaptModalOpen] = useState(false);
  const [adaptationInput, setAdaptationInput] = useState('');
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptSuccessMsg, setAdaptSuccessMsg] = useState<string | null>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleStageExpand = (stageNum: number) => {
    setExpandedStages(prev => ({ ...prev, [stageNum]: !prev[stageNum] }));
  };

  // Calculate overall completed topics
  const allTopics = roadmap.stages.flatMap(s => s.topics);
  const completedTopicsCount = allTopics.filter(t => t.completed).length;
  const overallProgress = allTopics.length > 0 
    ? Math.round((completedTopicsCount / allTopics.length) * 100)
    : 0;

  // Toggle Topic Completion
  const handleToggleTopic = (stageId: string, topicId: string) => {
    const updatedStages = roadmap.stages.map(stage => {
      if (stage.id !== stageId) return stage;

      const updatedTopics = stage.topics.map(t => {
        if (t.id === topicId) return { ...t, completed: !t.completed };
        return t;
      });

      const allDone = updatedTopics.every(t => t.completed);
      return {
        ...stage,
        topics: updatedTopics,
        status: allDone ? ('completed' as const) : ('in-progress' as const)
      };
    });

    const updatedRoadmap: PersonalizedRoadmap = {
      ...roadmap,
      stages: updatedStages,
      overallProgressPercent: overallProgress
    };

    onUpdateRoadmap(updatedRoadmap);
    storage.saveRoadmap(updatedRoadmap);
  };

  // Toggle Project Completion
  const handleToggleProject = (stageId: string, projectId: string) => {
    const updatedStages = roadmap.stages.map(stage => {
      if (stage.id !== stageId) return stage;
      return {
        ...stage,
        projects: stage.projects.map(p => {
          if (p.id === projectId) return { ...p, completed: !p.completed };
          return p;
        })
      };
    });

    const updatedRoadmap: PersonalizedRoadmap = {
      ...roadmap,
      stages: updatedStages
    };

    onUpdateRoadmap(updatedRoadmap);
    storage.saveRoadmap(updatedRoadmap);
  };

  // Complete Stage Milestone
  const handleToggleMilestone = (stageId: string) => {
    const updatedStages = roadmap.stages.map(stage => {
      if (stage.id !== stageId) return stage;
      const willBeCompleted = !stage.milestoneCompleted;
      if (willBeCompleted) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas-confetti is not loaded
        }
      }
      return {
        ...stage,
        milestoneCompleted: willBeCompleted,
        status: willBeCompleted ? ('completed' as const) : stage.status
      };
    });

    const updatedRoadmap: PersonalizedRoadmap = {
      ...roadmap,
      stages: updatedStages
    };

    onUpdateRoadmap(updatedRoadmap);
    storage.saveRoadmap(updatedRoadmap);
  };

  // Run AI Dynamic Adaptation
  const handleRunAdaptation = async (customReason?: string) => {
    const reason = customReason || adaptationInput;
    if (!reason.trim()) return;

    setIsAdapting(true);
    setAdaptSuccessMsg(null);

    try {
      const res = await fetch('/api/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmap,
          profile,
          feedback: reason.trim()
        })
      });

      if (!res.ok) throw new Error('Failed to adapt roadmap');

      const data = await res.json();
      if (data.roadmap) {
        onUpdateRoadmap(data.roadmap);
        storage.saveRoadmap(data.roadmap);
        setAdaptSuccessMsg(data.changesSummary || 'Roadmap adapted successfully.');
        setTimeout(() => {
          setIsAdapting(false);
          setIsAdaptModalOpen(false);
          setAdaptationInput('');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setIsAdapting(false);
      alert('Could not adapt roadmap right now. Please try again.');
    }
  };

  // Export as Markdown
  const generateMarkdown = () => {
    let md = `# 中巴 EduFuture Personalized Learning Roadmap\n\n`;
    md += `**Student:** ${profile.fullName}\n`;
    md += `**Major:** ${profile.major} (${profile.educationLevel})\n`;
    md += `**Target Career:** ${profile.careerGoalTitle}\n`;
    md += `**Weekly Available Study:** ${profile.weeklyAvailableHours} Hours/Week\n`;
    md += `**Overall Progress:** ${overallProgress}%\n\n`;
    md += `---\n\n`;

    roadmap.stages.forEach(stage => {
      md += `## Stage ${stage.stageNumber}: ${stage.title}\n`;
      md += `*${stage.tagline}* (Est. ${stage.estimatedWeeks} Weeks)\n\n`;
      md += `### Topics:\n`;
      stage.topics.forEach(t => {
        md += `- [${t.completed ? 'x' : ' '}] **${t.title}** (${t.estimatedHours}h): ${t.description}\n`;
        md += `  *Key Concepts:* ${t.keyConcepts.join(', ')}\n`;
      });
      md += `\n### Milestone Project:\n`;
      stage.projects.forEach(p => {
        md += `- [${p.completed ? 'x' : ' '}] **${p.title}** (${p.difficulty})\n`;
        md += `  ${p.description}\n`;
        md += `  *Deliverables:* ${p.deliverables.join('; ')}\n`;
      });
      md += `\n### Milestone Badge:\n`;
      md += `- **${stage.milestoneTitle}**: ${stage.milestoneDescription} [${stage.milestoneCompleted ? 'ACHIEVED' : 'IN PROGRESS'}]\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edufuture-roadmap-${profile.fullName.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. ROADMAP HERO HEADER */}
      <section id="roadmap-header" className="border-b border-slate-200 pb-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-1">
              Dynamic 5-Stage Architecture
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-slate-900">
              {profile.careerGoalTitle} Pathway
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Milestone-driven technical trajectory with hands-on GitHub projects and verified open courseware.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-adapt-roadmap-trigger"
              onClick={() => setIsAdaptModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-colors border border-emerald-600 shadow-sm flex items-center space-x-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Adapt Roadmap with AI</span>
            </button>

            <button
              id="btn-export-roadmap-trigger"
              onClick={() => setIsExportModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-slate-800 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-colors border border-slate-200 flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export & Share</span>
            </button>
          </div>

        </div>

        {/* Global Progress Bar */}
        <div className="p-4 border border-slate-200 rounded-sm bg-white space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Mastery Progress: {completedTopicsCount} of {allTopics.length} Topics Completed
            </span>
            <span className="font-mono text-emerald-600 font-bold text-xs">
              {overallProgress}% COMPLETE
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-sm overflow-hidden">
            <div 
              className="bg-slate-900 h-full rounded-sm transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Dynamic Adaptation Notice (if adapted) */}
        {roadmap.adaptationHistory && roadmap.adaptationHistory.length > 0 && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-sm flex items-start space-x-2 text-xs text-emerald-900">
            <History className="w-3.5 h-3.5 text-emerald-700 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block uppercase text-[10px] tracking-wider">Dynamic Adaptation Log ({new Date(roadmap.adaptationHistory[0].date).toLocaleDateString()}):</span>
              <span className="text-slate-800">{roadmap.adaptationHistory[0].changesSummary}</span>
            </div>
          </div>
        )}

      </section>

      {/* 2. STAGE BY STAGE TIMELINE (STAGES 1 TO 5) */}
      <section id="roadmap-stages-list" className="space-y-6">
        {roadmap.stages.map((stage) => {
          const isExpanded = expandedStages[stage.stageNumber] ?? false;
          const stageCompletedTopics = stage.topics.filter(t => t.completed).length;
          const isStageActive = stage.stageNumber === roadmap.currentStageNumber;

          return (
            <div 
              key={stage.id}
              id={`stage-card-${stage.stageNumber}`}
              className={`border rounded-sm transition-all overflow-hidden bg-white ${
                stage.milestoneCompleted
                  ? 'border-emerald-300'
                  : isStageActive
                  ? 'border-slate-900'
                  : 'border-slate-200'
              }`}
            >
              
              {/* Stage Header (Click to toggle) */}
              <div 
                onClick={() => toggleStageExpand(stage.stageNumber)}
                className="p-5 bg-slate-50/70 border-b border-slate-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    stage.milestoneCompleted
                      ? 'bg-emerald-600 text-white'
                      : isStageActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    0{stage.stageNumber}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                        {stage.title}
                      </h2>
                      <span className="text-xs text-slate-500 font-mono">
                        ({stage.estimatedWeeks} Weeks)
                      </span>
                      {stage.milestoneCompleted && (
                        <span className="bg-emerald-100 text-emerald-900 text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-sm border border-emerald-300">
                          Milestone Achieved
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{stage.tagline}</p>
                  </div>
                </div>

                {/* Right Status & Expand Chevron */}
                <div className="flex items-center space-x-4 self-end sm:self-center">
                  <div className="text-right text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {stageCompletedTopics}/{stage.topics.length} Topics
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {stage.topics.length > 0 ? Math.round((stageCompletedTopics / stage.topics.length) * 100) : 0}% DONE
                    </span>
                  </div>

                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Stage Body Content */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  
                  {/* Topics List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                      <span>Core Topics & Concepts Checklist</span>
                      <span className="text-slate-400 font-normal text-[10px]">Click box to toggle completion</span>
                    </div>

                    <div className="space-y-2">
                      {stage.topics.map((topic) => (
                        <div 
                          key={topic.id}
                          onClick={() => handleToggleTopic(stage.id, topic.id)}
                          className={`p-3.5 border rounded-sm cursor-pointer transition-all flex items-start space-x-3 ${
                            topic.completed
                              ? 'bg-emerald-50/40 border-emerald-300 text-slate-800'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <button
                            type="button"
                            className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${
                              topic.completed
                                ? 'bg-emerald-600 text-white'
                                : 'border border-slate-300 bg-white hover:border-slate-400'
                            }`}
                          >
                            {topic.completed && <Check className="w-3 h-3" />}
                          </button>

                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className={`text-xs font-bold uppercase tracking-wider ${
                                topic.completed ? 'text-emerald-950 line-through' : 'text-slate-900'
                              }`}>
                                {topic.title}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                                ~{topic.estimatedHours} Hours
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {topic.description}
                            </p>

                            <div className="flex flex-wrap gap-1 pt-1">
                              {topic.keyConcepts.map((concept, cIdx) => (
                                <span 
                                  key={cIdx}
                                  className="text-[9px] bg-slate-100 text-slate-700 font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-sm border border-slate-200"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hands-On Projects Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Hands-On Milestone Project Artifact</span>
                      </div>
                      <span className="text-emerald-700 font-mono text-[10px]">Verified Deliverable</span>
                    </div>

                    <div className="space-y-3">
                      {stage.projects.map((proj) => (
                        <div 
                          key={proj.id}
                          className="p-4 border border-slate-200 rounded-sm bg-slate-50/50 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">{proj.title}</span>
                              <span className="text-[9px] font-bold uppercase tracking-tighter bg-slate-200 text-slate-800 px-2 py-0.5 rounded-sm">
                                {proj.difficulty}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleProject(stage.id, proj.id)}
                              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-colors flex items-center space-x-1.5 ${
                                proj.completed
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <Check className={`w-3 h-3 ${proj.completed ? 'text-emerald-800' : 'text-slate-400'}`} />
                              <span>{proj.completed ? 'Completed' : 'Mark Done'}</span>
                            </button>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {proj.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                            <div className="bg-white p-3 rounded-sm border border-slate-200">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Deliverables:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                                {proj.deliverables.map((del, dIdx) => (
                                  <li key={dIdx}>{del}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white p-3 rounded-sm border border-slate-200">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Industry Value:</span>
                              <p className="text-slate-600 text-[11px] leading-relaxed">
                                {proj.industryRelevance}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Curated Resources & Milestone Box */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                    
                    {/* Free Learning Resources */}
                    <div className="border border-slate-200 rounded-sm p-4 space-y-2.5 bg-white">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Recommended Courseware</span>
                      </span>

                      <div className="space-y-1.5">
                        {stage.resources.map((res, rIdx) => (
                          <a 
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2.5 rounded-sm border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                                {res.title}
                              </span>
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-700" />
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {res.provider} • {res.isFree ? 'Free Access' : 'Reference'}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Stage Milestone Claim Card */}
                    <div className="bg-slate-900 text-white rounded-sm p-5 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                            Stage {stage.stageNumber} Milestone
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{stage.milestoneTitle}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {stage.milestoneDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => onOpenGuidance(`I'm working on Stage ${stage.stageNumber}: ${stage.title}. Can you explain key concepts?`)}
                          className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 hover:text-white"
                        >
                          Ask AI Mentor →
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleMilestone(stage.id)}
                          className={`text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-sm transition-colors border ${
                            stage.milestoneCompleted
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-900 border-white hover:bg-slate-100'
                          }`}
                        >
                          {stage.milestoneCompleted ? 'Milestone Achieved' : 'Claim Milestone'}
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>
          );
        })}
      </section>

      {/* 3. DYNAMIC ADAPTATION MODAL */}
      {isAdaptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-xl">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block">
                Closed-Loop Recalibration
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                Adapt Roadmap to Your Reality
              </h3>
              <p className="text-xs text-slate-600">
                &ldquo;The roadmap adapts to the learner, not the learner to a fixed roadmap.&rdquo; Specify your adjustment.
              </p>
            </div>

            {/* Quick Trigger Chips */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Common Adaptation Triggers:</span>
              <div className="flex flex-col space-y-1.5 text-xs">
                {[
                  'I mastered Stage 1 topics faster than expected. Accelerate into advanced topics.',
                  'I have 5 fewer hours per week due to exams. Adjust duration and ease pacing.',
                  'I struggled with mathematical foundations. Add more step-by-step scaffolding.',
                  'I want to specialize deeper in LLM Agents and RAG systems within this career track.'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAdaptationInput(chip)}
                    className="text-left p-2.5 rounded-sm border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-700 transition-colors"
                  >
                    &ldquo;{chip}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-700 block">
                Custom Adjustment Prompt:
              </label>
              <textarea
                rows={3}
                value={adaptationInput}
                onChange={(e) => setAdaptationInput(e.target.value)}
                placeholder="e.g. I completed Docker coursework, so replace container basics with Kubernetes and MLOps."
                className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdaptModalOpen(false)}
                disabled={isAdapting}
                className="px-4 py-2 rounded-sm text-[10px] uppercase font-bold tracking-widest text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleRunAdaptation()}
                disabled={isAdapting || !adaptationInput.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm transition-colors border border-emerald-600 flex items-center space-x-1.5"
              >
                {isAdapting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Recalibrating with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recalibrate Roadmap</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. EXPORT & SHARE MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Export Learning Roadmap</h3>
            <p className="text-xs text-slate-600">
              Export your structured 5-stage plan for personal tracking in Obsidian, Notion, GitHub, or printing.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleCopyMarkdown}
                className="w-full flex items-center justify-between p-3 rounded-sm border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center space-x-2">
                  <Copy className="w-4 h-4 text-emerald-600" />
                  <span>Copy Markdown to Clipboard</span>
                </div>
                {copied && <span className="text-emerald-600 font-bold">Copied!</span>}
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="w-full flex items-center justify-between p-3 rounded-sm border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Download .md File</span>
                </div>
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
