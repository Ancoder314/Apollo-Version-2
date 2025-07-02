// Enhanced AI Engine with Advanced Localized Model
import { openaiService, OpenAIStudyPlanRequest } from './openaiService';

export interface UserProfile {
  name: string;
  level: number;
  totalStars: number;
  currentStreak: number;
  studyTime: number;
  completedLessons: number;
  weakAreas: string[];
  strongAreas: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  preferredDifficulty?: 'easy' | 'medium' | 'hard' | 'adaptive';
  studyGoals?: string[];
  timeAvailable?: number; // minutes per day
  recentPerformance?: {
    accuracy: number;
    speed: number;
    consistency: number;
    engagement: number;
  };
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // in days
  dailyTimeCommitment: number; // in minutes
  difficulty: string;
  subjects: StudySubject[];
  milestones: Milestone[];
  adaptiveFeatures: AdaptiveFeature[];
  personalizedRecommendations: string[];
  estimatedOutcome: string;
  confidence: number; // 0-100
}

export interface StudySubject {
  name: string;
  priority: 'high' | 'medium' | 'low';
  timeAllocation: number; // percentage
  topics: Topic[];
  reasoning: string;
}

export interface Topic {
  name: string;
  difficulty: string;
  estimatedTime: number; // minutes
  prerequisites: string[];
  learningObjectives: string[];
  resources: Resource[];
  assessments: Assessment[];
}

export interface Resource {
  type: 'video' | 'article' | 'interactive' | 'practice' | 'simulation';
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: string;
}

export interface Assessment {
  type: 'quiz' | 'problem_set' | 'project' | 'simulation';
  title: string;
  questions: number;
  estimatedTime: number;
  passingScore: number;
}

export interface Milestone {
  week: number;
  title: string;
  description: string;
  successCriteria: string[];
  rewards: string[];
}

export interface AdaptiveFeature {
  trigger: string;
  action: string;
  description: string;
}

class AIStudyPlanEngine {
  private localizedEngine: LocalizedAIEngine;

  constructor() {
    this.localizedEngine = new LocalizedAIEngine();
  }

  public async generateStudyPlan(userProfile: UserProfile, goals: string[] = [], uploadedContent: string = ''): Promise<StudyPlan> {
    console.log('🤖 AI Engine: Starting study plan generation for:', userProfile.name);
    
    try {
      // Check if OpenAI API key is available
      const hasOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY && 
                           import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';

      if (hasOpenAIKey) {
        console.log('🔑 Attempting OpenAI API for enhanced study plan generation');
        return await this.generateWithOpenAI(userProfile, goals, uploadedContent);
      } else {
        console.log('⚡ Using localized AI engine (OpenAI key not configured)');
        return this.localizedEngine.generateStudyPlan(userProfile, goals, uploadedContent);
      }
    } catch (error) {
      console.error('❌ OpenAI generation failed, falling back to localized engine:', error);
      return this.localizedEngine.generateStudyPlan(userProfile, goals, uploadedContent);
    }
  }

  private async generateWithOpenAI(userProfile: UserProfile, goals: string[], uploadedContent: string): Promise<StudyPlan> {
    const request: OpenAIStudyPlanRequest = {
      userProfile: {
        name: userProfile.name,
        level: userProfile.level,
        weakAreas: userProfile.weakAreas,
        strongAreas: userProfile.strongAreas,
        learningStyle: userProfile.learningStyle || 'visual',
        studyGoals: userProfile.studyGoals || [],
        timeAvailable: userProfile.timeAvailable || 60,
        additionalInfo: uploadedContent
      },
      goals,
      uploadedContent
    };

    const openaiResponse = await openaiService.generateStudyPlan(request);
    
    // Convert OpenAI response to our StudyPlan format
    const studyPlan: StudyPlan = {
      id: `plan_${Date.now()}`,
      title: openaiResponse.title,
      description: openaiResponse.description,
      duration: openaiResponse.duration,
      dailyTimeCommitment: userProfile.timeAvailable || 60,
      difficulty: openaiResponse.difficulty,
      subjects: openaiResponse.subjects.map(subject => ({
        ...subject,
        topics: subject.topics.map(topic => ({
          ...topic,
          prerequisites: [],
          resources: this.generateResources(topic.name, userProfile.learningStyle || 'visual'),
          assessments: this.generateAssessments(topic.name, topic.difficulty)
        }))
      })),
      milestones: openaiResponse.milestones.map(milestone => ({
        ...milestone,
        rewards: this.generateMilestoneRewards(milestone.week)
      })),
      adaptiveFeatures: this.generateAdaptiveFeatures(userProfile),
      personalizedRecommendations: openaiResponse.personalizedRecommendations,
      estimatedOutcome: openaiResponse.estimatedOutcome,
      confidence: openaiResponse.confidence
    };

    console.log('✅ OpenAI study plan generated successfully');
    return studyPlan;
  }

  public async generateStudyContent(subject: string, topic: string, difficulty: string, learningStyle: string): Promise<any> {
    try {
      const hasOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY && 
                           import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';

      if (hasOpenAIKey) {
        return await openaiService.generateStudyContent(subject, topic, difficulty, learningStyle);
      } else {
        return this.localizedEngine.generateStudyContent(subject, topic, difficulty, learningStyle);
      }
    } catch (error) {
      console.error('Content generation failed, using localized engine:', error);
      return this.localizedEngine.generateStudyContent(subject, topic, difficulty, learningStyle);
    }
  }

  private generateResources(topicName: string, learningStyle: string): Resource[] {
    const resources: Resource[] = [];
    
    switch (learningStyle) {
      case 'visual':
        resources.push({
          type: 'interactive',
          title: `${topicName} - Interactive Visualization`,
          description: `Visual learning tools for ${topicName}`,
          estimatedTime: 30,
          difficulty: 'medium'
        });
        break;
      case 'auditory':
        resources.push({
          type: 'video',
          title: `${topicName} - Audio Lecture`,
          description: `Comprehensive audio explanation of ${topicName}`,
          estimatedTime: 45,
          difficulty: 'medium'
        });
        break;
      case 'kinesthetic':
        resources.push({
          type: 'simulation',
          title: `${topicName} - Hands-on Simulation`,
          description: `Interactive simulation for ${topicName}`,
          estimatedTime: 60,
          difficulty: 'medium'
        });
        break;
      default:
        resources.push({
          type: 'article',
          title: `${topicName} - Comprehensive Guide`,
          description: `In-depth reading material for ${topicName}`,
          estimatedTime: 40,
          difficulty: 'medium'
        });
    }

    resources.push({
      type: 'practice',
      title: `${topicName} - Practice Problems`,
      description: `Curated practice problems for ${topicName}`,
      estimatedTime: 45,
      difficulty: 'medium'
    });

    return resources;
  }

  private generateAssessments(topicName: string, difficulty: string): Assessment[] {
    const assessments: Assessment[] = [
      {
        type: 'quiz',
        title: `${topicName} - Knowledge Check`,
        questions: difficulty === 'Expert' ? 15 : difficulty === 'Advanced' ? 12 : 8,
        estimatedTime: 20,
        passingScore: 75
      }
    ];

    if (difficulty === 'Advanced' || difficulty === 'Expert') {
      assessments.push({
        type: 'problem_set',
        title: `${topicName} - Problem Set`,
        questions: 8,
        estimatedTime: 40,
        passingScore: 70
      });
    }

    return assessments;
  }

  private generateAdaptiveFeatures(userProfile: UserProfile): AdaptiveFeature[] {
    return [
      {
        trigger: 'Low performance (< 70% accuracy)',
        action: 'Reduce difficulty and provide additional practice',
        description: 'Automatically adjusts content difficulty when struggling'
      },
      {
        trigger: 'High performance (> 90% accuracy)',
        action: 'Increase difficulty and introduce advanced topics',
        description: 'Challenges high performers with more complex material'
      },
      {
        trigger: 'Inconsistent study pattern',
        action: 'Send motivational reminders and adjust schedule',
        description: 'Helps maintain consistent study habits'
      }
    ];
  }

  private generateMilestoneRewards(week: number): string[] {
    const baseRewards = [`${week * 10} bonus stars`, 'Progress badge'];
    
    if (week % 4 === 0) {
      baseRewards.push('Special achievement unlock');
    }
    
    return baseRewards;
  }
}

// Advanced Localized AI Engine with Content Analysis
class LocalizedAIEngine {
  private knowledgeBase: Map<string, any>;
  private contentAnalyzer: ContentAnalyzer;

  constructor() {
    this.knowledgeBase = new Map();
    this.contentAnalyzer = new ContentAnalyzer();
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    this.knowledgeBase.set('subjects', {
      'Mathematics': {
        topics: {
          'Algebra': { difficulty: 0.3, time: 45, category: 'foundation', keywords: ['equations', 'variables', 'polynomials'] },
          'Calculus': { difficulty: 0.8, time: 60, category: 'advanced', keywords: ['derivatives', 'integrals', 'limits'] },
          'Linear Algebra': { difficulty: 0.7, time: 50, category: 'advanced', keywords: ['matrices', 'vectors', 'eigenvalues'] },
          'Statistics': { difficulty: 0.5, time: 40, category: 'intermediate', keywords: ['probability', 'distributions', 'hypothesis'] },
          'Differential Equations': { difficulty: 0.9, time: 70, category: 'expert', keywords: ['differential', 'ordinary', 'partial'] },
          'Geometry': { difficulty: 0.4, time: 35, category: 'foundation', keywords: ['shapes', 'angles', 'proofs'] },
          'Trigonometry': { difficulty: 0.5, time: 40, category: 'intermediate', keywords: ['sine', 'cosine', 'tangent'] },
          'Number Theory': { difficulty: 0.8, time: 55, category: 'advanced', keywords: ['primes', 'modular', 'cryptography'] }
        }
      },
      'Physics': {
        topics: {
          'Mechanics': { difficulty: 0.6, time: 50, category: 'foundation', keywords: ['force', 'motion', 'energy'] },
          'Thermodynamics': { difficulty: 0.7, time: 55, category: 'intermediate', keywords: ['heat', 'entropy', 'temperature'] },
          'Electromagnetism': { difficulty: 0.8, time: 65, category: 'advanced', keywords: ['electric', 'magnetic', 'fields'] },
          'Quantum Mechanics': { difficulty: 0.95, time: 80, category: 'expert', keywords: ['quantum', 'wave', 'particle'] },
          'Optics': { difficulty: 0.5, time: 40, category: 'intermediate', keywords: ['light', 'reflection', 'refraction'] },
          'Relativity': { difficulty: 0.9, time: 75, category: 'expert', keywords: ['spacetime', 'einstein', 'relativity'] },
          'Waves': { difficulty: 0.6, time: 45, category: 'intermediate', keywords: ['frequency', 'amplitude', 'interference'] }
        }
      },
      'Chemistry': {
        topics: {
          'General Chemistry': { difficulty: 0.4, time: 45, category: 'foundation', keywords: ['atoms', 'molecules', 'reactions'] },
          'Organic Chemistry': { difficulty: 0.8, time: 65, category: 'advanced', keywords: ['carbon', 'functional groups', 'synthesis'] },
          'Physical Chemistry': { difficulty: 0.85, time: 70, category: 'advanced', keywords: ['thermodynamics', 'kinetics', 'quantum'] },
          'Analytical Chemistry': { difficulty: 0.6, time: 50, category: 'intermediate', keywords: ['analysis', 'spectroscopy', 'chromatography'] },
          'Biochemistry': { difficulty: 0.7, time: 60, category: 'advanced', keywords: ['proteins', 'enzymes', 'metabolism'] },
          'Inorganic Chemistry': { difficulty: 0.6, time: 50, category: 'intermediate', keywords: ['metals', 'coordination', 'crystals'] }
        }
      },
      'Biology': {
        topics: {
          'Cell Biology': { difficulty: 0.5, time: 45, category: 'foundation', keywords: ['cells', 'organelles', 'membrane'] },
          'Genetics': { difficulty: 0.7, time: 55, category: 'intermediate', keywords: ['DNA', 'genes', 'inheritance'] },
          'Molecular Biology': { difficulty: 0.8, time: 65, category: 'advanced', keywords: ['proteins', 'transcription', 'translation'] },
          'Ecology': { difficulty: 0.6, time: 50, category: 'intermediate', keywords: ['ecosystem', 'environment', 'population'] },
          'Evolution': { difficulty: 0.7, time: 55, category: 'intermediate', keywords: ['natural selection', 'adaptation', 'species'] },
          'Anatomy': { difficulty: 0.6, time: 50, category: 'intermediate', keywords: ['organs', 'systems', 'structure'] },
          'Physiology': { difficulty: 0.7, time: 60, category: 'advanced', keywords: ['function', 'homeostasis', 'regulation'] }
        }
      },
      'Computer Science': {
        topics: {
          'Programming Fundamentals': { difficulty: 0.5, time: 60, category: 'foundation', keywords: ['variables', 'loops', 'functions'] },
          'Data Structures': { difficulty: 0.7, time: 70, category: 'intermediate', keywords: ['arrays', 'trees', 'graphs'] },
          'Algorithms': { difficulty: 0.8, time: 75, category: 'advanced', keywords: ['sorting', 'searching', 'complexity'] },
          'Machine Learning': { difficulty: 0.85, time: 80, category: 'advanced', keywords: ['neural networks', 'training', 'models'] },
          'Database Systems': { difficulty: 0.6, time: 55, category: 'intermediate', keywords: ['SQL', 'relational', 'queries'] },
          'Software Engineering': { difficulty: 0.7, time: 65, category: 'advanced', keywords: ['design patterns', 'architecture', 'testing'] },
          'Computer Networks': { difficulty: 0.7, time: 60, category: 'advanced', keywords: ['protocols', 'TCP/IP', 'routing'] }
        }
      },
      'Literature': {
        topics: {
          'Poetry Analysis': { difficulty: 0.6, time: 45, category: 'intermediate', keywords: ['metaphor', 'rhythm', 'imagery'] },
          'Novel Studies': { difficulty: 0.5, time: 50, category: 'foundation', keywords: ['plot', 'character', 'theme'] },
          'Drama': { difficulty: 0.6, time: 45, category: 'intermediate', keywords: ['dialogue', 'stage', 'conflict'] },
          'Literary Theory': { difficulty: 0.8, time: 60, category: 'advanced', keywords: ['criticism', 'interpretation', 'context'] },
          'Creative Writing': { difficulty: 0.7, time: 55, category: 'intermediate', keywords: ['narrative', 'style', 'voice'] },
          'Comparative Literature': { difficulty: 0.8, time: 65, category: 'advanced', keywords: ['cultural', 'cross-cultural', 'influence'] }
        }
      },
      'History': {
        topics: {
          'Ancient History': { difficulty: 0.5, time: 45, category: 'foundation', keywords: ['civilizations', 'empires', 'archaeology'] },
          'Medieval History': { difficulty: 0.6, time: 50, category: 'intermediate', keywords: ['feudalism', 'crusades', 'renaissance'] },
          'Modern History': { difficulty: 0.7, time: 55, category: 'intermediate', keywords: ['industrial', 'revolution', 'democracy'] },
          'World Wars': { difficulty: 0.6, time: 50, category: 'intermediate', keywords: ['conflict', 'global', 'consequences'] },
          'Social History': { difficulty: 0.7, time: 55, category: 'advanced', keywords: ['society', 'culture', 'movements'] },
          'Economic History': { difficulty: 0.8, time: 60, category: 'advanced', keywords: ['trade', 'capitalism', 'markets'] }
        }
      }
    });

    // Learning patterns and pedagogical knowledge
    this.knowledgeBase.set('learning_patterns', {
      'visual': {
        preferences: ['diagrams', 'charts', 'infographics', 'mind maps'],
        content_types: ['interactive_visualization', 'concept_mapping', 'flowcharts'],
        difficulty_adjustment: 0.9 // Slightly easier with visual aids
      },
      'auditory': {
        preferences: ['lectures', 'discussions', 'audio explanations', 'verbal repetition'],
        content_types: ['audio_content', 'discussion_prompts', 'verbal_explanations'],
        difficulty_adjustment: 1.0
      },
      'kinesthetic': {
        preferences: ['hands-on', 'experiments', 'simulations', 'practice problems'],
        content_types: ['interactive_simulations', 'lab_exercises', 'problem_solving'],
        difficulty_adjustment: 1.1 // Slightly harder but more engaging
      },
      'reading': {
        preferences: ['text-based', 'articles', 'books', 'written explanations'],
        content_types: ['comprehensive_guides', 'detailed_explanations', 'case_studies'],
        difficulty_adjustment: 1.0
      }
    });
  }

  public generateStudyPlan(userProfile: UserProfile, goals: string[] = [], uploadedContent: string = ''): StudyPlan {
    console.log('🧠 Localized AI: Generating study plan with content analysis');
    
    // Analyze uploaded content if provided
    const contentAnalysis = uploadedContent ? this.contentAnalyzer.analyzeContent(uploadedContent) : null;
    
    // Select subjects based on goals, weak areas, and content analysis
    const subjects = this.selectOptimalSubjects(userProfile, goals, contentAnalysis);
    
    // Generate personalized milestones
    const milestones = this.generateMilestones(subjects, userProfile);
    
    // Create adaptive features
    const adaptiveFeatures = this.generateAdaptiveFeatures(userProfile);
    
    // Generate recommendations based on learning style and content
    const recommendations = this.generateRecommendations(userProfile, contentAnalysis);

    return {
      id: `plan_${Date.now()}`,
      title: this.generatePlanTitle(userProfile, subjects, contentAnalysis),
      description: this.generatePlanDescription(subjects, userProfile, contentAnalysis),
      duration: this.calculateOptimalDuration(subjects, userProfile),
      dailyTimeCommitment: userProfile.timeAvailable || 60,
      difficulty: this.determineDifficulty(userProfile),
      subjects,
      milestones,
      adaptiveFeatures,
      personalizedRecommendations: recommendations,
      estimatedOutcome: this.generateEstimatedOutcome(subjects, userProfile),
      confidence: this.calculateConfidence(userProfile, subjects, contentAnalysis)
    };
  }

  public generateStudyContent(subject: string, topic: string, difficulty: string, learningStyle: string): any {
    const subjectsData = this.knowledgeBase.get('subjects');
    const topicData = subjectsData[subject]?.topics[topic];
    
    if (!topicData) {
      return this.generateGenericContent(subject, topic, difficulty, learningStyle);
    }

    return this.generateSpecificContent(subject, topic, difficulty, learningStyle, topicData);
  }

  private selectOptimalSubjects(userProfile: UserProfile, goals: string[], contentAnalysis: any): StudySubject[] {
    const subjects: StudySubject[] = [];
    const subjectsData = this.knowledgeBase.get('subjects');
    const availableSubjects = Object.keys(subjectsData);

    // Priority 1: Subjects from content analysis
    if (contentAnalysis?.detectedSubjects) {
      contentAnalysis.detectedSubjects.forEach((detectedSubject: string) => {
        const matchingSubject = this.findBestSubjectMatch(detectedSubject, availableSubjects);
        if (matchingSubject && !subjects.find(s => s.name === matchingSubject)) {
          subjects.push(this.createStudySubject(
            matchingSubject, 
            'high', 
            userProfile, 
            subjectsData[matchingSubject],
            `Identified from your uploaded content as a key focus area`
          ));
        }
      });
    }

    // Priority 2: Weak areas
    userProfile.weakAreas.forEach(weakArea => {
      const matchingSubject = this.findBestSubjectMatch(weakArea, availableSubjects);
      if (matchingSubject && !subjects.find(s => s.name === matchingSubject)) {
        subjects.push(this.createStudySubject(
          matchingSubject, 
          'high', 
          userProfile, 
          subjectsData[matchingSubject],
          `Addressing identified weak area: ${weakArea}`
        ));
      }
    });

    // Priority 3: Goals-based subjects
    goals.forEach(goal => {
      const matchingSubject = this.findBestSubjectMatch(goal, availableSubjects);
      if (matchingSubject && !subjects.find(s => s.name === matchingSubject)) {
        subjects.push(this.createStudySubject(
          matchingSubject, 
          'medium', 
          userProfile, 
          subjectsData[matchingSubject],
          `Supporting your goal: ${goal}`
        ));
      }
    });

    // Add default subjects if none found
    if (subjects.length === 0) {
      const defaultSubjects = ['Mathematics', 'Physics'];
      defaultSubjects.forEach(subjectName => {
        if (subjectsData[subjectName]) {
          subjects.push(this.createStudySubject(
            subjectName, 
            'medium', 
            userProfile, 
            subjectsData[subjectName],
            'Foundational subject for comprehensive learning'
          ));
        }
      });
    }

    return subjects.slice(0, 4); // Limit to 4 subjects for focus
  }

  private findBestSubjectMatch(searchTerm: string, availableSubjects: string[]): string | null {
    const searchLower = searchTerm.toLowerCase();
    
    // Exact match
    const exactMatch = availableSubjects.find(subject => 
      subject.toLowerCase() === searchLower
    );
    if (exactMatch) return exactMatch;

    // Partial match
    const partialMatch = availableSubjects.find(subject => 
      subject.toLowerCase().includes(searchLower) || 
      searchLower.includes(subject.toLowerCase())
    );
    if (partialMatch) return partialMatch;

    // Keyword match
    const subjectsData = this.knowledgeBase.get('subjects');
    for (const subject of availableSubjects) {
      const topics = subjectsData[subject]?.topics || {};
      for (const [topicName, topicData] of Object.entries(topics)) {
        const keywords = (topicData as any).keywords || [];
        if (keywords.some((keyword: string) => 
          searchLower.includes(keyword.toLowerCase()) || 
          keyword.toLowerCase().includes(searchLower)
        )) {
          return subject;
        }
      }
    }

    return null;
  }

  private createStudySubject(
    subjectName: string, 
    priority: 'high' | 'medium' | 'low', 
    userProfile: UserProfile, 
    subjectData: any,
    reasoning: string
  ): StudySubject {
    const topics = this.selectTopicsForSubject(subjectData, userProfile);
    
    return {
      name: subjectName,
      priority,
      timeAllocation: priority === 'high' ? 35 : priority === 'medium' ? 25 : 15,
      topics,
      reasoning
    };
  }

  private selectTopicsForSubject(subjectData: any, userProfile: UserProfile): Topic[] {
    const topics: Topic[] = [];
    const topicsData = subjectData.topics;
    const learningPattern = this.knowledgeBase.get('learning_patterns')[userProfile.learningStyle || 'visual'];
    
    // Sort topics by difficulty and relevance
    const sortedTopics = Object.entries(topicsData)
      .sort(([, a], [, b]) => (a as any).difficulty - (b as any).difficulty)
      .slice(0, 5); // Limit to 5 topics per subject

    sortedTopics.forEach(([topicName, topicInfo]: [string, any]) => {
      const adjustedDifficulty = topicInfo.difficulty * learningPattern.difficulty_adjustment;
      
      topics.push({
        name: topicName,
        difficulty: this.mapDifficultyToString(adjustedDifficulty),
        estimatedTime: Math.round(topicInfo.time * (userProfile.timeAvailable || 60) / 60),
        prerequisites: this.generatePrerequisites(topicName, topicsData),
        learningObjectives: this.generateLearningObjectives(topicName, topicInfo),
        resources: this.generateTopicResources(topicName, userProfile.learningStyle || 'visual'),
        assessments: this.generateTopicAssessments(topicName, adjustedDifficulty)
      });
    });

    return topics;
  }

  private generatePrerequisites(topicName: string, topicsData: any): string[] {
    const prerequisites: string[] = [];
    const currentDifficulty = topicsData[topicName]?.difficulty || 0;
    
    // Find easier topics as prerequisites
    Object.entries(topicsData).forEach(([name, data]: [string, any]) => {
      if (name !== topicName && data.difficulty < currentDifficulty - 0.2) {
        prerequisites.push(name);
      }
    });

    return prerequisites.slice(0, 2); // Limit to 2 prerequisites
  }

  private generateLearningObjectives(topicName: string, topicInfo: any): string[] {
    const objectives = [
      `Understand fundamental concepts of ${topicName}`,
      `Apply ${topicName} principles to solve problems`,
      `Analyze complex scenarios involving ${topicName}`
    ];

    if (topicInfo.category === 'advanced' || topicInfo.category === 'expert') {
      objectives.push(`Synthesize ${topicName} knowledge with other domains`);
    }

    return objectives;
  }

  private generateTopicResources(topicName: string, learningStyle: string): Resource[] {
    const learningPattern = this.knowledgeBase.get('learning_patterns')[learningStyle];
    const resources: Resource[] = [];

    learningPattern.content_types.forEach((contentType: string) => {
      resources.push({
        type: this.mapContentTypeToResourceType(contentType),
        title: `${topicName} - ${this.formatContentType(contentType)}`,
        description: `${this.formatContentType(contentType)} for ${topicName}`,
        estimatedTime: 30,
        difficulty: 'medium'
      });
    });

    return resources;
  }

  private generateTopicAssessments(topicName: string, difficulty: number): Assessment[] {
    const assessments: Assessment[] = [
      {
        type: 'quiz',
        title: `${topicName} - Knowledge Check`,
        questions: Math.round(8 + difficulty * 10),
        estimatedTime: Math.round(15 + difficulty * 15),
        passingScore: Math.round(70 + difficulty * 10)
      }
    ];

    if (difficulty > 0.6) {
      assessments.push({
        type: 'problem_set',
        title: `${topicName} - Problem Set`,
        questions: Math.round(5 + difficulty * 8),
        estimatedTime: Math.round(30 + difficulty * 20),
        passingScore: Math.round(65 + difficulty * 15)
      });
    }

    return assessments;
  }

  private generateMilestones(subjects: StudySubject[], userProfile: UserProfile): Milestone[] {
    const milestones: Milestone[] = [];
    const totalWeeks = Math.ceil(this.calculateOptimalDuration(subjects, userProfile) / 7);

    for (let week = 1; week <= Math.min(totalWeeks, 12); week++) {
      const subjectsThisWeek = subjects.slice(0, Math.ceil(subjects.length * week / totalWeeks));
      
      milestones.push({
        week,
        title: `Week ${week}: ${this.generateMilestoneTitle(week, subjectsThisWeek)}`,
        description: this.generateMilestoneDescription(week, subjectsThisWeek),
        successCriteria: this.generateSuccessCriteria(week, subjectsThisWeek),
        rewards: this.generateMilestoneRewards(week)
      });
    }

    return milestones;
  }

  private generateMilestoneTitle(week: number, subjects: StudySubject[]): string {
    if (week <= 2) return 'Foundation Building';
    if (week <= 4) return 'Core Concepts';
    if (week <= 8) return 'Advanced Applications';
    return 'Mastery & Integration';
  }

  private generateMilestoneDescription(week: number, subjects: StudySubject[]): string {
    const subjectNames = subjects.map(s => s.name).join(', ');
    return `Focus on ${subjectNames} with emphasis on ${this.generateMilestoneTitle(week, subjects).toLowerCase()}`;
  }

  private generateSuccessCriteria(week: number, subjects: StudySubject[]): string[] {
    const criteria = [
      `Complete ${week * 2} practice problems`,
      `Achieve ${Math.min(70 + week * 2, 90)}%+ accuracy on assessments`,
      `Study for ${Math.min(30 + week * 10, 90)} minutes daily`
    ];

    if (week > 4) {
      criteria.push('Apply concepts to real-world scenarios');
    }

    return criteria;
  }

  private generateAdaptiveFeatures(userProfile: UserProfile): AdaptiveFeature[] {
    const features = [
      {
        trigger: 'Low performance detected (< 70% accuracy)',
        action: 'Reduce difficulty and provide additional foundational content',
        description: 'Automatically adapts to your learning pace and provides extra support'
      },
      {
        trigger: 'High performance detected (> 90% accuracy)',
        action: 'Introduce more challenging content and advanced topics',
        description: 'Keeps you challenged and accelerates learning when ready'
      },
      {
        trigger: 'Inconsistent study pattern detected',
        action: 'Adjust schedule and send motivational reminders',
        description: 'Helps maintain consistent study habits and momentum'
      }
    ];

    if (userProfile.learningStyle === 'kinesthetic') {
      features.push({
        trigger: 'Extended reading sessions',
        action: 'Suggest interactive exercises and hands-on activities',
        description: 'Adapts content delivery to match your kinesthetic learning style'
      });
    }

    return features;
  }

  private generateRecommendations(userProfile: UserProfile, contentAnalysis: any): string[] {
    const recommendations = [
      'Maintain consistent daily study schedule for optimal retention',
      'Use active recall techniques instead of passive reading',
      'Take regular breaks using the Pomodoro Technique',
      'Review previous topics weekly to strengthen long-term memory'
    ];

    // Learning style specific recommendations
    const learningPattern = this.knowledgeBase.get('learning_patterns')[userProfile.learningStyle || 'visual'];
    recommendations.push(`Leverage ${learningPattern.preferences.join(', ')} for enhanced learning`);

    // Content-specific recommendations
    if (contentAnalysis?.complexity === 'high') {
      recommendations.push('Break down complex topics into smaller, manageable chunks');
    }

    if (userProfile.currentStreak < 7) {
      recommendations.push('Focus on building a consistent study habit before increasing intensity');
    }

    return recommendations;
  }

  private generatePlanTitle(userProfile: UserProfile, subjects: StudySubject[], contentAnalysis: any): string {
    const subjectNames = subjects.slice(0, 2).map(s => s.name).join(' & ');
    const focusArea = contentAnalysis?.primaryFocus || 'Comprehensive Learning';
    return `${userProfile.name}'s ${focusArea} Study Plan: ${subjectNames}`;
  }

  private generatePlanDescription(subjects: StudySubject[], userProfile: UserProfile, contentAnalysis: any): string {
    const subjectList = subjects.map(s => s.name).join(', ');
    const contentNote = contentAnalysis ? ' incorporating your uploaded materials' : '';
    return `A personalized study plan focusing on ${subjectList}, designed for ${userProfile.learningStyle} learners${contentNote}. This plan addresses your specific learning goals while building on your existing strengths.`;
  }

  private generateEstimatedOutcome(subjects: StudySubject[], userProfile: UserProfile): string {
    const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const timeFrame = this.calculateOptimalDuration(subjects, userProfile);
    return `Expected to master ${totalTopics} key topics across ${subjects.length} subjects within ${timeFrame} days, with significant improvement in identified focus areas and overall academic performance.`;
  }

  private calculateOptimalDuration(subjects: StudySubject[], userProfile: UserProfile): number {
    const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const baseTime = totalTopics * 3; // 3 days per topic
    const difficultyMultiplier = userProfile.level < 5 ? 1.3 : userProfile.level > 15 ? 0.8 : 1.0;
    return Math.max(21, Math.min(Math.round(baseTime * difficultyMultiplier), 90));
  }

  private determineDifficulty(userProfile: UserProfile): string {
    if (userProfile.level > 15 && userProfile.totalStars > 500) return 'Challenging';
    if (userProfile.level < 5 || userProfile.totalStars < 100) return 'Supportive';
    return 'Balanced';
  }

  private calculateConfidence(userProfile: UserProfile, subjects: StudySubject[], contentAnalysis: any): number {
    let confidence = 75;
    
    // Boost confidence based on user experience
    if (userProfile.currentStreak > 10) confidence += 8;
    if (userProfile.completedLessons > 50) confidence += 7;
    if (userProfile.level > 10) confidence += 5;
    
    // Adjust based on content analysis
    if (contentAnalysis?.clarity === 'high') confidence += 5;
    if (contentAnalysis?.complexity === 'low') confidence += 3;
    
    // Adjust based on subject difficulty
    const avgDifficulty = subjects.reduce((sum, s) => 
      sum + s.topics.reduce((topicSum, t) => topicSum + this.mapStringToNumericDifficulty(t.difficulty), 0) / s.topics.length, 0
    ) / subjects.length;
    
    confidence -= Math.round(avgDifficulty * 10);
    
    return Math.max(60, Math.min(95, confidence));
  }

  private generateGenericContent(subject: string, topic: string, difficulty: string, learningStyle: string): any {
    return {
      type: 'theory',
      title: `${topic} Fundamentals`,
      question: `What are the key concepts in ${topic}?`,
      options: [
        'Fundamental principles and applications',
        'Advanced theoretical frameworks',
        'Practical implementation strategies',
        'Integration with related topics'
      ],
      correct: 0,
      explanation: `${topic} involves understanding core principles and their practical applications in ${subject}.`,
      hint: `Focus on the fundamental concepts first before moving to advanced applications.`,
      points: 10,
      difficulty: difficulty.toLowerCase(),
      concepts: [topic, subject, 'Problem Solving'],
      visualAid: `${topic.toLowerCase()}_diagram`,
      audioExplanation: 'Available',
      interactiveElement: 'concept_builder'
    };
  }

  private generateSpecificContent(subject: string, topic: string, difficulty: string, learningStyle: string, topicData: any): any {
    const keywords = topicData.keywords || [];
    const category = topicData.category || 'foundation';
    
    return {
      type: category === 'foundation' ? 'theory' : 'application',
      title: `${topic} - ${category.charAt(0).toUpperCase() + category.slice(1)} Level`,
      question: `How do ${keywords.slice(0, 2).join(' and ')} relate to ${topic}?`,
      options: [
        `They are fundamental components of ${topic}`,
        `They are advanced applications of ${topic}`,
        `They are prerequisites for understanding ${topic}`,
        `They are related but separate concepts`
      ],
      correct: 0,
      explanation: `In ${topic}, ${keywords.slice(0, 2).join(' and ')} serve as key building blocks that help understand the broader concepts and applications.`,
      hint: `Consider how ${keywords[0]} connects to the main principles of ${topic}.`,
      points: Math.round(topicData.difficulty * 20),
      difficulty: difficulty.toLowerCase(),
      concepts: [topic, ...keywords.slice(0, 3)],
      visualAid: `${topic.toLowerCase()}_${learningStyle}_aid`,
      audioExplanation: 'Available',
      interactiveElement: this.getInteractiveElement(learningStyle, topic)
    };
  }

  private getInteractiveElement(learningStyle: string, topic: string): string {
    const elements = {
      'visual': 'interactive_diagram',
      'auditory': 'audio_explanation',
      'kinesthetic': 'hands_on_simulation',
      'reading': 'detailed_text_analysis'
    };
    return elements[learningStyle as keyof typeof elements] || 'concept_builder';
  }

  private mapDifficultyToString(difficulty: number): string {
    if (difficulty < 0.4) return 'Beginner';
    if (difficulty < 0.7) return 'Intermediate';
    if (difficulty < 0.9) return 'Advanced';
    return 'Expert';
  }

  private mapStringToNumericDifficulty(difficulty: string): number {
    const map = { 'Beginner': 0.3, 'Intermediate': 0.6, 'Advanced': 0.8, 'Expert': 0.95 };
    return map[difficulty as keyof typeof map] || 0.5;
  }

  private mapContentTypeToResourceType(contentType: string): Resource['type'] {
    const map = {
      'interactive_visualization': 'interactive',
      'concept_mapping': 'interactive',
      'flowcharts': 'interactive',
      'audio_content': 'video',
      'discussion_prompts': 'article',
      'verbal_explanations': 'video',
      'interactive_simulations': 'simulation',
      'lab_exercises': 'simulation',
      'problem_solving': 'practice',
      'comprehensive_guides': 'article',
      'detailed_explanations': 'article',
      'case_studies': 'article'
    };
    return map[contentType as keyof typeof map] || 'article';
  }

  private formatContentType(contentType: string): string {
    return contentType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private generateMilestoneRewards(week: number): string[] {
    const baseRewards = [`${week * 15} bonus stars`, 'Progress badge'];
    
    if (week % 2 === 0) {
      baseRewards.push('Study streak bonus');
    }
    
    if (week % 4 === 0) {
      baseRewards.push('Special achievement unlock');
    }
    
    if (week >= 8) {
      baseRewards.push('Mastery certificate');
    }
    
    return baseRewards;
  }
}

// Content Analysis Engine
class ContentAnalyzer {
  private subjectKeywords: Map<string, string[]>;

  constructor() {
    this.subjectKeywords = new Map([
      ['Mathematics', ['equation', 'formula', 'theorem', 'proof', 'calculus', 'algebra', 'geometry', 'statistics', 'derivative', 'integral']],
      ['Physics', ['force', 'energy', 'momentum', 'wave', 'particle', 'quantum', 'relativity', 'thermodynamics', 'electromagnetic', 'mechanics']],
      ['Chemistry', ['molecule', 'atom', 'reaction', 'bond', 'organic', 'inorganic', 'catalyst', 'equilibrium', 'acid', 'base']],
      ['Biology', ['cell', 'DNA', 'protein', 'evolution', 'genetics', 'organism', 'ecosystem', 'metabolism', 'enzyme', 'membrane']],
      ['Computer Science', ['algorithm', 'data structure', 'programming', 'software', 'database', 'network', 'machine learning', 'artificial intelligence']],
      ['Literature', ['narrative', 'character', 'theme', 'metaphor', 'symbolism', 'plot', 'poetry', 'prose', 'analysis', 'interpretation']],
      ['History', ['civilization', 'empire', 'revolution', 'war', 'culture', 'society', 'political', 'economic', 'social', 'timeline']]
    ]);
  }

  public analyzeContent(content: string): any {
    const words = content.toLowerCase().split(/\s+/);
    const detectedSubjects: string[] = [];
    const subjectScores = new Map<string, number>();

    // Analyze subject relevance
    for (const [subject, keywords] of this.subjectKeywords) {
      let score = 0;
      keywords.forEach(keyword => {
        const occurrences = words.filter(word => word.includes(keyword)).length;
        score += occurrences;
      });
      
      if (score > 0) {
        subjectScores.set(subject, score);
      }
    }

    // Sort subjects by relevance
    const sortedSubjects = Array.from(subjectScores.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([subject]) => subject);

    return {
      detectedSubjects: sortedSubjects,
      primaryFocus: sortedSubjects[0] || 'General Studies',
      complexity: this.analyzeComplexity(content),
      clarity: this.analyzeClarity(content),
      wordCount: words.length,
      keyTopics: this.extractKeyTopics(content, sortedSubjects[0])
    };
  }

  private analyzeComplexity(content: string): 'low' | 'medium' | 'high' {
    const complexWords = content.split(/\s+/).filter(word => word.length > 8).length;
    const totalWords = content.split(/\s+/).length;
    const complexityRatio = complexWords / totalWords;

    if (complexityRatio > 0.3) return 'high';
    if (complexityRatio > 0.15) return 'medium';
    return 'low';
  }

  private analyzeClarity(content: string): 'low' | 'medium' | 'high' {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = content.split(/\s+/).length / sentences.length;

    if (avgSentenceLength > 25) return 'low';
    if (avgSentenceLength > 15) return 'medium';
    return 'high';
  }

  private extractKeyTopics(content: string, primarySubject: string): string[] {
    if (!primarySubject) return [];

    const keywords = this.subjectKeywords.get(primarySubject) || [];
    const foundTopics: string[] = [];

    keywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        foundTopics.push(keyword);
      }
    });

    return foundTopics.slice(0, 5);
  }
}

// Export singleton instance
export const aiEngine = new AIStudyPlanEngine();