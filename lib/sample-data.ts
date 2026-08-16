import { StudentProfile, AssessmentResult, PersonalizedRoadmap } from './types';

export const SAMPLE_STUDENT_PROFILE: StudentProfile = {
  id: 'sample-ahmed',
  fullName: 'Ahmed Raza',
  email: 'ahmed.raza@example.pk',
  educationLevel: 'Undergraduate (3rd/4th Year)',
  major: 'Computer Science',
  institution: 'NUST / FAST-NUCES',
  currentYearOrSemester: '6th Semester (Year 3)',
  careerGoalId: 'ai-engineer',
  careerGoalTitle: 'AI & Machine Learning Engineer',
  currentSkills: [
    { name: 'Python & NumPy', category: 'Core Computer Science', level: 7, proficiency: 'Intermediate' },
    { name: 'Data Structures & Algorithms', category: 'Core Computer Science', level: 6, proficiency: 'Intermediate' },
    { name: 'Linear Algebra & Calculus', category: 'Artificial Intelligence & Data', level: 5, proficiency: 'Intermediate' },
    { name: 'PyTorch / TensorFlow', category: 'Artificial Intelligence & Data', level: 3, proficiency: 'Beginner' },
    { name: 'LLMs, Prompt & RAG Systems', category: 'Artificial Intelligence & Data', level: 2, proficiency: 'Beginner' },
    { name: 'Model Deployment & Docker', category: 'DevOps, Security & Cloud', level: 2, proficiency: 'Beginner' }
  ],
  interests: ['Computer Vision', 'Generative AI', 'High Performance Computing', 'Pak-China Smart Cities'],
  currentExperience: 'Built coursework projects in Python, basic scikit-learn classification models, and solved 80+ LeetCode problems.',
  weeklyAvailableHours: 12,
  preferredLanguage: 'English',
  createdAt: '2026-08-16T10:00:00Z',
  updatedAt: '2026-08-16T10:00:00Z'
};

export const SAMPLE_ASSESSMENT_RESULT: AssessmentResult = {
  profileId: 'sample-ahmed',
  careerGoal: 'AI & Machine Learning Engineer',
  readinessScore: 48,
  overallDiagnosis: 'Strong programmatic baseline in Python with solid algorithmic intuition. The primary blocker to industry-grade AI engineering is hands-on experience in deep learning frameworks (PyTorch), vector retrieval architecture (RAG), and containerized model inference serving.',
  strengths: [
    'Solid foundation in Python fundamentals and OOP',
    'Active problem-solving practice in core data structures',
    'Strong academic grounding in higher mathematics'
  ],
  potentialWeaknesses: [
    'Limited experience training multi-layer neural networks from scratch',
    'Has not deployed ML models as production REST/gRPC endpoints',
    'Needs deeper familiarity with LLM vector embeddings and evaluation metrics'
  ],
  skillGaps: [
    {
      skillName: 'LLMs, Prompt & RAG Systems',
      category: 'Artificial Intelligence & Data',
      userLevel: 2,
      targetLevel: 8,
      gapScore: 6,
      priority: 'Critical',
      explanation: 'Modern AI industry mandates mastery of retrieval-augmented generation, embeddings, and context window orchestration.',
      recommendedFirstTopic: 'Vector Embeddings, ChromaDB/Pinecone, and Chunking Strategies'
    },
    {
      skillName: 'PyTorch / TensorFlow',
      category: 'Artificial Intelligence & Data',
      userLevel: 3,
      targetLevel: 8,
      gapScore: 5,
      priority: 'Critical',
      explanation: 'PyTorch is the global standard for deep learning research and industrial model fine-tuning.',
      recommendedFirstTopic: 'Custom Dataset loaders, autograd backprop, and GPU tensor pipelines'
    },
    {
      skillName: 'Model Deployment & Docker',
      category: 'DevOps, Security & Cloud',
      userLevel: 2,
      targetLevel: 7,
      gapScore: 5,
      priority: 'High',
      explanation: 'ML models must be packaged as lightweight Docker containers behind FastAPI microservices for production.',
      recommendedFirstTopic: 'FastAPI model wrapping with ONNX Runtime & Docker multi-stage builds'
    },
    {
      skillName: 'Linear Algebra & Calculus',
      category: 'Artificial Intelligence & Data',
      userLevel: 5,
      targetLevel: 7,
      gapScore: 2,
      priority: 'Medium',
      explanation: 'Needed for understanding attention mechanisms, gradient updates, and loss landscape optimization.',
      recommendedFirstTopic: 'Matrix decomposition, SVD, and Jacobian derivatives in backprop'
    }
  ],
  keyRecommendations: [
    'Prioritize PyTorch fundamentals before diving into complex Transformer architectures.',
    'Build one end-to-end RAG system with document chunking, hybrid search, and hallucination evaluation.',
    'Package every AI project inside a Docker container with automated benchmarking.',
    'Target internships in bilingual cross-border AI projects (CPEC tech corridors and local AI labs).'
  ],
  learningOrderRationale: 'Solidifying PyTorch and mathematical foundations in Stage 1-2 unlocks the ability to build sophisticated LLM/Vision applications in Stage 3-4, culminating in real-world deployment in Stage 5.',
  estimatedTimeToReadinessWeeks: 16
};

export const SAMPLE_ROADMAP: PersonalizedRoadmap = {
  id: 'roadmap-ahmed',
  profileId: 'sample-ahmed',
  careerGoal: 'AI & Machine Learning Engineer',
  totalStages: 5,
  currentStageNumber: 1,
  overallProgressPercent: 20,
  estimatedTotalHours: 190,
  stages: [
    {
      id: 'stage-1',
      stageNumber: 1,
      title: 'Deep Learning & PyTorch Mastery',
      tagline: 'From mathematical tensors to custom neural architectures',
      estimatedWeeks: 3,
      status: 'in-progress',
      milestoneTitle: 'PyTorch Neural Architect',
      milestoneDescription: 'Built and trained custom CNN and Multi-Layer Perceptrons on GPU with validation monitoring.',
      milestoneCompleted: false,
      topics: [
        {
          id: 't-1-1',
          title: 'PyTorch Tensors, Autograd & GPU Memory',
          description: 'Master tensor broadcasting, custom autograd Functions, CUDA device allocation, and memory pinning.',
          estimatedHours: 8,
          completed: true,
          keyConcepts: ['torch.Tensor', 'Autograd Graph', 'CUDA Stream', 'Memory Management']
        },
        {
          id: 't-1-2',
          title: 'Custom Datasets, Transforms & DataLoader Optimization',
          description: 'Build robust data pipelines with num_workers, pin_memory, and image/text transformations.',
          estimatedHours: 8,
          completed: true,
          keyConcepts: ['torch.utils.data.Dataset', 'DataLoader', 'Batching', 'Augmentations']
        },
        {
          id: 't-1-3',
          title: 'Training Loops, Loss Functions & Regularization',
          description: 'Implement learning rate schedulers, AdamW, Dropout, Weight Decay, and Early Stopping with TensorBoard.',
          estimatedHours: 10,
          completed: false,
          keyConcepts: ['CrossEntropyLoss', 'AdamW Optimizer', 'TensorBoard', 'Early Stopping']
        }
      ],
      projects: [
        {
          id: 'p-1-1',
          title: 'Multimodal Image-Text Classifier from Scratch',
          description: 'Design a modular PyTorch neural network that classifies technical diagrams and research images with >92% test accuracy.',
          difficulty: 'Intermediate',
          deliverables: ['GitHub Repository', 'Training curves in TensorBoard', 'PyTorch checkpoint artifact'],
          industryRelevance: 'Directly applicable to automated document verification and image telemetry.',
          completed: false
        }
      ],
      resources: [
        {
          title: 'Fast.ai Practical Deep Learning for Coders',
          url: 'https://course.fast.ai/',
          type: 'Course',
          isFree: true,
          provider: 'Fast.ai'
        },
        {
          title: 'PyTorch Official Deep Learning Tutorials',
          url: 'https://pytorch.org/tutorials/',
          type: 'Documentation',
          isFree: true,
          provider: 'PyTorch.org'
        }
      ]
    },
    {
      id: 'stage-2',
      stageNumber: 2,
      title: 'Modern NLP, Attention & Transformer Architectures',
      tagline: 'Deconstruct BERT, GPT, and tokenization mechanics',
      estimatedWeeks: 4,
      status: 'locked',
      milestoneTitle: 'Transformer Practitioner',
      milestoneDescription: 'Implemented multi-head self-attention and fine-tuned a domain-specific encoder-decoder.',
      milestoneCompleted: false,
      topics: [
        {
          id: 't-2-1',
          title: 'Self-Attention & Positional Encodings',
          description: 'Mathematical intuition and tensor implementation of Scaled Dot-Product Attention, Q/K/V matrices.',
          estimatedHours: 12,
          completed: false,
          keyConcepts: ['Scaled Dot Product', 'Multi-Head Attention', 'Rotary Positional Embeddings']
        },
        {
          id: 't-2-2',
          title: 'Hugging Face Transformers & Tokenizers',
          description: 'Byte-Pair Encoding (BPE), AutoModel, AutoTokenizer, and memory-efficient batch tokenization.',
          estimatedHours: 10,
          completed: false,
          keyConcepts: ['HuggingFace Hub', 'BPE Tokenizer', 'Trainer API', 'PEFT/LoRA Basics']
        }
      ],
      projects: [
        {
          id: 'p-2-1',
          title: 'Bilingual Technical Document Summarizer',
          description: 'Fine-tune a lightweight LLM using LoRA to summarize Pakistani & Chinese bilingual technical patents.',
          difficulty: 'Intermediate',
          deliverables: ['Fine-tuned LoRA adapter', 'Evaluation metrics (ROUGE/BLEU)', 'Colab demo'],
          industryRelevance: 'Crucial for cross-border research analysis and translation pipelines.',
          completed: false
        }
      ],
      resources: [
        {
          title: 'Hugging Face NLP Course (Free & Interactive)',
          url: 'https://huggingface.co/learn/nlp-course',
          type: 'Course',
          isFree: true,
          provider: 'Hugging Face'
        }
      ]
    },
    {
      id: 'stage-3',
      stageNumber: 3,
      title: 'Advanced RAG & Agentic LLM Systems',
      tagline: 'Build production-grade retrieval architectures and autonomous agent loops',
      estimatedWeeks: 3,
      status: 'locked',
      milestoneTitle: 'Agentic Systems Engineer',
      milestoneDescription: 'Engineered a resilient agent with tool-calling, vector search, and reranking.',
      milestoneCompleted: false,
      topics: [
        {
          id: 't-3-1',
          title: 'Vector Embeddings, Hybrid Search & Cohere Reranking',
          description: 'Dense vector search paired with sparse BM25 keyword matching and cross-encoder reranking.',
          estimatedHours: 10,
          completed: false,
          keyConcepts: ['HNSW Indexing', 'Reciprocal Rank Fusion', 'Cohere Rerank', 'Context Chunking']
        },
        {
          id: 't-3-2',
          title: 'Agentic Workflows, Function Calling & Memory',
          description: 'Multi-step agent loops, tool validation schemas, structured JSON output, and conversation memory buffers.',
          estimatedHours: 12,
          completed: false,
          keyConcepts: ['Tool Calling', 'ReAct Paradigm', 'State Management', 'Guardrails']
        }
      ],
      projects: [
        {
          id: 'p-3-1',
          title: 'Autonomous Research Assistant for Academic Papers',
          description: 'An AI agent that retrieves, verifies citations, and produces structured analytical briefs on arXiv papers.',
          difficulty: 'Advanced',
          deliverables: ['Live web interface', 'Vector database pipeline', 'Benchmarked accuracy report'],
          industryRelevance: 'High demand in enterprise knowledge management and AI consulting.',
          completed: false
        }
      ],
      resources: [
        {
          title: 'LangChain & LlamaIndex Production Guides',
          url: 'https://docs.llamaindex.ai/',
          type: 'Documentation',
          isFree: true,
          provider: 'LlamaIndex'
        }
      ]
    },
    {
      id: 'stage-4',
      stageNumber: 4,
      title: 'Production MLOps, Docker & Low-Latency Serving',
      tagline: 'Containerization, quantization, and ONNX Runtime inference',
      estimatedWeeks: 3,
      status: 'locked',
      milestoneTitle: 'MLOps Deployment Specialist',
      milestoneDescription: 'Deployed containerized models with sub-50ms inference latency.',
      milestoneCompleted: false,
      topics: [
        {
          id: 't-4-1',
          title: 'FastAPI, gRPC & Asynchronous Inference Queues',
          description: 'High-throughput Python web services with pydantic validation and background batch workers.',
          estimatedHours: 10,
          completed: false,
          keyConcepts: ['FastAPI', 'gRPC', 'Dynamic Batching', 'Pydantic V2']
        },
        {
          id: 't-4-2',
          title: 'Model Quantization, ONNX & Docker Packaging',
          description: 'Convert PyTorch weights to ONNX/TensorRT, apply int8/fp16 quantization, and build multi-stage Docker images.',
          estimatedHours: 12,
          completed: false,
          keyConcepts: ['ONNX Runtime', 'INT8 Quantization', 'Docker Alpine', 'Triton Inference Server']
        }
      ],
      projects: [
        {
          id: 'p-4-1',
          title: 'High-Performance Microservice on Docker & Cloud',
          description: 'Package a quantized image/text model in Docker with healthchecks, prometheus metrics, and deploy to Cloud Run.',
          difficulty: 'Advanced',
          deliverables: ['Dockerfile with <500MB size', 'Load test results (Apache Bench)', 'Cloud deployment URL'],
          industryRelevance: 'Standard requirement for senior AI/ML infrastructure roles.',
          completed: false
        }
      ],
      resources: [
        {
          title: 'Made With ML - Production MLOps Course',
          url: 'https://madewithml.com/',
          type: 'Course',
          isFree: true,
          provider: 'Goku Mohandas'
        }
      ]
    },
    {
      id: 'stage-5',
      stageNumber: 5,
      title: 'Portfolio Polish, Open-Source & Internship Readiness',
      tagline: 'Showcase real-world capability to international tech teams',
      estimatedWeeks: 3,
      status: 'locked',
      milestoneTitle: 'Future-Ready AI Engineer',
      milestoneDescription: 'Published production portfolio with live demos, technical blog posts, and international interview readiness.',
      milestoneCompleted: false,
      topics: [
        {
          id: 't-5-1',
          title: 'Technical Writing, System Architecture Diagrams & GitHub READMEs',
          description: 'Documenting engineering decisions, benchmark comparisons, and clean reproducible instructions.',
          estimatedHours: 8,
          completed: false,
          keyConcepts: ['Architecture Diagrams', 'Benchmarking Reports', 'Open Source Etiquette']
        },
        {
          id: 't-5-2',
          title: 'ML System Design & Live Coding Interview Drills',
          description: 'System design for YouTube Recommendation, Chatbot Retrieval, Fraud Detection, and LeetCode Mediums.',
          estimatedHours: 14,
          completed: false,
          keyConcepts: ['System Design Tradeoffs', 'Latency vs Cost', 'Model Evaluation Drift']
        }
      ],
      projects: [
        {
          id: 'p-5-1',
          title: 'Capstone: End-to-End Enterprise AI Platform',
          description: 'A complete full-stack AI platform combining custom fine-tuned models, RAG vector database, and modern web UI.',
          difficulty: 'Advanced',
          deliverables: ['Production deployment', 'Technical whitepaper/blog', 'Comprehensive GitHub repo'],
          industryRelevance: 'The flagship project that wins interviews at top tier global tech firms.',
          completed: false
        }
      ],
      resources: [
        {
          title: 'Chip Huyen: Designing Machine Learning Systems',
          url: 'https://huyenchip.com/',
          type: 'Book',
          isFree: false,
          provider: 'O\'Reilly'
        }
      ]
    }
  ]
};

export const SAMPLE_PROFILES: { [key: string]: { profile: StudentProfile; assessment: AssessmentResult; roadmap: PersonalizedRoadmap } } = {
  'ahmed-ai': {
    profile: SAMPLE_STUDENT_PROFILE,
    assessment: SAMPLE_ASSESSMENT_RESULT,
    roadmap: SAMPLE_ROADMAP
  }
};
