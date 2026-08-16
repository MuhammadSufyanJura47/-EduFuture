import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { StudentProfile, AssessmentResult, SkillGapItem } from '@/lib/types';
import careersData from '@/data/careers.json';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: StudentProfile = body.profile;

    if (!profile || !profile.careerGoalId) {
      return NextResponse.json(
        { error: 'Invalid profile data provided' },
        { status: 400 }
      );
    }

    const careerBenchmark = careersData.find((c) => c.id === profile.careerGoalId) || careersData[0];
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
You are the Lead AI Education & Skill Diagnostician for "中巴 EduFuture", an AI-powered future education platform connecting students with career readiness.

Analyze this student profile in depth:
- Name: ${profile.fullName}
- Education Level: ${profile.educationLevel}
- Major: ${profile.major}
- Current Year/Semester: ${profile.currentYearOrSemester}
- Career Goal: ${profile.careerGoalTitle} (${careerBenchmark.title})
- Available Weekly Hours: ${profile.weeklyAvailableHours} hours/week
- Prior Experience: ${profile.currentExperience}
- Interests: ${profile.interests.join(', ')}
- Current Skills: ${JSON.stringify(profile.currentSkills)}

Benchmark Requirements for ${careerBenchmark.title}:
${JSON.stringify(careerBenchmark.requiredCoreSkills)}

Target Career Context: ${careerBenchmark.description}
Pakistan-China & Global Industry Context: ${careerBenchmark.pkCnRelevance}

Diagnose the student's current skill readiness, critical gaps, strengths, potential pitfalls, and structured next steps.

Return ONLY a valid JSON object matching this exact schema:
{
  "readinessScore": <number between 15 and 90 representing % ready for entry-level/internship in target role>,
  "overallDiagnosis": "<2-3 insightful sentences summarizing their current standing and primary learning hurdle>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "potentialWeaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "skillGaps": [
    {
      "skillName": "<Skill name>",
      "category": "<Category>",
      "userLevel": <number 0-10>,
      "targetLevel": <number 1-10>,
      "gapScore": <targetLevel - userLevel>,
      "priority": "Critical" | "High" | "Medium" | "Foundational",
      "explanation": "<Why this gap matters in real-world engineering>",
      "recommendedFirstTopic": "<Specific practical starting concept>"
    }
  ],
  "keyRecommendations": ["<actionable recommendation 1>", "<actionable recommendation 2>", "<actionable recommendation 3>", "<actionable recommendation 4>"],
  "learningOrderRationale": "<Why the recommended sequence is logically ordered from foundational to applied>",
  "estimatedTimeToReadinessWeeks": <estimated realistic weeks based on weekly hours>
}
`;

      try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
            systemInstruction: 'You are a precise, encouraging, and authoritative educational diagnostician. Output strict JSON only.'
          }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);

        const result: AssessmentResult = {
          profileId: profile.id,
          careerGoal: profile.careerGoalTitle,
          readinessScore: parsed.readinessScore || 45,
          overallDiagnosis: parsed.overallDiagnosis || 'Diagnostic completed.',
          strengths: parsed.strengths || [],
          potentialWeaknesses: parsed.potentialWeaknesses || [],
          skillGaps: parsed.skillGaps || [],
          keyRecommendations: parsed.keyRecommendations || [],
          learningOrderRationale: parsed.learningOrderRationale || '',
          estimatedTimeToReadinessWeeks: parsed.estimatedTimeToReadinessWeeks || 16
        };

        return NextResponse.json(result);
      } catch (aiErr) {
        console.error('Gemini API diagnosis error, falling back to algorithmic diagnostic engine:', aiErr);
      }
    }

    // Algorithmic Fallback Engine
    const skillGaps: SkillGapItem[] = careerBenchmark.requiredCoreSkills.map((reqSkill) => {
      const userSkill = profile.currentSkills.find(
        (s) => s.name.toLowerCase() === reqSkill.name.toLowerCase()
      );
      const userLevel = userSkill ? userSkill.level : 1;
      const targetLevel = reqSkill.benchmarkedLevel;
      const gapScore = Math.max(0, targetLevel - userLevel);

      let priority: 'Critical' | 'High' | 'Medium' | 'Foundational' = 'Medium';
      if (gapScore >= 5) priority = 'Critical';
      else if (gapScore >= 3) priority = 'High';
      else if (gapScore <= 1) priority = 'Foundational';

      return {
        skillName: reqSkill.name,
        category: 'Core Competency',
        userLevel,
        targetLevel,
        gapScore,
        priority,
        explanation: `${reqSkill.name} is a benchmark requirement for ${careerBenchmark.title}. Bridging this ${gapScore}-point gap ensures readiness for professional workflows.`,
        recommendedFirstTopic: `Core concepts and practical projects in ${reqSkill.name}`
      };
    });

    const totalTarget = careerBenchmark.requiredCoreSkills.reduce((acc, s) => acc + s.benchmarkedLevel, 0);
    const totalUser = skillGaps.reduce((acc, s) => acc + Math.min(s.userLevel, s.targetLevel), 0);
    const readinessScore = Math.min(88, Math.max(20, Math.round((totalUser / totalTarget) * 100)));

    const result: AssessmentResult = {
      profileId: profile.id,
      careerGoal: profile.careerGoalTitle,
      readinessScore,
      overallDiagnosis: `You have established foundational competencies in ${profile.major}. To reach professional readiness as a ${careerBenchmark.title}, focused mastery in ${skillGaps.filter(g => g.priority === 'Critical').map(g => g.skillName).slice(0, 2).join(' and ') || 'advanced tools'} is essential.`,
      strengths: [
        `Demonstrated initiative in ${profile.major} studies`,
        `Commitment of ${profile.weeklyAvailableHours} dedicated hours per week`,
        `Baseline experience: ${profile.currentExperience || 'Academic projects'}`
      ],
      potentialWeaknesses: [
        'Need deeper hands-on project artifacts for production portfolio',
        'Gap in containerized deployment and automated evaluation pipelines',
        'Practical integration of industry-standard toolchains'
      ],
      skillGaps,
      keyRecommendations: [
        `Focus immediately on top critical gaps: ${skillGaps.filter(g => g.priority === 'Critical').map(g => g.skillName).join(', ') || 'Core tools'}`,
        'Build and document modular GitHub projects for each mastered concept',
        'Dedicate 2 hours per week to reviewing real-world open-source repositories',
        'Align portfolio with cross-border high-demand tech sectors'
      ],
      learningOrderRationale: 'Foundational programming and algorithmic paradigms must precede complex system integration to prevent technical debt.',
      estimatedTimeToReadinessWeeks: Math.max(8, Math.round((200 / (profile.weeklyAvailableHours || 10))))
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Assessment API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process assessment' },
      { status: 500 }
    );
  }
}
