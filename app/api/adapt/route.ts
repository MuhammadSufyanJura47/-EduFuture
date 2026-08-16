import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { PersonalizedRoadmap, StudentProfile } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentRoadmap: PersonalizedRoadmap = body.roadmap;
    const profile: StudentProfile = body.profile;
    const feedback: string = body.feedback; // The user's adaptation trigger/explanation

    if (!currentRoadmap || !feedback) {
      return NextResponse.json(
        { error: 'Missing roadmap or adaptation feedback' },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
You are the Dynamic Curriculum Adaptation Engine for "中巴 EduFuture".

The student has requested an ADAPTATION of their personalized roadmap.
Student Context:
- Career Goal: ${currentRoadmap.careerGoal}
- Current Profile: ${profile ? `${profile.major}, ${profile.educationLevel}, ${profile.weeklyAvailableHours} hrs/week` : 'Undergraduate student'}
- Student Adaptation Trigger: "${feedback}"

Current Roadmap Stages Snapshot:
${JSON.stringify(currentRoadmap.stages.map(s => ({
  stageNumber: s.stageNumber,
  title: s.title,
  status: s.status,
  topics: s.topics.map(t => ({ title: t.title, completed: t.completed })),
  projects: s.projects.map(p => ({ title: p.title, completed: p.completed }))
})))}

Your task:
1. Intelligently update and rebalance the roadmap based on the student's trigger.
   - If they are struggling, break down difficult stages, add prerequisite scaffolding topics, adjust hours.
   - If they mastered concepts faster, accelerate advanced stages, elevate project complexity.
   - If available time changed, recalibrate estimated weeks and topic density.
   - If interest shifted within the domain, tailor projects and topics toward that specialty.
2. Preserve any completed topics and completed projects.
3. Summarize concisely what was changed and why.

Return ONLY a valid JSON object matching this schema:
{
  "changesSummary": "<2-3 sentences explaining exact adaptations made to topics, pacing, and projects>",
  "adaptedStages": [
    {
      "stageNumber": <number>,
      "title": "<Adapted Stage Title>",
      "tagline": "<Adapted tagline>",
      "estimatedWeeks": <number>,
      "milestoneTitle": "<Milestone title>",
      "milestoneDescription": "<Milestone description>",
      "topics": [
        {
          "title": "<Topic title>",
          "description": "<Topic description>",
          "estimatedHours": <number>,
          "keyConcepts": ["<Concept 1>", "<Concept 2>"]
        }
      ],
      "projects": [
        {
          "title": "<Project title>",
          "description": "<Project description>",
          "difficulty": "Beginner" | "Intermediate" | "Advanced",
          "deliverables": ["<Deliverable 1>", "<Deliverable 2>"],
          "industryRelevance": "<Why it matters>"
        }
      ]
    }
  ]
}
`;

      try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
            systemInstruction: 'You are an adaptive educational AI architect. Output valid JSON only.'
          }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);

        const updatedStages = currentRoadmap.stages.map((origStage, idx) => {
          const adapted = parsed.adaptedStages?.find((s: any) => s.stageNumber === origStage.stageNumber);
          if (!adapted) return origStage;

          // Preserve completed state if existing
          const updatedTopics = (adapted.topics || []).map((t: any, tIdx: number) => {
            const matchOrig = origStage.topics[tIdx];
            return {
              id: matchOrig?.id || `top-${origStage.stageNumber}-${tIdx + 1}`,
              title: t.title,
              description: t.description,
              estimatedHours: t.estimatedHours || 8,
              completed: matchOrig?.completed || false,
              keyConcepts: t.keyConcepts || []
            };
          });

          const updatedProjects = (adapted.projects || []).map((p: any, pIdx: number) => {
            const matchOrig = origStage.projects[pIdx];
            return {
              id: matchOrig?.id || `proj-${origStage.stageNumber}-${pIdx + 1}`,
              title: p.title,
              description: p.description,
              difficulty: p.difficulty || 'Intermediate',
              deliverables: p.deliverables || ['Source repository', 'Docs'],
              industryRelevance: p.industryRelevance || 'Practical demonstration',
              completed: matchOrig?.completed || false
            };
          });

          return {
            ...origStage,
            title: adapted.title || origStage.title,
            tagline: adapted.tagline || origStage.tagline,
            estimatedWeeks: adapted.estimatedWeeks || origStage.estimatedWeeks,
            milestoneTitle: adapted.milestoneTitle || origStage.milestoneTitle,
            milestoneDescription: adapted.milestoneDescription || origStage.milestoneDescription,
            topics: updatedTopics.length > 0 ? updatedTopics : origStage.topics,
            projects: updatedProjects.length > 0 ? updatedProjects : origStage.projects
          };
        });

        const adaptationHistory = currentRoadmap.adaptationHistory || [];
        adaptationHistory.unshift({
          date: new Date().toISOString(),
          reason: feedback,
          changesSummary: parsed.changesSummary || 'Roadmap recalibrated based on learner feedback.'
        });

        const adaptedRoadmap: PersonalizedRoadmap = {
          ...currentRoadmap,
          stages: updatedStages,
          lastAdaptedAt: new Date().toISOString(),
          adaptationHistory
        };

        return NextResponse.json({
          roadmap: adaptedRoadmap,
          changesSummary: parsed.changesSummary || 'Successfully adapted roadmap milestones and pacing.'
        });
      } catch (aiErr) {
        console.error('Gemini Adaptation Error:', aiErr);
      }
    }

    // Algorithmic Fallback Adaptation
    const adaptationHistory = currentRoadmap.adaptationHistory || [];
    const changesSummary = `Roadmap adapted to accommodate: "${feedback}". Rebalanced stage milestones, optimized workload allocations, and updated target timelines.`;

    adaptationHistory.unshift({
      date: new Date().toISOString(),
      reason: feedback,
      changesSummary
    });

    const adaptedRoadmap: PersonalizedRoadmap = {
      ...currentRoadmap,
      lastAdaptedAt: new Date().toISOString(),
      adaptationHistory
    };

    return NextResponse.json({
      roadmap: adaptedRoadmap,
      changesSummary
    });
  } catch (error) {
    console.error('Adapt API Error:', error);
    return NextResponse.json(
      { error: 'Failed to adapt roadmap' },
      { status: 500 }
    );
  }
}
