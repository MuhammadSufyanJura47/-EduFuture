import { StudentProfile, AssessmentResult, PersonalizedRoadmap, GuidanceMessage } from './types';
import { SAMPLE_PROFILES } from './sample-data';

const STORAGE_KEYS = {
  PROFILE: 'edufuture_profile_v1',
  ASSESSMENT: 'edufuture_assessment_v1',
  ROADMAP: 'edufuture_roadmap_v1',
  GUIDANCE_MESSAGES: 'edufuture_guidance_messages_v1',
  ACTIVE_TAB: 'edufuture_active_tab_v1'
};

export const storage = {
  getProfile(): StudentProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to read profile from localStorage', e);
    }
    return null;
  },

  saveProfile(profile: StudentProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  },

  getAssessment(): AssessmentResult | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to read assessment from localStorage', e);
    }
    return null;
  },

  saveAssessment(assessment: AssessmentResult): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(assessment));
    } catch (e) {
      console.warn('Failed to save assessment to localStorage', e);
    }
  },

  getRoadmap(): PersonalizedRoadmap | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROADMAP);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to read roadmap from localStorage', e);
    }
    return null;
  },

  saveRoadmap(roadmap: PersonalizedRoadmap): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
    } catch (e) {
      console.warn('Failed to save roadmap to localStorage', e);
    }
  },

  getGuidanceMessages(): GuidanceMessage[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GUIDANCE_MESSAGES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to read guidance messages', e);
    }
    return [];
  },

  saveGuidanceMessages(messages: GuidanceMessage[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.GUIDANCE_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save guidance messages', e);
    }
  },

  loadSampleProfile(sampleKey = 'ahmed-ai') {
    const sample = SAMPLE_PROFILES[sampleKey] || SAMPLE_PROFILES['ahmed-ai'];
    if (!sample) return null;
    this.saveProfile(sample.profile);
    this.saveAssessment(sample.assessment);
    this.saveRoadmap(sample.roadmap);
    return sample;
  },

  clearAllData(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT);
      localStorage.removeItem(STORAGE_KEYS.ROADMAP);
      localStorage.removeItem(STORAGE_KEYS.GUIDANCE_MESSAGES);
    } catch (e) {
      console.warn('Failed to clear localStorage', e);
    }
  },

  clearAll(): void {
    this.clearAllData();
  }
};
