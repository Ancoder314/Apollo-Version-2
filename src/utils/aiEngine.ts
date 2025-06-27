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
    // Subject difficulty and prerequisite mapping
    this.knowledgeBase.set('subjects', {
      'Mathematics': {
        topics: {
          'Algebra': { difficulty: 0.3, prerequisites: ['Basic Arithmetic'], time: 120 },
          'Calculus': { difficulty: 0.8, prerequisites: ['Algebra', 'Trigonometry'], time: 180 },
          'Linear Algebra': { difficulty: 0.7, prerequisites: ['Algebra'], time: 150 },
          'Statistics': { difficulty: 0.5, prerequisites: ['Algebra'], time: 100 },
          'Differential Equations': { difficulty: 0.9, prerequisites: ['Calculus'], time: 200 }
        },
        learningStyles: {
          visual: ['graphs', 'diagrams', 'geometric_visualization'],
          auditory: ['verbal_explanations', 'discussion_groups'],
          kinesthetic: ['hands_on_problems', 'manipulatives'],
          reading: ['textbook_study', 'written_proofs']
        }
      },
      'Physics': {
        topics: {
          'Mechanics': { difficulty: 0.6, prerequisites: ['Basic Math'], time: 140 },
          'Thermodynamics': { difficulty: 0.7, prerequisites: ['Mechanics'], time: 160 },
          'Electromagnetism': { difficulty: 0.8, prerequisites: ['Calculus', 'Mechanics'], time: 180 },
          'Quantum Mechanics': { difficulty: 0.95, prerequisites: ['Calculus', 'Linear Algebra'], time: 220 },
          'Optics': { difficulty: 0.5, prerequisites: ['Basic Physics'], time: 120 }
        },
        learningStyles: {
          visual: ['simulations', 'animations', 'lab_demonstrations'],
          auditory: ['lectures', 'discussions'],
          kinesthetic: ['lab_experiments', 'building_models'],
          reading: ['theory_study', 'problem_solving']
        }
      },
      'Chemistry': {
        topics: {
          'General Chemistry': { difficulty: 0.4, prerequisites: ['Basic Math'], time: 130 },
          'Organic Chemistry': { difficulty: 0.8, prerequisites: ['General Chemistry'], time: 190 },
          'Physical Chemistry': { difficulty: 0.85, prerequisites: ['Calculus', 'General Chemistry'], time: 200 },
          'Analytical Chemistry': { difficulty: 0.6, prerequisites: ['General Chemistry'], time: 150 },
          'Biochemistry': { difficulty: 0.7, prerequisites: ['Organic Chemistry'], time: 170 }
        },
        learningStyles: {
          visual: ['molecular_models', '3d_structures', 'reaction_mechanisms'],
          auditory: ['verbal_explanations', 'group_discussions'],
          kinesthetic: ['lab_work', 'model_building'],
          reading: ['textbook_study', 'research_papers']
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
    console.log('🤖 AI Engine: Analyzing user profile and generating personalized study plan...');
    
    // Analyze user's current state
    const userAnalysis = this.analyzeUserProfile(userProfile);
    
    // Determine optimal subjects and topics
    const subjects = this.selectOptimalSubjects(userProfile, userAnalysis, goals);
    
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

    console.log('✅ AI Engine: Study plan generated with', confidence, '% confidence');
    return studyPlan;
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
      if (completionRate < 0.6) return 'struggling';
      if (completionRate > 0.9) return 'excelling';
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
    // Calculate lessons per hour
    const hoursStudied = profile.studyTime / 60;
    return hoursStudied > 0 ? profile.completedLessons / hoursStudied : 0;
  }

  private assessMotivation(profile: UserProfile): 'low' | 'medium' | 'high' {
    const streakScore = Math.min(profile.currentStreak / 30, 1); // Normalize to 30 days
    const consistencyScore = profile.studyTime > 0 ? 1 : 0;
    const engagementScore = profile.recentPerformance?.engagement || 50;
    
    const motivationScore = (streakScore * 0.4 + consistencyScore * 0.3 + engagementScore / 100 * 0.3);
    
    if (motivationScore > 0.7) return 'high';
    if (motivationScore < 0.4) return 'low';
    return 'medium';
  }

  private identifyKnowledgeGaps(profile: UserProfile): string[] {
    return profile.weakAreas.map(area => {
      const subjects = this.knowledgeBase.get('subjects');
      const subjectData = subjects[area];
      if (subjectData) {
        // Find prerequisite gaps
        const topics = Object.keys(subjectData.topics);
        return topics.filter(topic => {
          const topicData = subjectData.topics[topic];
          return topicData.difficulty > 0.6; // Focus on challenging topics
        });
      }
      return [area];
    }).flat();
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
    
    // Prioritize weak areas for improvement
    profile.weakAreas.forEach(weakArea => {
      if (subjectsData[weakArea]) {
        subjects.push(this.createStudySubject(weakArea, 'high', profile, analysis, subjectsData[weakArea]));
      }
    });

    // Add strong areas for maintenance (lower priority)
    profile.strongAreas.slice(0, 2).forEach(strongArea => {
      if (subjectsData[strongArea] && !subjects.find(s => s.name === strongArea)) {
        subjects.push(this.createStudySubject(strongArea, 'low', profile, analysis, subjectsData[strongArea]));
      }
    });

    // Add goal-based subjects
    goals.forEach(goal => {
      const matchingSubject = Object.keys(subjectsData).find(subject => 
        goal.toLowerCase().includes(subject.toLowerCase())
      );
      if (matchingSubject && !subjects.find(s => s.name === matchingSubject)) {
        subjects.push(this.createStudySubject(matchingSubject, 'medium', profile, analysis, subjectsData[matchingSubject]));
      }
    });

    return subjects.slice(0, 4); // Limit to 4 subjects max
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
    
    // Priority-based reasoning
    if (priority === 'high') {
      if (profile.weakAreas.includes(subjectName)) {
        reasons.push(`${subjectName} is identified as a weak area requiring focused improvement`);
      }
      reasons.push('High priority due to fundamental importance for your learning goals');
    } else if (priority === 'medium') {
      reasons.push(`${subjectName} supports your overall academic development`);
    } else {
      if (profile.strongAreas.includes(subjectName)) {
        reasons.push(`${subjectName} is a strength area that needs maintenance to prevent skill decay`);
      }
      reasons.push('Lower priority but important for comprehensive knowledge');
    }

    // Performance-based reasoning
    if (analysis.performanceLevel === 'struggling') {
      reasons.push('Adjusted difficulty to build confidence and solid foundations');
    } else if (analysis.performanceLevel === 'excelling') {
      reasons.push('Enhanced with challenging content to maximize your potential');
    }

    // Learning style consideration
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
      // Filter topics based on user's current level and performance
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

    return topics.slice(0, 6); // Limit topics per subject
  }

  private isTopicAppropriate(topicInfo: any, profile: UserProfile, analysis: any): boolean {
    const userLevel = profile.level / 20; // Normalize level to 0-1 scale
    const difficultyGap = Math.abs(topicInfo.difficulty - userLevel);
    
    // Topic is appropriate if difficulty gap is reasonable
    if (analysis.performanceLevel === 'excelling') {
      return difficultyGap <= 0.3; // Can handle more challenging topics
    } else if (analysis.performanceLevel === 'struggling') {
      return topicInfo.difficulty <= userLevel + 0.1; // Stick to easier topics
    }
    return difficultyGap <= 0.2; // Moderate challenge for average performers
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

    // Add universal resources
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
      'graphs': 'interactive',
      'diagrams': 'interactive',
      'simulations': 'simulation',
      'animations': 'video',
      'lectures': 'video',
      'textbook_study': 'article',
      'lab_experiments': 'interactive',
      'hands_on_problems': 'practice'
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
    const dailyCapacity = (profile.timeAvailable || 60) / 60; // hours per day
    const estimatedDays = Math.ceil(totalTopics * 2 / dailyCapacity); // 2 hours per topic average
    return Math.max(14, Math.min(estimatedDays, 90)); // Between 2 weeks and 3 months
  }

  private recommendDailyTime(profile: UserProfile): number {
    const baseTime = 60; // 1 hour default
    if (profile.level > 15) return 90; // Advanced users
    if (profile.currentStreak > 20) return 75; // Consistent users
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
    let confidence = 70; // Base confidence
    
    // Adjust based on user history
    if (profile.currentStreak > 10) confidence += 10;
    if (profile.completedLessons > 50) confidence += 10;
    if (profile.recentPerformance?.consistency > 80) confidence += 10;
    
    // Adjust based on plan complexity
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