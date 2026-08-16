'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  Clock, 
  BookOpen, 
  Plus, 
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  StudentProfile, 
  EducationLevel, 
  UserSkill, 
  SkillProficiency, 
  AssessmentResult, 
  PersonalizedRoadmap 
} from '@/lib/types';
import careersData from '@/data/careers.json';
import skillsData from '@/data/skills.json';
import { storage } from '@/lib/storage';

interface AssessmentWizardProps {
  existingProfile?: StudentProfile | null;
  onComplete: (profile: StudentProfile, assessment: AssessmentResult, roadmap: PersonalizedRoadmap) => void;
  onCancel?: () => void;
}

const EDUCATION_LEVELS: EducationLevel[] = [
  'Undergraduate (1st/2nd Year)',
  'Undergraduate (3rd/4th Year)',
  'Fresh Graduate',
  'Master\'s / Postgrad',
  'High School',
  'Self-Taught / Career Switcher'
];

const COMMON_MAJORS = [
  'Computer Science',
  'Software Engineering',
  'Artificial Intelligence & Data Science',
  'Electrical & Computer Engineering',
  'Information Technology',
  'Data Science & Analytics',
  'Cybersecurity & Network Systems',
  'Business Analytics / Management Science'
];

const POPULAR_INTERESTS = [
  'Generative AI & LLMs',
  'Computer Vision & Robotics',
  'Full-Stack Cloud Systems',
  'Autonomous Agents & RAG',
  'Cybersecurity & Cryptography',
  'Embedded IoT & TinyML',
  'Distributed Backend Architecture',
  'Pak-China Tech Corridors & CPEC'
];

const DEFAULT_POPULAR_SKILLS = [
  { name: 'Python & NumPy', category: 'Core Computer Science', defaultLevel: 6 },
  { name: 'TypeScript & Modern JS', category: 'Core Computer Science', defaultLevel: 5 },
  { name: 'Data Structures & Algorithms', category: 'Core Computer Science', defaultLevel: 5 },
  { name: 'Linear Algebra & Calculus', category: 'Artificial Intelligence & Data', defaultLevel: 5 },
  { name: 'C / Modern C++', category: 'Core Computer Science', defaultLevel: 4 },
  { name: 'PyTorch / TensorFlow', category: 'Artificial Intelligence & Data', defaultLevel: 3 },
  { name: 'React / Next.js / Vue', category: 'Web & Software Architecture', defaultLevel: 4 },
  { name: 'Docker & Containerization', category: 'DevOps, Security & Cloud', defaultLevel: 2 },
  { name: 'Operating Systems & Linux', category: 'Core Computer Science', defaultLevel: 4 }
];

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({
  existingProfile,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState<string>(existingProfile?.fullName || '');
  const [email, setEmail] = useState<string>(existingProfile?.email || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    existingProfile?.educationLevel || 'Undergraduate (3rd/4th Year)'
  );
  const [major, setMajor] = useState<string>(existingProfile?.major || 'Computer Science');
  const [institution, setInstitution] = useState<string>(existingProfile?.institution || '');
  const [currentSemester, setCurrentSemester] = useState<string>(
    existingProfile?.currentYearOrSemester || '6th Semester (Year 3)'
  );
  const [careerGoalId, setCareerGoalId] = useState<string>(
    existingProfile?.careerGoalId || 'ai-engineer'
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    existingProfile?.interests || ['Generative AI & LLMs', 'Full-Stack Cloud Systems']
  );
  const [currentExperience, setCurrentExperience] = useState<string>(
    existingProfile?.currentExperience || 'Built academic coursework projects, completed programming labs, and basic web apps.'
  );
  const [weeklyHours, setWeeklyHours] = useState<number>(
    existingProfile?.weeklyAvailableHours || 12
  );

  // Skills State
  const [userSkills, setUserSkills] = useState<UserSkill[]>(
    existingProfile?.currentSkills || [
      { name: 'Python & NumPy', category: 'Core Computer Science', level: 6, proficiency: 'Intermediate' },
      { name: 'Data Structures & Algorithms', category: 'Core Computer Science', level: 5, proficiency: 'Intermediate' },
      { name: 'Linear Algebra & Calculus', category: 'Artificial Intelligence & Data', level: 5, proficiency: 'Intermediate' },
      { name: 'PyTorch / TensorFlow', category: 'Artificial Intelligence & Data', level: 3, proficiency: 'Beginner' }
    ]
  );

  const [customSkillName, setCustomSkillName] = useState<string>('');

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleUpdateSkillLevel = (skillName: string, newLevel: number) => {
    setUserSkills(prev => prev.map(s => {
      if (s.name === skillName) {
        let proficiency: SkillProficiency = 'Beginner';
        if (newLevel >= 8) proficiency = 'Advanced';
        else if (newLevel >= 5) proficiency = 'Intermediate';
        else if (newLevel >= 9) proficiency = 'Master';
        return { ...s, level: newLevel, proficiency };
      }
      return s;
    }));
  };

  const handleAddPopularSkill = (skillItem: typeof DEFAULT_POPULAR_SKILLS[0]) => {
    if (userSkills.some(s => s.name === skillItem.name)) return;
    const newSkill: UserSkill = {
      name: skillItem.name,
      category: skillItem.category,
      level: skillItem.defaultLevel,
      proficiency: skillItem.defaultLevel >= 5 ? 'Intermediate' : 'Beginner'
    };
    setUserSkills([...userSkills, newSkill]);
  };

  const handleAddCustomSkill = () => {
    if (!customSkillName.trim()) return;
    if (userSkills.some(s => s.name.toLowerCase() === customSkillName.trim().toLowerCase())) {
      setCustomSkillName('');
      return;
    }
    const newSkill: UserSkill = {
      name: customSkillName.trim(),
      category: 'Specialized Skill',
      level: 4,
      proficiency: 'Beginner'
    };
    setUserSkills([...userSkills, newSkill]);
    setCustomSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setUserSkills(userSkills.filter(s => s.name !== skillName));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your name.');
        return;
      }
      if (!major.trim()) {
        setErrorMessage('Please enter your major/program.');
        return;
      }
      setErrorMessage(null);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (userSkills.length === 0) {
        setErrorMessage('Please include at least one skill you currently know or have studied.');
        return;
      }
      setErrorMessage(null);
      setCurrentStep(3);
    }
  };

  const handleSubmitAssessment = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStatus('Synthesizing student profile...');

    const targetCareer = careersData.find(c => c.id === careerGoalId) || careersData[0];

    const profile: StudentProfile = {
      id: existingProfile?.id || `student-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      educationLevel,
      major: major.trim(),
      institution: institution.trim() || 'University',
      currentYearOrSemester: currentSemester.trim(),
      careerGoalId,
      careerGoalTitle: targetCareer.title,
      currentSkills: userSkills,
      interests: selectedInterests.length > 0 ? selectedInterests : ['AI & Software Systems'],
      currentExperience: currentExperience.trim(),
      weeklyAvailableHours: weeklyHours,
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      setLoadingStatus('Diagnosing mathematical skill gaps with Gemini AI...');
      
      const assessRes = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      if (!assessRes.ok) {
        throw new Error('Failed to run AI skill gap diagnosis');
      }

      const assessmentResult: AssessmentResult = await assessRes.json();

      setLoadingStatus('Generating 5-Stage Adaptive Roadmap...');

      const roadmapRes = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, assessment: assessmentResult })
      });

      if (!roadmapRes.ok) {
        throw new Error('Failed to generate personalized roadmap');
      }

      const roadmapResult: PersonalizedRoadmap = await roadmapRes.json();

      // Persist in local storage
      storage.saveProfile(profile);
      storage.saveAssessment(assessmentResult);
      storage.saveRoadmap(roadmapResult);

      setLoadingStatus('Finalizing your personal future education dashboard...');
      
      setTimeout(() => {
        setIsLoading(false);
        onComplete(profile, assessmentResult, roadmapResult);
      }, 500);

    } catch (err: any) {
      console.error('Assessment Submission Error:', err);
      setIsLoading(false);
      setErrorMessage('We encountered an issue generating your roadmap. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      
      {/* Container Card (Editorial Layout) */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header & Step Indicator */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 block mb-1">
                Diagnostic Intake
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                Personalized Learning Profile
              </h1>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400">
              <span>STEP 0{currentStep} / 03</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, label: '01. Academic Context' },
              { num: 2, label: '02. Skills Self-Check' },
              { num: 3, label: '03. Target Career Goal' }
            ].map(step => (
              <div key={step.num} className="space-y-1">
                <div className={`h-1 rounded-sm transition-colors ${
                  currentStep >= step.num ? 'bg-slate-900' : 'bg-slate-200'
                }`} />
                <span className={`text-[10px] uppercase font-bold tracking-wider block truncate ${
                  currentStep === step.num ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-sm text-xs flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block uppercase tracking-wider text-[10px]">Input Notice</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* LOADING OVERLAY */}
        {isLoading ? (
          <div className="py-16 text-center space-y-6">
            <div className="inline-flex p-4 bg-slate-50 border border-slate-200 rounded-sm">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                {loadingStatus || 'Processing with Gemini AI...'}
              </h2>
              <p className="text-xs text-slate-500">
                Our agent is benchmarking your skills, computing priority matrices, and structuring 5 learning stages tailored to your {weeklyHours}h weekly commitment.
              </p>
            </div>
          </div>
        ) : (
          <div>
            
            {/* STEP 1: ACADEMIC CONTEXT */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">Academic Background</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calibrates baseline expectations and prerequisites against international standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ahmed Raza / Fatima Ali"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    />
                  </div>

                  {/* Email (Optional) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="input-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. student@example.com"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    />
                  </div>

                  {/* Education Level */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      Education Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="select-education-level"
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    >
                      {EDUCATION_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Major / Degree Program */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      Major / Degree Program <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-major"
                      type="text"
                      list="major-suggestions"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="e.g. Computer Science / Software Engineering"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    />
                    <datalist id="major-suggestions">
                      {COMMON_MAJORS.map(m => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </div>

                  {/* Current Semester / Year */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      Current Semester / Stage
                    </label>
                    <input
                      id="input-semester"
                      type="text"
                      value={currentSemester}
                      onChange={(e) => setCurrentSemester(e.target.value)}
                      placeholder="e.g. 5th Semester / Year 3 / Graduated 2025"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    />
                  </div>

                  {/* Institution / University */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      University / Institution <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="input-institution"
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. NUST / FAST / Tsinghua / Punjab University"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    />
                  </div>

                </div>

                {/* Available Weekly Study Time */}
                <div className="border border-slate-200 rounded-sm p-4 sm:p-5 space-y-3 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-900">
                        Available Weekly Self-Study Hours:
                      </label>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-sm border border-slate-200">
                      {weeklyHours} HOURS / WEEK
                    </span>
                  </div>

                  <input
                    id="range-weekly-hours"
                    type="range"
                    min={4}
                    max={35}
                    step={1}
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                    className="w-full accent-slate-900"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>4 hrs (Casual)</span>
                    <span>12 hrs (Balanced Pace)</span>
                    <span>25+ hrs (Intensive Pace)</span>
                  </div>
                </div>

                {/* Prior Practical Experience */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                    Summary of Prior Projects / Work Experience
                  </label>
                  <textarea
                    id="textarea-prior-experience"
                    rows={3}
                    value={currentExperience}
                    onChange={(e) => setCurrentExperience(e.target.value)}
                    placeholder="Briefly describe what code or projects you have built so far (e.g. course labs, semester project, freelance website, basic machine learning homework, or complete beginner)."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

              </div>
            )}

            {/* STEP 2: SKILL SELF-CHECK */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">Technical Skills Self-Evaluation</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rate confidence from 1 (Novice) to 10 (Expert) to enable exact mathematical gap detection.
                  </p>
                </div>

                {/* Added Skills List */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                    Current Skill Inventory ({userSkills.length})
                  </span>

                  <div className="space-y-2">
                    {userSkills.map((skill) => (
                      <div 
                        key={skill.name}
                        className="border border-slate-200 bg-slate-50/50 rounded-sm p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-900">{skill.name}</span>
                            <span className="text-[9px] bg-slate-200 text-slate-800 font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-sm">
                              {skill.proficiency}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">{skill.category}</span>
                        </div>

                        {/* Slider and Level */}
                        <div className="flex items-center space-x-3 w-full sm:w-64">
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={skill.level}
                            onChange={(e) => handleUpdateSkillLevel(skill.name, parseInt(e.target.value))}
                            className="w-full accent-slate-900"
                          />
                          <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded-sm border border-slate-300 min-w-[40px] text-center text-slate-900">
                            {skill.level}/10
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill.name)}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Add Popular Skills */}
                <div className="border border-slate-200 rounded-sm p-4 space-y-2 bg-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                    Quick-add common skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {DEFAULT_POPULAR_SKILLS.filter(ps => !userSkills.some(us => us.name === ps.name)).map(ps => (
                      <button
                        key={ps.name}
                        type="button"
                        onClick={() => handleAddPopularSkill(ps)}
                        className="text-xs bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-medium px-2.5 py-1 rounded-sm border border-slate-200 hover:border-emerald-300 transition-colors flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3 text-emerald-600" />
                        <span>{ps.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Custom Skill */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customSkillName}
                    onChange={(e) => setCustomSkillName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSkill())}
                    placeholder="Add any other skill (e.g. Golang, Flutter, SQL, Kubernetes)..."
                    className="flex-1 px-3.5 py-2 border border-slate-300 rounded-sm text-xs focus:outline-none focus:border-emerald-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm transition-colors"
                  >
                    Add Skill
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: CAREER GOAL & INTERESTS */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">Target Career Direction</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    The AI will benchmark your profile against this benchmark role and generate your tailored 5-stage roadmap.
                  </p>
                </div>

                {/* Career Cards Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {careersData.map((career) => {
                    const isSelected = careerGoalId === career.id;
                    return (
                      <div
                        key={career.id}
                        id={`career-option-${career.id}`}
                        onClick={() => setCareerGoalId(career.id)}
                        className={`p-4 rounded-sm border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-slate-900 ring-1 ring-slate-900'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{career.category}</span>
                            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-tight">{career.title}</h3>
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-sm border border-slate-300 flex-shrink-0" />
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {career.tagline}
                        </p>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-emerald-700 font-mono font-bold">{career.marketDemand} Demand</span>
                          <span className="text-slate-400">{career.requiredCoreSkills.length} Benchmarks</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Areas of Interest Tags */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                    Specializations & Focus Areas:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_INTERESTS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleToggleInterest(interest)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-sm border transition-colors ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* WIZARD NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  id="btn-wizard-prev"
                  onClick={() => { setErrorMessage(null); setCurrentStep(currentStep - 1); }}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm border border-slate-200 transition-colors flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div>
                  {onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700"
                    >
                      Cancel & Return
                    </button>
                  )}
                </div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  id="btn-wizard-next"
                  onClick={handleNext}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm transition-colors border border-slate-900 flex items-center space-x-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-wizard-submit"
                  onClick={handleSubmitAssessment}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-sm transition-colors border border-emerald-600 flex items-center space-x-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run AI Diagnosis & Synthesize Roadmap</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
