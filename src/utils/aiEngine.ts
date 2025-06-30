// AI Engine for Study Plan Generation
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
  private knowledgeBase: Map<string, any>;
  private learningPatterns: Map<string, any>;
  private difficultyMatrix: Map<string, number>;

  constructor() {
    this.knowledgeBase = new Map();
    this.learningPatterns = new Map();
    this.difficultyMatrix = new Map();
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    // Enhanced subject knowledge base with more comprehensive topics
    this.knowledgeBase.set('subjects', {
      'Mathematics': {
        topics: {
          'Algebra': { difficulty: 0.3, prerequisites: ['Basic Arithmetic'], time: 45, category: 'foundation' },
          'Calculus': { difficulty: 0.8, prerequisites: ['Algebra', 'Trigonometry'], time: 60, category: 'advanced' },
          'Linear Algebra': { difficulty: 0.7, prerequisites: ['Algebra'], time: 50, category: 'advanced' },
          'Statistics': { difficulty: 0.5, prerequisites: ['Algebra'], time: 40, category: 'intermediate' },
          'Differential Equations': { difficulty: 0.9, prerequisites: ['Calculus'], time: 70, category: 'expert' },
          'Geometry': { difficulty: 0.4, prerequisites: ['Basic Math'], time: 35, category: 'foundation' },
          'Trigonometry': { difficulty: 0.6, prerequisites: ['Algebra'], time: 45, category: 'intermediate' }
        },
        learningStyles: {
          visual: ['interactive_graphs', 'geometric_visualization', 'step_by_step_diagrams'],
          auditory: ['verbal_explanations', 'discussion_groups', 'audio_lectures'],
          kinesthetic: ['hands_on_problems', 'manipulatives', 'real_world_applications'],
          reading: ['textbook_study', 'written_proofs', 'formula_derivations']
        }
      },
      'Physics': {
        topics: {
          'Mechanics': { difficulty: 0.6, prerequisites: ['Basic Math'], time: 50, category: 'foundation' },
          'Thermodynamics': { difficulty: 0.7, prerequisites: ['Mechanics'], time: 55, category: 'intermediate' },
          'Electromagnetism': { difficulty: 0.8, prerequisites: ['Calculus', 'Mechanics'], time: 65, category: 'advanced' },
          'Quantum Mechanics': { difficulty: 0.95, prerequisites: ['Calculus', 'Linear Algebra'], time: 80, category: 'expert' },
          'Optics': { difficulty: 0.5, prerequisites: ['Basic Physics'], time: 40, category: 'intermediate' },
          'Waves and Sound': { difficulty: 0.6, prerequisites: ['Mechanics'], time: 45, category: 'intermediate' },
          'Modern Physics': { difficulty: 0.85, prerequisites: ['Electromagnetism'], time: 70, category: 'advanced' }
        },
        learningStyles: {
          visual: ['physics_simulations', 'lab_demonstrations', 'concept_animations'],
          auditory: ['physics_lectures', 'problem_discussions', 'concept_explanations'],
          kinesthetic: ['lab_experiments', 'building_models', 'hands_on_activities'],
          reading: ['theory_study', 'problem_solving', 'research_papers']
        }
      },
      'Chemistry': {
        topics: {
          'General Chemistry': { difficulty: 0.4, prerequisites: ['Basic Math'], time: 45, category: 'foundation' },
          'Organic Chemistry': { difficulty: 0.8, prerequisites: ['General Chemistry'], time: 65, category: 'advanced' },
          'Physical Chemistry': { difficulty: 0.85, prerequisites: ['Calculus', 'General Chemistry'], time: 70, category: 'advanced' },
          'Analytical Chemistry': { difficulty: 0.6, prerequisites: ['General Chemistry'], time: 50, category: 'intermediate' },
          'Biochemistry': { difficulty: 0.7, prerequisites: ['Organic Chemistry'], time: 60, category: 'advanced' },
          'Inorganic Chemistry': { difficulty: 0.65, prerequisites: ['General Chemistry'], time: 55, category: 'intermediate' }
        },
        learningStyles: {
          visual: ['molecular_models', '3d_structures', 'reaction_mechanisms', 'periodic_table_visualization'],
          auditory: ['verbal_explanations', 'group_discussions', 'concept_lectures'],
          kinesthetic: ['lab_work', 'model_building', 'hands_on_experiments'],
          reading: ['textbook_study', 'research_papers', 'chemical_literature']
        }
      },
      'Biology': {
        topics: {
          'Cell Biology': { difficulty: 0.5, prerequisites: ['Basic Science'], time: 45, category: 'foundation' },
          'Genetics': { difficulty: 0.7, prerequisites: ['Cell Biology'], time: 55, category: 'intermediate' },
          'Molecular Biology': { difficulty: 0.8, prerequisites: ['Genetics', 'Chemistry'], time: 65, category: 'advanced' },
          'Ecology': { difficulty: 0.6, prerequisites: ['Basic Biology'], time: 50, category: 'intermediate' },
          'Evolution': { difficulty: 0.65, prerequisites: ['Genetics'], time: 50, category: 'intermediate' },
          'Anatomy': { difficulty: 0.7, prerequisites: ['Cell Biology'], time: 60, category: 'intermediate' }
        },
        learningStyles: {
          visual: ['biological_diagrams', 'microscopy', 'anatomical_models'],
          auditory: ['biology_lectures', 'case_discussions', 'verbal_explanations'],
          kinesthetic: ['lab_experiments', 'dissections', 'field_work'],
          reading: ['textbook_study', 'research_papers', 'case_studies']
        }
      },
      'Computer Science': {
        topics: {
          'Programming Fundamentals': { difficulty: 0.5, prerequisites: ['Basic Logic'], time: 60, category: 'foundation' },
          'Data Structures': { difficulty: 0.7, prerequisites: ['Programming Fundamentals'], time: 70, category: 'intermediate' },
          'Algorithms': { difficulty: 0.8, prerequisites: ['Data Structures'], time: 75, category: 'advanced' },
          'Database Systems': { difficulty: 0.6, prerequisites: ['Programming Fundamentals'], time: 55, category: 'intermediate' },
          'Machine Learning': { difficulty: 0.85, prerequisites: ['Statistics', 'Programming'], time: 80, category: 'advanced' },
          'Web Development': { difficulty: 0.6, prerequisites: ['Programming Fundamentals'], time: 65, category: 'intermediate' }
        },
        learningStyles: {
          visual: ['code_visualization', 'flowcharts', 'algorithm_animations'],
          auditory: ['coding_lectures', 'peer_programming', 'technical_discussions'],
          kinesthetic: ['hands_on_coding', 'project_building', 'interactive_coding'],
          reading: ['documentation_study', 'code_reading', 'technical_articles']
        }
      }
    });

    // Learning pattern analysis
    this.learningPatterns.set('performance_indicators', {
      struggling: { accuracy: 60, speed: 0.5, consistency: 50 },
      average: { accuracy: 75, speed: 1.0, consistency: 70 },
      excelling: { accuracy: 90, speed: 1.5, consistency: 85 }
    });

    // Difficulty progression rules
    this.difficultyMatrix.set('progression', {
      easy: { nextLevel: 'medium', threshold: 85 },
      medium: { nextLevel: 'hard', threshold: 80 },
      hard: { nextLevel: 'expert', threshold: 75 }
    });
  }

  public generateStudyPlan(userProfile: UserProfile, goals: string[] = []): StudyPlan {
    console.log('🤖 AI Engine: Starting study plan generation for:', userProfile.name);
    
    try {
      // Analyze user's current state
      const userAnalysis = this.analyzeUserProfile(userProfile);
      console.log('📊 User analysis completed:', userAnalysis);
      
      // Determine optimal subjects and topics
      const subjects = this.selectOptimalSubjects(userProfile, userAnalysis, goals);
      console.log('📚 Selected subjects:', subjects.map(s => s.name));
      
      // Generate adaptive milestones
      const milestones = this.generateMilestones(subjects, userProfile);
      
      // Create adaptive features
      const adaptiveFeatures = this.generateAdaptiveFeatures(userProfile, userAnalysis);
      
      // Generate personalized recommendations
      const recommendations = this.generateRecommendations(userProfile, userAnalysis);
      
      // Calculate confidence score
      const confidence = this.calculateConfidence(userProfile, subjects);

      const studyPlan: StudyPlan = {
        id: `plan_${Date.now()}`,
        title: this.generatePlanTitle(userProfile, userAnalysis),
        description: this.generatePlanDescription(userProfile, subjects),
        duration: this.calculateOptimalDuration(subjects, userProfile),
        dailyTimeCommitment: userProfile.timeAvailable || this.recommendDailyTime(userProfile),
        difficulty: this.determineDifficulty(userProfile, userAnalysis),
        subjects,
        milestones,
        adaptiveFeatures,
        personalizedRecommendations: recommendations,
        estimatedOutcome: this.predictOutcome(userProfile, subjects),
        confidence
      };

      console.log('✅ AI Engine: Study plan generated successfully with', confidence, '% confidence');
      return studyPlan;
    } catch (error) {
      console.error('❌ AI Engine: Error generating study plan:', error);
      throw new Error(`Study plan generation failed: ${error}`);
    }
  }

  private analyzeUserProfile(profile: UserProfile) {
    const performanceLevel = this.assessPerformanceLevel(profile);
    const learningVelocity = this.calculateLearningVelocity(profile);
    const motivationLevel = this.assessMotivation(profile);
    const knowledgeGaps = this.identifyKnowledgeGaps(profile);
    const strengths = this.identifyStrengths(profile);

    return {
      performanceLevel,
      learningVelocity,
      motivationLevel,
      knowledgeGaps,
      strengths,
      recommendedIntensity: this.calculateRecommendedIntensity(performanceLevel, motivationLevel)
    };
  }

  private assessPerformanceLevel(profile: UserProfile): 'struggling' | 'average' | 'excelling' {
    if (!profile.recentPerformance) {
      // Fallback to basic metrics
      const completionRate = profile.completedLessons / Math.max(profile.level * 10, 1);
      const starRate = profile.totalStars / Math.max(profile.studyTime / 60, 1);
      
      if (completionRate < 0.6 || starRate < 5) return 'struggling';
      if (completionRate > 0.9 && starRate > 15) return 'excelling';
      return 'average';
    }

    const { accuracy, consistency } = profile.recentPerformance;
    const patterns = this.learningPatterns.get('performance_indicators');
    
    if (accuracy >= patterns.excelling.accuracy && consistency >= patterns.excelling.consistency) {
      return 'excelling';
    } else if (accuracy <= patterns.struggling.accuracy || consistency <= patterns.struggling.consistency) {
      return 'struggling';
    }
    return 'average';
  }

  private calculateLearningVelocity(profile: UserProfile): number {
    const hoursStudied = profile.studyTime / 60;
    return hoursStudied > 0 ? profile.completedLessons / hoursStudied : 0.5;
  }

  private assessMotivation(profile: UserProfile): 'low' | 'medium' | 'high' {
    const streakScore = Math.min(profile.currentStreak / 30, 1);
    const consistencyScore = profile.studyTime > 0 ? 1 : 0;
    const engagementScore = profile.recentPerformance?.engagement || 50;
    
    const motivationScore = (streakScore * 0.4 + consistencyScore * 0.3 + engagementScore / 100 * 0.3);
    
    if (motivationScore > 0.7) return 'high';
    if (motivationScore < 0.4) return 'low';
    return 'medium';
  }

  private identifyKnowledgeGaps(profile: UserProfile): string[] {
    const gaps: string[] = [];
    const subjects = this.knowledgeBase.get('subjects');
    
    profile.weakAreas.forEach(area => {
      if (subjects[area]) {
        const topics = Object.keys(subjects[area].topics);
        gaps.push(...topics.filter(topic => {
          const topicData = subjects[area].topics[topic];
          return topicData.difficulty > 0.6;
        }));
      } else {
        gaps.push(area);
      }
    });
    
    return gaps;
  }

  private identifyStrengths(profile: UserProfile): string[] {
    return profile.strongAreas;
  }

  private calculateRecommendedIntensity(performance: string, motivation: string): 'light' | 'moderate' | 'intensive' {
    if (performance === 'excelling' && motivation === 'high') return 'intensive';
    if (performance === 'struggling' || motivation === 'low') return 'light';
    return 'moderate';
  }

  private selectOptimalSubjects(profile: UserProfile, analysis: any, goals: string[]): StudySubject[] {
    const subjects: StudySubject[] = [];
    const subjectsData = this.knowledgeBase.get('subjects');
    const availableSubjects = Object.keys(subjectsData);
    
    // Prioritize weak areas for improvement
    profile.weakAreas.forEach(weakArea => {
      const matchingSubject = availableSubjects.find(subject => 
        subject.toLowerCase().includes(weakArea.toLowerCase()) || 
        weakArea.toLowerCase().includes(subject.toLowerCase())
      );
      
      if (matchingSubject && subjectsData[matchingSubject]) {
        subjects.push(this.createStudySubject(matchingSubject, 'high', profile, analysis, subjectsData[matchingSubject]));
      }
    });

    // Add goal-based subjects
    goals.forEach(goal => {
      const matchingSubject = availableSubjects.find(subject => 
        goal.toLowerCase().includes(subject.toLowerCase()) ||
        this.findSubjectByKeywords(goal, subject)
      );
      
      if (matchingSubject && !subjects.find(s => s.name === matchingSubject)) {
        subjects.push(this.createStudySubject(matchingSubject, 'medium', profile, analysis, subjectsData[matchingSubject]));
      }
    });

    // Add strong areas for maintenance (lower priority)
    profile.strongAreas.slice(0, 2).forEach(strongArea => {
      const matchingSubject = availableSubjects.find(subject => 
        subject.toLowerCase().includes(strongArea.toLowerCase()) || 
        strongArea.toLowerCase().includes(subject.toLowerCase())
      );
      
      if (matchingSubject && !subjects.find(s => s.name === matchingSubject)) {
        subjects.push(this.createStudySubject(matchingSubject, 'low', profile, analysis, subjectsData[matchingSubject]));
      }
    });

    // If no subjects found, add default subjects based on level
    if (subjects.length === 0) {
      const defaultSubjects = this.getDefaultSubjects(profile.level);
      defaultSubjects.forEach(subjectName => {
        if (subjectsData[subjectName]) {
          subjects.push(this.createStudySubject(subjectName, 'medium', profile, analysis, subjectsData[subjectName]));
        }
      });
    }

    return subjects.slice(0, 4); // Limit to 4 subjects max
  }

  private findSubjectByKeywords(goal: string, subject: string): boolean {
    const keywords = {
      'Mathematics': ['math', 'calculus', 'algebra', 'statistics', 'geometry'],
      'Physics': ['physics', 'mechanics', 'quantum', 'thermodynamics'],
      'Chemistry': ['chemistry', 'organic', 'biochemistry', 'molecular'],
      'Biology': ['biology', 'genetics', 'ecology', 'anatomy'],
      'Computer Science': ['programming', 'coding', 'software', 'algorithms', 'data']
    };
    
    const subjectKeywords = keywords[subject as keyof typeof keywords] || [];
    return subjectKeywords.some(keyword => goal.toLowerCase().includes(keyword));
  }

  private getDefaultSubjects(level: number): string[] {
    if (level <= 5) return ['Mathematics', 'Physics'];
    if (level <= 10) return ['Mathematics', 'Physics', 'Chemistry'];
    return ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  }

  private createStudySubject(subjectName: string, priority: 'high' | 'medium' | 'low', profile: UserProfile, analysis: any, subjectData: any): StudySubject {
    const topics = this.selectTopicsForSubject(subjectData, profile, analysis);
    const timeAllocation = this.calculateTimeAllocation(priority, topics.length);
    
    return {
      name: subjectName,
      priority,
      timeAllocation,
      topics,
      reasoning: this.generateSubjectReasoning(subjectName, priority, profile, analysis)
    };
  }

  private generateSubjectReasoning(subjectName: string, priority: 'high' | 'medium' | 'low', profile: UserProfile, analysis: any): string {
    const reasons: string[] = [];
    
    if (priority === 'high') {
      if (profile.weakAreas.some(area => area.toLowerCase().includes(subjectName.toLowerCase()))) {
        reasons.push(`${subjectName} is identified as a weak area requiring focused improvement`);
      }
      reasons.push('High priority due to fundamental importance for your learning goals');
    } else if (priority === 'medium') {
      reasons.push(`${subjectName} supports your overall academic development`);
    } else {
      if (profile.strongAreas.some(area => area.toLowerCase().includes(subjectName.toLowerCase()))) {
        reasons.push(`${subjectName} is a strength area that needs maintenance to prevent skill decay`);
      }
      reasons.push('Lower priority but important for comprehensive knowledge');
    }

    if (analysis.performanceLevel === 'struggling') {
      reasons.push('Adjusted difficulty to build confidence and solid foundations');
    } else if (analysis.performanceLevel === 'excelling') {
      reasons.push('Enhanced with challenging content to maximize your potential');
    }

    if (profile.learningStyle) {
      reasons.push(`Tailored resources match your ${profile.learningStyle} learning preference`);
    }

    return reasons.join('. ') + '.';
  }

  private selectTopicsForSubject(subjectData: any, profile: UserProfile, analysis: any): Topic[] {
    const topics: Topic[] = [];
    const topicsData = subjectData.topics;
    const learningStyle = profile.learningStyle || 'visual';
    
    Object.entries(topicsData).forEach(([topicName, topicInfo]: [string, any]) => {
      const isAppropriate = this.isTopicAppropriate(topicInfo, profile, analysis);
      
      if (isAppropriate) {
        topics.push({
          name: topicName,
          difficulty: this.mapDifficultyToString(topicInfo.difficulty),
          estimatedTime: topicInfo.time,
          prerequisites: topicInfo.prerequisites,
          learningObjectives: this.generateLearningObjectives(topicName, topicInfo),
          resources: this.generateResources(topicName, learningStyle, subjectData),
          assessments: this.generateAssessments(topicName, topicInfo)
        });
      }
    });

    return topics.slice(0, 6);
  }

  private isTopicAppropriate(topicInfo: any, profile: UserProfile, analysis: any): boolean {
    const userLevel = Math.min(profile.level / 20, 1);
    const difficultyGap = Math.abs(topicInfo.difficulty - userLevel);
    
    if (analysis.performanceLevel === 'excelling') {
      return difficultyGap <= 0.4;
    } else if (analysis.performanceLevel === 'struggling') {
      return topicInfo.difficulty <= userLevel + 0.2;
    }
    return difficultyGap <= 0.3;
  }

  private generateLearningObjectives(topicName: string, topicInfo: any): string[] {
    const objectives = [
      `Understand fundamental concepts of ${topicName}`,
      `Apply ${topicName} principles to solve problems`,
      `Analyze complex scenarios using ${topicName} knowledge`
    ];

    if (topicInfo.difficulty > 0.7) {
      objectives.push(`Master advanced ${topicName} techniques`);
      objectives.push(`Synthesize ${topicName} with other subject areas`);
    }

    return objectives;
  }

  private generateResources(topicName: string, learningStyle: string, subjectData: any): Resource[] {
    const resources: Resource[] = [];
    const styleResources = subjectData.learningStyles[learningStyle] || [];

    styleResources.forEach((resourceType: string, index: number) => {
      resources.push({
        type: this.mapResourceType(resourceType),
        title: `${topicName} - ${this.formatResourceTitle(resourceType)}`,
        description: `Comprehensive ${resourceType.replace('_', ' ')} for ${topicName}`,
        estimatedTime: 30 + index * 15,
        difficulty: 'medium'
      });
    });

    resources.push({
      type: 'practice',
      title: `${topicName} Practice Problems`,
      description: `Curated practice problems to reinforce ${topicName} concepts`,
      estimatedTime: 45,
      difficulty: 'medium'
    });

    return resources.slice(0, 4);
  }

  private generateAssessments(topicName: string, topicInfo: any): Assessment[] {
    const assessments: Assessment[] = [
      {
        type: 'quiz',
        title: `${topicName} Knowledge Check`,
        questions: Math.max(5, Math.floor(topicInfo.difficulty * 15)),
        estimatedTime: 20,
        passingScore: 75
      }
    ];

    if (topicInfo.difficulty > 0.6) {
      assessments.push({
        type: 'problem_set',
        title: `${topicName} Problem Set`,
        questions: Math.floor(topicInfo.difficulty * 10),
        estimatedTime: 40,
        passingScore: 70
      });
    }

    if (topicInfo.difficulty > 0.8) {
      assessments.push({
        type: 'project',
        title: `${topicName} Applied Project`,
        questions: 1,
        estimatedTime: 120,
        passingScore: 80
      });
    }

    return assessments;
  }

  private generateMilestones(subjects: StudySubject[], profile: UserProfile): Milestone[] {
    const milestones: Milestone[] = [];
    const totalWeeks = Math.ceil(this.calculateOptimalDuration(subjects, profile) / 7);

    for (let week = 1; week <= Math.min(totalWeeks, 12); week++) {
      const milestone: Milestone = {
        week,
        title: this.generateMilestoneTitle(week, subjects),
        description: this.generateMilestoneDescription(week, subjects, totalWeeks),
        successCriteria: this.generateSuccessCriteria(week, subjects),
        rewards: this.generateMilestoneRewards(week)
      };
      milestones.push(milestone);
    }

    return milestones;
  }

  private generateAdaptiveFeatures(profile: UserProfile, analysis: any): AdaptiveFeature[] {
    const features: AdaptiveFeature[] = [
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

    if (analysis.motivationLevel === 'low') {
      features.push({
        trigger: 'Low engagement detected',
        action: 'Switch to preferred learning style and gamify content',
        description: 'Boosts motivation through personalized content delivery'
      });
    }

    return features;
  }

  private generateRecommendations(profile: UserProfile, analysis: any): string[] {
    const recommendations: string[] = [];

    if (analysis.performanceLevel === 'struggling') {
      recommendations.push('Focus on building strong foundations before advancing');
      recommendations.push('Consider shorter, more frequent study sessions');
      recommendations.push('Use visual aids and interactive content to improve understanding');
    }

    if (analysis.motivationLevel === 'low') {
      recommendations.push('Set smaller, achievable daily goals');
      recommendations.push('Join study groups or find an accountability partner');
      recommendations.push('Celebrate small wins to build momentum');
    }

    if (profile.currentStreak < 7) {
      recommendations.push('Establish a consistent daily study routine');
      recommendations.push('Use the Pomodoro timer to maintain focus');
    }

    recommendations.push(`Leverage your ${profile.learningStyle || 'visual'} learning style with appropriate resources`);
    recommendations.push('Regular self-assessment to track progress and adjust strategies');

    return recommendations;
  }

  // Helper methods
  private mapDifficultyToString(difficulty: number): string {
    if (difficulty < 0.4) return 'Beginner';
    if (difficulty < 0.7) return 'Intermediate';
    if (difficulty < 0.9) return 'Advanced';
    return 'Expert';
  }

  private mapResourceType(resourceType: string): Resource['type'] {
    const mapping: { [key: string]: Resource['type'] } = {
      'interactive_graphs': 'interactive',
      'geometric_visualization': 'interactive',
      'physics_simulations': 'simulation',
      'concept_animations': 'video',
      'physics_lectures': 'video',
      'textbook_study': 'article',
      'lab_experiments': 'interactive',
      'hands_on_problems': 'practice',
      'molecular_models': 'interactive',
      '3d_structures': 'interactive'
    };
    return mapping[resourceType] || 'article';
  }

  private formatResourceTitle(resourceType: string): string {
    return resourceType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private calculateTimeAllocation(priority: 'high' | 'medium' | 'low', topicCount: number): number {
    const baseAllocation = { high: 40, medium: 30, low: 20 };
    return Math.min(baseAllocation[priority], baseAllocation[priority] + topicCount * 2);
  }

  private calculateOptimalDuration(subjects: StudySubject[], profile: UserProfile): number {
    const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const dailyCapacity = (profile.timeAvailable || 60) / 60;
    const estimatedDays = Math.ceil(totalTopics * 2 / dailyCapacity);
    return Math.max(14, Math.min(estimatedDays, 90));
  }

  private recommendDailyTime(profile: UserProfile): number {
    const baseTime = 60;
    if (profile.level > 15) return 90;
    if (profile.currentStreak > 20) return 75;
    return baseTime;
  }

  private determineDifficulty(profile: UserProfile, analysis: any): string {
    if (analysis.performanceLevel === 'excelling' && analysis.motivationLevel === 'high') {
      return 'Challenging';
    } else if (analysis.performanceLevel === 'struggling') {
      return 'Supportive';
    }
    return 'Balanced';
  }

  private generatePlanTitle(profile: UserProfile, analysis: any): string {
    const intensity = analysis.recommendedIntensity;
    const focus = profile.weakAreas.length > 0 ? 'Improvement' : 'Advancement';
    return `${intensity.charAt(0).toUpperCase() + intensity.slice(1)} ${focus} Plan for ${profile.name}`;
  }

  private generatePlanDescription(profile: UserProfile, subjects: StudySubject[]): string {
    const subjectNames = subjects.map(s => s.name).join(', ');
    return `A personalized study plan focusing on ${subjectNames}, designed to address your learning goals while building on your strengths. This plan adapts to your progress and learning style.`;
  }

  private predictOutcome(profile: UserProfile, subjects: StudySubject[]): string {
    const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const improvementAreas = subjects.filter(s => s.priority === 'high').length;
    
    return `Expected to master ${totalTopics} key topics, with significant improvement in ${improvementAreas} focus areas. Projected skill level increase of ${Math.min(5, improvementAreas * 2)} levels.`;
  }

  private calculateConfidence(profile: UserProfile, subjects: StudySubject[]): number {
    let confidence = 70;
    
    if (profile.currentStreak > 10) confidence += 10;
    if (profile.completedLessons > 50) confidence += 10;
    if (profile.recentPerformance?.consistency > 80) confidence += 10;
    
    const avgDifficulty = subjects.reduce((sum, subject) => {
      const topicDifficulties = subject.topics.map(topic => {
        switch (topic.difficulty) {
          case 'Beginner': return 0.2;
          case 'Intermediate': return 0.5;
          case 'Advanced': return 0.8;
          case 'Expert': return 1.0;
          default: return 0.5;
        }
      });
      return sum + topicDifficulties.reduce((a, b) => a + b, 0) / topicDifficulties.length;
    }, 0) / subjects.length;
    
    if (avgDifficulty > 0.8) confidence -= 15;
    else if (avgDifficulty < 0.4) confidence += 5;
    
    return Math.max(50, Math.min(95, confidence));
  }

  private generateMilestoneTitle(week: number, subjects: StudySubject[]): string {
    if (week === 1) return 'Foundation Building';
    if (week <= 4) return `${subjects[0]?.name || 'Core'} Mastery`;
    if (week <= 8) return 'Integration & Application';
    return 'Advanced Synthesis';
  }

  private generateMilestoneDescription(week: number, subjects: StudySubject[], totalWeeks: number): string {
    const progress = (week / totalWeeks) * 100;
    return `Week ${week} milestone focusing on consolidating knowledge and skills. Target: ${Math.round(progress)}% completion of study plan.`;
  }

  private generateSuccessCriteria(week: number, subjects: StudySubject[]): string[] {
    const criteria = [
      `Complete ${Math.min(week * 2, 10)} practice problems`,
      `Achieve 80%+ accuracy on assessments`,
      `Maintain consistent daily study schedule`
    ];
    
    if (week > 2) {
      criteria.push('Apply concepts to real-world scenarios');
    }
    
    if (week > 4) {
      criteria.push('Demonstrate mastery through project work');
    }
    
    return criteria;
  }

  private generateMilestoneRewards(week: number): string[] {
    const baseRewards = [`${week * 10} bonus stars`, 'Progress badge'];
    
    if (week % 4 === 0) {
      baseRewards.push('Special achievement unlock');
    }
    
    if (week === 8) {
      baseRewards.push('Advanced learner status');
    }
    
    return baseRewards;
  }
}

// Export singleton instance
export const aiEngine = new AIStudyPlanEngine();