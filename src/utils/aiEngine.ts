// Enhanced AI Engine with OpenAI Integration
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
  private fallbackEngine: FallbackEngine;

  constructor() {
    this.fallbackEngine = new FallbackEngine();
  }

  public async generateStudyPlan(userProfile: UserProfile, goals: string[] = []): Promise<StudyPlan> {
    console.log('🤖 AI Engine: Starting study plan generation for:', userProfile.name);
    
    try {
      // Check if OpenAI API key is available
      const hasOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY && 
                           import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';

      if (hasOpenAIKey) {
        console.log('🔑 Using OpenAI API for enhanced study plan generation');
        return await this.generateWithOpenAI(userProfile, goals);
      } else {
        console.log('⚡ Using fallback AI engine (OpenAI key not configured)');
        return this.fallbackEngine.generateStudyPlan(userProfile, goals);
      }
    } catch (error) {
      console.error('❌ OpenAI generation failed, falling back to local engine:', error);
      return this.fallbackEngine.generateStudyPlan(userProfile, goals);
    }
  }

  private async generateWithOpenAI(userProfile: UserProfile, goals: string[]): Promise<StudyPlan> {
    const request: OpenAIStudyPlanRequest = {
      userProfile: {
        name: userProfile.name,
        level: userProfile.level,
        weakAreas: userProfile.weakAreas,
        strongAreas: userProfile.strongAreas,
        learningStyle: userProfile.learningStyle || 'visual',
        studyGoals: userProfile.studyGoals || [],
        timeAvailable: userProfile.timeAvailable || 60
      },
      goals
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
        return this.fallbackEngine.generateStudyContent(subject, topic, difficulty, learningStyle);
      }
    } catch (error) {
      console.error('Content generation failed, using fallback:', error);
      return this.fallbackEngine.generateStudyContent(subject, topic, difficulty, learningStyle);
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

// Fallback engine for when OpenAI is not available
class FallbackEngine {
  private knowledgeBase: Map<string, any>;

  constructor() {
    this.knowledgeBase = new Map();
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    this.knowledgeBase.set('subjects', {
      'Mathematics': {
        topics: {
          'Algebra': { difficulty: 0.3, time: 45, category: 'foundation' },
          'Calculus': { difficulty: 0.8, time: 60, category: 'advanced' },
          'Linear Algebra': { difficulty: 0.7, time: 50, category: 'advanced' },
          'Statistics': { difficulty: 0.5, time: 40, category: 'intermediate' },
          'Differential Equations': { difficulty: 0.9, time: 70, category: 'expert' },
          'Geometry': { difficulty: 0.4, time: 35, category: 'foundation' }
        }
      },
      'Physics': {
        topics: {
          'Mechanics': { difficulty: 0.6, time: 50, category: 'foundation' },
          'Thermodynamics': { difficulty: 0.7, time: 55, category: 'intermediate' },
          'Electromagnetism': { difficulty: 0.8, time: 65, category: 'advanced' },
          'Quantum Mechanics': { difficulty: 0.95, time: 80, category: 'expert' },
          'Optics': { difficulty: 0.5, time: 40, category: 'intermediate' }
        }
      },
      'Chemistry': {
        topics: {
          'General Chemistry': { difficulty: 0.4, time: 45, category: 'foundation' },
          'Organic Chemistry': { difficulty: 0.8, time: 65, category: 'advanced' },
          'Physical Chemistry': { difficulty: 0.85, time: 70, category: 'advanced' },
          'Analytical Chemistry': { difficulty: 0.6, time: 50, category: 'intermediate' }
        }
      },
      'Biology': {
        topics: {
          'Cell Biology': { difficulty: 0.5, time: 45, category: 'foundation' },
          'Genetics': { difficulty: 0.7, time: 55, category: 'intermediate' },
          'Molecular Biology': { difficulty: 0.8, time: 65, category: 'advanced' },
          'Ecology': { difficulty: 0.6, time: 50, category: 'intermediate' }
        }
      },
      'Computer Science': {
        topics: {
          'Programming Fundamentals': { difficulty: 0.5, time: 60, category: 'foundation' },
          'Data Structures': { difficulty: 0.7, time: 70, category: 'intermediate' },
          'Algorithms': { difficulty: 0.8, time: 75, category: 'advanced' },
          'Machine Learning': { difficulty: 0.85, time: 80, category: 'advanced' }
        }
      }
    });
  }

  public generateStudyPlan(userProfile: UserProfile, goals: string[] = []): StudyPlan {
    const subjects = this.selectOptimalSubjects(userProfile, goals);
    const milestones = this.generateMilestones(subjects, userProfile);
    const adaptiveFeatures = this.generateAdaptiveFeatures(userProfile);
    const recommendations = this.generateRecommendations(userProfile);

    return {
      id: `plan_${Date.now()}`,
      title: `Personalized Study Plan for ${userProfile.name}`,
      description: `A comprehensive study plan focusing on ${subjects.map(s => s.name).join(', ')}, designed to address your learning goals while building on your strengths.`,
      duration: this.calculateOptimalDuration(subjects, userProfile),
      dailyTimeCommitment: userProfile.timeAvailable || 60,
      difficulty: this.determineDifficulty(userProfile),
      subjects,
      milestones,
      adaptiveFeatures,
      personalizedRecommendations: recommendations,
      estimatedOutcome: `Expected to master ${subjects.reduce((sum, s) => sum + s.topics.length, 0)} key topics with significant improvement in focus areas.`,
      confidence: this.calculateConfidence(userProfile, subjects)
    };
  }

  public generateStudyContent(subject: string, topic: string, difficulty: string, learningStyle: string): any {
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

  private selectOptimalSubjects(userProfile: UserProfile, goals: string[]): StudySubject[] {
    const subjects: StudySubject[] = [];
    const subjectsData = this.knowledgeBase.get('subjects');
    const availableSubjects = Object.keys(subjectsData);

    // Add subjects based on weak areas
    userProfile.weakAreas.forEach(weakArea => {
      const matchingSubject = availableSubjects.find(subject => 
        subject.toLowerCase().includes(weakArea.toLowerCase()) || 
        weakArea.toLowerCase().includes(subject.toLowerCase())
      );
      
      if (matchingSubject && subjectsData[matchingSubject]) {
        subjects.push(this.createStudySubject(matchingSubject, 'high', userProfile, subjectsData[matchingSubject]));
      }
    });

    // Add default subjects if none found
    if (subjects.length === 0) {
      const defaultSubjects = ['Mathematics', 'Physics'];
      defaultSubjects.forEach(subjectName => {
        if (subjectsData[subjectName]) {
          subjects.push(this.createStudySubject(subjectName, 'medium', userProfile, subjectsData[subjectName]));
        }
      });
    }

    return subjects.slice(0, 3);
  }

  private createStudySubject(subjectName: string, priority: 'high' | 'medium' | 'low', userProfile: UserProfile, subjectData: any): StudySubject {
    const topics = this.selectTopicsForSubject(subjectData, userProfile);
    
    return {
      name: subjectName,
      priority,
      timeAllocation: priority === 'high' ? 40 : priority === 'medium' ? 30 : 20,
      topics,
      reasoning: `${subjectName} is included to address your learning goals and strengthen foundational knowledge.`
    };
  }

  private selectTopicsForSubject(subjectData: any, userProfile: UserProfile): Topic[] {
    const topics: Topic[] = [];
    const topicsData = subjectData.topics;
    
    Object.entries(topicsData).slice(0, 4).forEach(([topicName, topicInfo]: [string, any]) => {
      topics.push({
        name: topicName,
        difficulty: this.mapDifficultyToString(topicInfo.difficulty),
        estimatedTime: topicInfo.time,
        prerequisites: [],
        learningObjectives: [`Understand ${topicName} concepts`, `Apply ${topicName} principles`],
        resources: [{
          type: 'article',
          title: `${topicName} Guide`,
          description: `Comprehensive guide to ${topicName}`,
          estimatedTime: 30,
          difficulty: 'medium'
        }],
        assessments: [{
          type: 'quiz',
          title: `${topicName} Quiz`,
          questions: 10,
          estimatedTime: 20,
          passingScore: 75
        }]
      });
    });

    return topics;
  }

  private generateMilestones(subjects: StudySubject[], userProfile: UserProfile): Milestone[] {
    const milestones: Milestone[] = [];
    const totalWeeks = Math.ceil(this.calculateOptimalDuration(subjects, userProfile) / 7);

    for (let week = 1; week <= Math.min(totalWeeks, 8); week++) {
      milestones.push({
        week,
        title: `Week ${week} Milestone`,
        description: `Complete foundational topics and assessments`,
        successCriteria: [`Complete ${week * 2} practice problems`, 'Achieve 80%+ accuracy'],
        rewards: [`${week * 10} bonus stars`, 'Progress badge']
      });
    }

    return milestones;
  }

  private generateAdaptiveFeatures(userProfile: UserProfile): AdaptiveFeature[] {
    return [
      {
        trigger: 'Low performance detected',
        action: 'Adjust difficulty and provide additional support',
        description: 'Automatically adapts to your learning pace'
      },
      {
        trigger: 'High performance detected',
        action: 'Introduce more challenging content',
        description: 'Keeps you challenged and engaged'
      }
    ];
  }

  private generateRecommendations(userProfile: UserProfile): string[] {
    return [
      'Maintain consistent daily study schedule',
      'Focus on understanding concepts before memorization',
      'Use active recall and spaced repetition techniques',
      'Take regular breaks to maintain focus'
    ];
  }

  private calculateOptimalDuration(subjects: StudySubject[], userProfile: UserProfile): number {
    const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    return Math.max(21, Math.min(totalTopics * 3, 60));
  }

  private determineDifficulty(userProfile: UserProfile): string {
    if (userProfile.level > 15) return 'Challenging';
    if (userProfile.level < 5) return 'Supportive';
    return 'Balanced';
  }

  private calculateConfidence(userProfile: UserProfile, subjects: StudySubject[]): number {
    let confidence = 75;
    if (userProfile.currentStreak > 10) confidence += 10;
    if (userProfile.completedLessons > 50) confidence += 10;
    return Math.min(95, confidence);
  }

  private mapDifficultyToString(difficulty: number): string {
    if (difficulty < 0.4) return 'Beginner';
    if (difficulty < 0.7) return 'Intermediate';
    if (difficulty < 0.9) return 'Advanced';
    return 'Expert';
  }
}

// Export singleton instance
export const aiEngine = new AIStudyPlanEngine();