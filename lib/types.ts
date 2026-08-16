export type EducationLevel = 
  | 'High School'
  | 'Undergraduate (1st/2nd Year)'
  | 'Undergraduate (3rd/4th Year)'
  | 'Master\'s / Postgrad'
  | 'Fresh Graduate'
  | 'Self-Taught / Career Switcher';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';

export interface UserSkill {
  name: string;
  category: string;
  level: number; // 1 to 10
  proficiency: SkillProficiency;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email?: string;
  educationLevel: EducationLevel;
  major: string;
  institution?: string;
  currentYearOrSemester: string;
  careerGoalId: string;
  careerGoalTitle: string;
  currentSkills: UserSkill[];
  interests: string[];
  currentExperience: string; // e.g., 'Completed course projects, built a basic web app'
  weeklyAvailableHours: number; // e.g., 10
  preferredLanguage?: 'English' | 'Chinese' | 'Urdu';
  createdAt: string;
  updatedAt: string;
}

export interface SkillGapItem {
  skillName: string;
  category: string;
  userLevel: number; // 0 to 10
  targetLevel: number; // 1 to 10
  gapScore: number; // target - user
  priority: 'Critical' | 'High' | 'Medium' | 'Foundational';
  explanation: string;
  recommendedFirstTopic: string;
}

export interface AssessmentResult {
  profileId: string;
  careerGoal: string;
  readinessScore: number; // 0 - 100%
  overallDiagnosis: string;
  strengths: string[];
  potentialWeaknesses: string[];
  skillGaps: SkillGapItem[];
  keyRecommendations: string[];
  learningOrderRationale: string;
  estimatedTimeToReadinessWeeks: number;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: 'Course' | 'Documentation' | 'Book' | 'Interactive' | 'Project Spec';
  isFree: boolean;
  provider: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  completed: boolean;
  keyConcepts: string[];
}

export interface RoadmapProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  deliverables: string[];
  industryRelevance: string;
  completed: boolean;
}

export interface RoadmapStage {
  id: string;
  stageNumber: number;
  title: string;
  tagline: string;
  estimatedWeeks: number;
  status: 'locked' | 'in-progress' | 'completed';
  topics: RoadmapTopic[];
  projects: RoadmapProject[];
  resources: ResourceLink[];
  milestoneTitle: string;
  milestoneDescription: string;
  milestoneCompleted: boolean;
}

export interface PersonalizedRoadmap {
  id: string;
  profileId: string;
  careerGoal: string;
  totalStages: number;
  currentStageNumber: number;
  overallProgressPercent: number;
  estimatedTotalHours: number;
  stages: RoadmapStage[];
  lastAdaptedAt?: string;
  adaptationHistory?: {
    date: string;
    reason: string;
    changesSummary: string;
  }[];
}

export interface CareerPath {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  marketDemand: 'Very High' | 'High' | 'Moderate';
  avgSalaryRange: string;
  pkCnRelevance: string; // Specific value in Pak-China tech corridors & global industry
  requiredCoreSkills: {
    name: string;
    benchmarkedLevel: number; // 1-10
    importance: 'Essential' | 'Important' | 'Nice to have';
  }[];
  futureTrends: string[];
  popularJobTitles: string[];
}

export interface GuidanceMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestions?: string[];
}
