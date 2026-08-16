import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { StudentProfile, AssessmentResult, PersonalizedRoadmap, RoadmapStage } from '@/lib/types';
import careersData from '@/data/careers.json';
import resourcesData from '@/data/resources.json';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: StudentProfile = body.profile;
    const assessment: AssessmentResult = body.assessment;

    if (!profile || !profile.careerGoalId) {
      return NextResponse.json(
        { error: 'Invalid profile data provided' },
        { status: 400 }
      );
    }

    const career = careersData.find((c) => c.id === profile.careerGoalId) || careersData[0];
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
You are the Lead Curriculum Architect for "中巴 EduFuture".

Generate a comprehensive, tailored 5-Stage Personalized Learning Roadmap for this student:
- Name: ${profile.fullName}
- Major: ${profile.major} (${profile.educationLevel})
- Target Career: ${profile.careerGoalTitle} (${career.title})
- Available Study Time: ${profile.weeklyAvailableHours} hours/week
- Prior Experience: ${profile.currentExperience}
- Critical Skill Gaps: ${JSON.stringify(assessment?.skillGaps?.filter(g => g.priority === 'Critical' || g.priority === 'High') || [])}
- Strengths: ${JSON.stringify(assessment?.strengths || [])}

Requirements:
1. Return 5 progressive stages from Foundational to Applied, Agentic/Advanced, Production MLOps/Architecture, and Capstone/Internship Readiness.
2. Each stage must have 2-3 specific topics (with title, description, estimatedHours, keyConcepts array).
3. Each stage must have 1 high-impact project with real industry relevance and concrete deliverables.
4. Each stage must have 1-2 curated free/open resource links.
5. Provide an inspiring milestone title and description.

Return ONLY a valid JSON object matching this schema:
{
  "totalStages": 5,
  "estimatedTotalHours": <number>,
  "stages": [
    {
      "stageNumber": 1,
      "title": "<Stage Title>",
      "tagline": "<Short 1-sentence tagline>",
      "estimatedWeeks": <number based on weekly hours>,
      "milestoneTitle": "<Milestone Title>",
      "milestoneDescription": "<What student achieves>",
      "topics": [
        {
          "title": "<Topic Title>",
          "description": "<Concise explanation of what to learn>",
          "estimatedHours": <number>,
          "keyConcepts": ["<Concept 1>", "<Concept 2>", "<Concept 3>"]
        }
      ],
      "projects": [
        {
          "title": "<Project Title>",
          "description": "<Detailed project description>",
          "difficulty": "Beginner" | "Intermediate" | "Advanced",
          "deliverables": ["<Deliverable 1>", "<Deliverable 2>"],
          "industryRelevance": "<Why this proves readiness to employers>"
        }
      ],
      "resources": [
        {
          "title": "<Resource Title>",
          "url": "<URL string>",
          "type": "Course" | "Documentation" | "Book" | "Interactive",
          "isFree": true,
          "provider": "<Provider name>"
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
            systemInstruction: 'You are an elite computer science educator and career mentor. Output valid JSON only.'
          }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);

        const stages: RoadmapStage[] = (parsed.stages || []).map((st: any, idx: number) => ({
          id: `stage-${idx + 1}-${Date.now()}`,
          stageNumber: idx + 1,
          title: st.title || `Stage ${idx + 1}`,
          tagline: st.tagline || 'Core capability development',
          estimatedWeeks: st.estimatedWeeks || 3,
          status: idx === 0 ? 'in-progress' : 'locked',
          milestoneTitle: st.milestoneTitle || `Stage ${idx + 1} Milestone`,
          milestoneDescription: st.milestoneDescription || 'Mastery of stage topics.',
          milestoneCompleted: false,
          topics: (st.topics || []).map((top: any, tIdx: number) => ({
            id: `top-${idx + 1}-${tIdx + 1}`,
            title: top.title,
            description: top.description,
            estimatedHours: top.estimatedHours || 8,
            completed: false,
            keyConcepts: top.keyConcepts || []
          })),
          projects: (st.projects || []).map((proj: any, pIdx: number) => ({
            id: `proj-${idx + 1}-${pIdx + 1}`,
            title: proj.title,
            description: proj.description,
            difficulty: proj.difficulty || 'Intermediate',
            deliverables: proj.deliverables || ['Source code repo', 'Technical documentation'],
            industryRelevance: proj.industryRelevance || 'Demonstrates applied mastery.',
            completed: false
          })),
          resources: (st.resources && st.resources.length > 0) ? st.resources : [
            {
              title: `${career.title} Foundational Guide`,
              url: 'https://roadmap.sh',
              type: 'Interactive',
              isFree: true,
              provider: 'roadmap.sh'
            }
          ]
        }));

        const personalizedRoadmap: PersonalizedRoadmap = {
          id: `roadmap-${profile.id}-${Date.now()}`,
          profileId: profile.id,
          careerGoal: profile.careerGoalTitle,
          totalStages: stages.length || 5,
          currentStageNumber: 1,
          overallProgressPercent: 0,
          estimatedTotalHours: parsed.estimatedTotalHours || 180,
          stages
        };

        return NextResponse.json(personalizedRoadmap);
      } catch (aiErr) {
        console.error('Gemini Roadmap Generation Error, utilizing fallback generator:', aiErr);
      }
    }

    // Algorithmic Fallback Generator
    const sampleRoadmap = careersData.find(c => c.id === profile.careerGoalId);
    const stages: RoadmapStage[] = [
      {
        id: `st-1-${Date.now()}`,
        stageNumber: 1,
        title: 'Core Foundations & Toolchain Mastery',
        tagline: 'Establish robust programming patterns and algorithmic problem solving',
        estimatedWeeks: 3,
        status: 'in-progress',
        milestoneTitle: 'Foundations Certified',
        milestoneDescription: 'Completed fundamental problem sets and core architecture drills.',
        milestoneCompleted: false,
        topics: [
          {
            id: 't-1-1',
            title: 'Modern Language Fundamentals & Memory Idioms',
            description: 'In-depth study of memory model, type safety, asynchronous concurrency, and performance profiling.',
            estimatedHours: 12,
            completed: false,
            keyConcepts: ['Memory Management', 'Async/Await', 'Type Systems', 'Optimization']
          },
          {
            id: 't-1-2',
            title: 'Essential Data Structures & Algorithmic Patterns',
            description: 'Hands-on practice with HashMaps, Graph traversals, Trees, and Dynamic Programming optimization.',
            estimatedHours: 14,
            completed: false,
            keyConcepts: ['DFS/BFS', 'Dynamic Programming', 'Complexity Analysis', 'Spatial Indexing']
          }
        ],
        projects: [
          {
            id: 'p-1-1',
            title: 'High-Throughput CLI Benchmarking Engine',
            description: 'Develop a clean, modular command-line utility that benchmarks data processing algorithms with automated memory profiling.',
            difficulty: 'Beginner',
            deliverables: ['GitHub repo with CI workflow', 'Performance comparison graphs'],
            industryRelevance: 'Demonstrates disciplined code structure, testing, and algorithmic rigor.',
            completed: false
          }
        ],
        resources: [
          {
            title: 'MIT OpenCourseWare: Intro to Algorithms',
            url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
            type: 'Course',
            isFree: true,
            provider: 'MIT'
          }
        ]
      },
      {
        id: `st-2-${Date.now()}`,
        stageNumber: 2,
        title: 'Domain Architecture & System Design',
        tagline: 'Build scalable domain services and API communication layers',
        estimatedWeeks: 3,
        status: 'locked',
        milestoneTitle: 'Architectural Builder',
        milestoneDescription: 'Engineered multi-layered service with robust data persistence.',
        milestoneCompleted: false,
        topics: [
          {
            id: 't-2-1',
            title: 'API Schemas, Authentication & Middleware',
            description: 'Designing resilient REST/gRPC interfaces, JWT authentication, and rate-limiting middleware.',
            estimatedHours: 10,
            completed: false,
            keyConcepts: ['REST / gRPC', 'JWT Security', 'Middleware Interceptors', 'OpenAPI']
          },
          {
            id: 't-2-2',
            title: 'Database Normalization & Query Indexing',
            description: 'Relational data modeling, composite indexing, caching strategies, and transaction isolation.',
            estimatedHours: 12,
            completed: false,
            keyConcepts: ['PostgreSQL Indexing', 'Redis Caching', 'ACID Transactions', 'Connection Pooling']
          }
        ],
        projects: [
          {
            id: 'p-2-1',
            title: 'Distributed Real-Time Data Pipeline',
            description: 'Construct an end-to-end backend service that ingests telemetry events, caches hot data in Redis, and serves analytics.',
            difficulty: 'Intermediate',
            deliverables: ['Containerized service', 'Database schema migrations', 'Load test benchmark report'],
            industryRelevance: 'Standard architecture used in fintech, logistics, and IoT gateways.',
            completed: false
          }
        ],
        resources: [
          {
            title: 'Full Stack Open - Modern Web Architecture',
            url: 'https://fullstackopen.com/en/',
            type: 'Course',
            isFree: true,
            provider: 'University of Helsinki'
          }
        ]
      },
      {
        id: `st-3-${Date.now()}`,
        stageNumber: 3,
        title: 'Advanced Technology & Intelligent Systems',
        tagline: 'Integrate machine intelligence, automated tools, and cloud microservices',
        estimatedWeeks: 4,
        status: 'locked',
        milestoneTitle: 'Intelligent Systems Specialist',
        milestoneDescription: 'Integrated machine intelligence and agentic workflows into production services.',
        milestoneCompleted: false,
        topics: [
          {
            id: 't-3-1',
            title: 'Model Inference, Vector Search & LLM Orchestration',
            description: 'Implementing semantic vector search, prompt optimization, structured JSON function calling, and context grounding.',
            estimatedHours: 14,
            completed: false,
            keyConcepts: ['Vector Embeddings', 'Function Calling', 'RAG Pipelines', 'Context Management']
          },
          {
            id: 't-3-2',
            title: 'Event-Driven Architectures & Asynchronous Queues',
            description: 'Message brokers (RabbitMQ/Kafka), background worker pools, idempotency, and retry policies.',
            estimatedHours: 12,
            completed: false,
            keyConcepts: ['Message Queues', 'Worker Concurrency', 'Dead-Letter Queues', 'Event Sourcing']
          }
        ],
        projects: [
          {
            id: 'p-3-1',
            title: 'AI-Powered Intelligent Agent Platform',
            description: 'Build a production-grade agent system that autonomously searches documents, verifies data against an API, and produces formatted reports.',
            difficulty: 'Advanced',
            deliverables: ['Live deployed service', 'Evaluation dataset', 'Comprehensive API docs'],
            industryRelevance: 'Direct match for high-paying AI Engineer and Senior Full-Stack roles.',
            completed: false
          }
        ],
        resources: [
          {
            title: 'DeepLearning.AI: Generative AI Systems',
            url: 'https://www.deeplearning.ai/',
            type: 'Course',
            isFree: true,
            provider: 'DeepLearning.AI'
          }
        ]
      },
      {
        id: `st-4-${Date.now()}`,
        stageNumber: 4,
        title: 'Production Deployment, CI/CD & Reliability',
        tagline: 'Containerize, automate testing, and achieve cloud resilience',
        estimatedWeeks: 3,
        status: 'locked',
        milestoneTitle: 'Production Deployment Engineer',
        milestoneDescription: 'Achieved zero-downtime automated deployment pipelines with health monitoring.',
        milestoneCompleted: false,
        topics: [
          {
            id: 't-4-1',
            title: 'Multi-Stage Docker Builds & Container Hardening',
            description: 'Optimizing container layers, minimizing attack surface, rootless containers, and health check probes.',
            estimatedHours: 10,
            completed: false,
            keyConcepts: ['Docker Multi-stage', 'Alpine / Distroless', 'Non-root Users', 'Vulnerability Scans']
          },
          {
            id: 't-4-2',
            title: 'Automated CI/CD Pipelines & Cloud Observability',
            description: 'GitHub Actions workflow matrix, semantic versioning, Prometheus metrics, and structured log aggregation.',
            estimatedHours: 12,
            completed: false,
            keyConcepts: ['GitHub Actions', 'Prometheus Metrics', 'Structured Logging', 'Zero-Downtime Rollout']
          }
        ],
        projects: [
          {
            id: 'p-4-1',
            title: 'Automated Cloud Infrastructure & Live Showcase',
            description: 'Deploy all previously built services into a multi-container cloud environment with automated SSL and health monitoring.',
            difficulty: 'Advanced',
            deliverables: ['Live URL', 'Infrastructure as Code templates', 'CI/CD pipeline logs'],
            industryRelevance: 'Proves complete end-to-end technical independence and production readiness.',
            completed: false
          }
        ],
        resources: [
          {
            title: 'Docker Getting Started Official Labs',
            url: 'https://docs.docker.com/get-started/',
            type: 'Documentation',
            isFree: true,
            provider: 'Docker Inc.'
          }
        ]
      },
      {
        id: `st-5-${Date.now()}`,
        stageNumber: 5,
        title: 'Capstone Showcase, Portfolio & Career Launch',
        tagline: 'Stand out to top domestic and international engineering teams',
        estimatedWeeks: 3,
        status: 'locked',
        milestoneTitle: 'Future-Ready Professional',
        milestoneDescription: 'Completed comprehensive capstone with technical whitepaper and interview readiness.',
        milestoneCompleted: false,
        topics: [
          {
            id: 't-5-1',
            title: 'Engineering Portfolio & Technical Documentation',
            description: 'Writing high-quality case studies, architectural decision records (ADRs), and live interactive demo environments.',
            estimatedHours: 10,
            completed: false,
            keyConcepts: ['Architecture Case Studies', 'Open Source Contribution', 'Code Review Standards']
          },
          {
            id: 't-5-2',
            title: 'System Design Drills & Technical Interview Preparation',
            description: 'Practicing large-scale system design tradeoffs, algorithmic complexity discussions, and behavioral communication.',
            estimatedHours: 14,
            completed: false,
            keyConcepts: ['Scalability Patterns', 'CAP Theorem', 'Mock Technical Interviews', 'Cross-Border Tech Standards']
          }
        ],
        projects: [
          {
            id: 'p-5-1',
            title: 'Flagship Capstone Project & Cross-Border Showcase',
            description: 'A flagship production system tailored to future economic and technological needs (e.g. cross-border logistics, smart education, or clean energy analytics).',
            difficulty: 'Advanced',
            deliverables: ['Public GitHub repository with documentation', 'Live deployed interactive application', 'Technical demo video'],
            industryRelevance: 'Serves as the definitive proof of excellence for top-tier hiring managers and research programs.',
            completed: false
          }
        ],
        resources: [
          {
            title: 'roadmap.sh System Design & Best Practices',
            url: 'https://roadmap.sh/',
            type: 'Interactive',
            isFree: true,
            provider: 'roadmap.sh'
          }
        ]
      }
    ];

    const fallbackRoadmap: PersonalizedRoadmap = {
      id: `roadmap-${profile.id}-${Date.now()}`,
      profileId: profile.id,
      careerGoal: profile.careerGoalTitle,
      totalStages: 5,
      currentStageNumber: 1,
      overallProgressPercent: 0,
      estimatedTotalHours: 180,
      stages
    };

    return NextResponse.json(fallbackRoadmap);
  } catch (error) {
    console.error('Roadmap API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}
