import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { StudentProfile, PersonalizedRoadmap, AssessmentResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, profile, roadmap, assessment, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    if (ai) {
      const activeStage = roadmap?.stages?.find(
        (s: any) => s.stageNumber === (roadmap?.currentStageNumber || 1)
      ) || roadmap?.stages?.[0];

      const systemPrompt = `
You are the Senior Educational AI Mentor & Future Skills Advisor for "中巴 EduFuture" (中巴未来教育平台).
Your mission is to provide structured, empowering, and pragmatic advice to students navigating their future academic and career trajectories.

Student Context:
- Name: ${profile?.fullName || 'Student'}
- Academic Background: ${profile?.major || 'Computer Science'}, ${profile?.educationLevel || 'Undergraduate'} (${profile?.institution || 'University'})
- Career Goal: ${profile?.careerGoalTitle || roadmap?.careerGoal || 'AI & Software Engineer'}
- Weekly Dedicated Study: ${profile?.weeklyAvailableHours || 10} hours/week
- Readiness Score: ${assessment?.readinessScore ? `${assessment.readinessScore}%` : 'In Progress'}
- Critical Gaps: ${assessment?.skillGaps?.filter((g: any) => g.priority === 'Critical').map((g: any) => g.skillName).join(', ') || 'Core tools'}
- Current Active Roadmap Stage: Stage ${activeStage?.stageNumber || 1} - ${activeStage?.title || 'Foundations'}
- Active Milestone: ${activeStage?.milestoneTitle || 'Foundational Milestone'}

Guidelines:
1. Provide structured, actionable, and mathematically/technically sound advice (use clear bullet points, code snippets or step-by-step logic where helpful).
2. Ground your advice in the student's actual current stage, available hours, and critical gaps.
3. Be encouraging, intellectually rigorous, and forward-looking (touching on global and Pakistan-China tech ecosystem opportunities where relevant).
4. Suggest 2-3 short, relevant follow-up action prompts at the end.
`;

      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        // Map prior turns
        for (const h of history.slice(-6)) {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.4
          }
        });

        const reply = response.text || 'I am ready to help guide your learning pathway.';
        
        // Generate smart suggestion chips
        const defaultSuggestions = [
          'How do I test my understanding for this stage?',
          'Break down the stage project into weekly milestones',
          'What are the best open-source resources for this gap?'
        ];

        return NextResponse.json({
          reply,
          suggestions: defaultSuggestions
        });
      } catch (aiErr) {
        console.error('Gemini Guidance Error, falling back to local guidance mentor:', aiErr);
      }
    }

    // Algorithmic Fallback Guidance
    const fallbackResponses: { [key: string]: string } = {
      default: `### Guidance for ${profile?.careerGoalTitle || 'Your Future Tech Career'}

Based on your current profile and Stage ${roadmap?.currentStageNumber || 1} objectives:

1. **Focus on Hands-on Implementation**: Focus 70% of your ${profile?.weeklyAvailableHours || 10} weekly hours on writing code and building project deliverables rather than passive tutorial viewing.
2. **Bridge Your Critical Gap First**: Allocate your primary sprint to mastering foundational concepts before moving to high-level frameworks.
3. **Verify Each Milestone**: Document each stage project on GitHub with clear README diagrams and setup steps.

*Would you like me to break down your active stage project into weekly tasks or explain a specific core concept?*`
    };

    return NextResponse.json({
      reply: fallbackResponses.default,
      suggestions: [
        'Break down my current stage project',
        'How do I prepare for technical interviews in this role?',
        'How does this skill connect to international tech opportunities?'
      ]
    });
  } catch (error) {
    console.error('Guidance API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate guidance' },
      { status: 500 }
    );
  }
}
