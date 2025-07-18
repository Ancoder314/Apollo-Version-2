import { openaiService } from './openaiService';

export interface UserProfile {
  name: string;
  level: number;
  totalStars: number;
  currentStreak: number;
  studyTime: number;
  completedLessons: number;
  weakAreas: string[];
  strongAreas: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  preferredDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  studyGoals: string[];
  timeAvailable: number;
  recentPerformance?: {
    accuracy: number;
    speed: number;
    consistency: number;
    engagement: number;
  };
}

export interface StudyPlan {
  id?: string;
  title: string;
  description: string;
  duration: number;
  dailyTimeCommitment: number;
  difficulty: string;
  subjects: Array<{
    name: string;
    priority: 'high' | 'medium' | 'low';
    timeAllocation: number;
    topics: Array<{
      name: string;
      difficulty: string;
      estimatedTime: number;
      prerequisites: string[];
      learningObjectives: string[];
      resources: string[];
      assessments: string[];
    }>;
    reasoning: string;
  }>;
  milestones: Array<{
    week: number;
    title: string;
    description: string;
    successCriteria: string[];
  }>;
  adaptiveFeatures: {
    difficultyAdjustment: boolean;
    personalizedContent: boolean;
    progressTracking: boolean;
    weaknessIdentification: boolean;
  };
  personalizedRecommendations: string[];
  estimatedOutcome: string;
  confidence: number;
}

export interface QuestionSet {
  title: string;
  description: string;
  difficulty: string;
  questions: Array<{
    type: 'multiple_choice' | 'short_answer' | 'essay' | 'problem_solving';
    question: string;
    options?: string[];
    correctAnswer: number | string;
    explanation: string;
    hint: string;
    points: number;
    concepts: string[];
    apSkills: string[];
    commonMistakes?: string[];
  }>;
}

export interface StudyContent {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hint: string;
  points: number;
  concepts: string[];
  apSkills: string[];
  visualAid?: string;
  audioExplanation?: string;
  interactiveElement?: string;
  commonMistakes?: string[];
}

class AIEngine {
  private hasOpenAI: boolean;

  constructor() {
    this.hasOpenAI = !!(import.meta.env.VITE_OPENAI_API_KEY && 
                       import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here');
  }

  async generateStudyPlan(
    userProfile: UserProfile, 
    goals: string[], 
    additionalInfo?: string
  ): Promise<StudyPlan> {
    console.log('🤖 AI Engine: Generating personalized AP study plan...');
    
    if (this.hasOpenAI) {
      try {
        console.log('🔥 Using OpenAI for enhanced study plan generation');
        const openAIRequest = {
          userProfile: {
            name: userProfile.name,
            level: userProfile.level,
            weakAreas: userProfile.weakAreas,
            strongAreas: userProfile.strongAreas,
            learningStyle: userProfile.learningStyle,
            studyGoals: userProfile.studyGoals,
            timeAvailable: userProfile.timeAvailable,
            additionalInfo: additionalInfo || ''
          },
          goals: goals,
          uploadedContent: additionalInfo
        };

        const result = await openaiService.generateStudyPlan(openAIRequest);
        console.log('✅ OpenAI study plan generated successfully');
        
        // Enhance with adaptive features
        return {
          ...result,
          adaptiveFeatures: {
            difficultyAdjustment: true,
            personalizedContent: true,
            progressTracking: true,
            weaknessIdentification: true
          }
        };
      } catch (error) {
        console.warn('⚠️ OpenAI failed, falling back to local AI:', error);
        return this.generateLocalStudyPlan(userProfile, goals, additionalInfo);
      }
    } else {
      console.log('🧠 Using advanced local AI engine');
      return this.generateLocalStudyPlan(userProfile, goals, additionalInfo);
    }
  }

  private async generateLocalStudyPlan(
    userProfile: UserProfile, 
    goals: string[], 
    additionalInfo?: string
  ): Promise<StudyPlan> {
    console.log('🎯 Generating personalized local study plan...');
    
    // Analyze user goals to identify AP subjects
    const apSubjects = this.extractAPSubjects(goals, userProfile.weakAreas, userProfile.strongAreas);
    console.log('📚 Identified AP subjects:', apSubjects);
    
    // Analyze uploaded content for personalization
    const contentInsights = this.analyzeUploadedContent(additionalInfo || '');
    console.log('📄 Content insights:', contentInsights);
    
    // Generate personalized subjects based on user profile
    const subjects = apSubjects.map(subject => {
      const isWeakArea = userProfile.weakAreas.some(weak => 
        subject.toLowerCase().includes(weak.toLowerCase()) || 
        weak.toLowerCase().includes(subject.toLowerCase())
      );
      const isStrongArea = userProfile.strongAreas.some(strong => 
        subject.toLowerCase().includes(strong.toLowerCase()) || 
        strong.toLowerCase().includes(subject.toLowerCase())
      );
      
      const priority = isWeakArea ? 'high' : isStrongArea ? 'low' : 'medium';
      const timeAllocation = isWeakArea ? 35 : isStrongArea ? 20 : 25;
      
      // Generate personalized topics based on content analysis
      const topics = this.generatePersonalizedTopics(subject, userProfile, contentInsights);
      
      return {
        name: subject,
        priority: priority as 'high' | 'medium' | 'low',
        timeAllocation,
        topics,
        reasoning: this.generateSubjectReasoning(subject, userProfile, isWeakArea, isStrongArea, contentInsights)
      };
    });

    // Generate personalized milestones
    const milestones = this.generatePersonalizedMilestones(subjects, userProfile);
    
    // Generate personalized recommendations
    const personalizedRecommendations = this.generatePersonalizedRecommendations(userProfile, contentInsights);
    
    const studyPlan: StudyPlan = {
      title: `Personalized AP Study Plan for ${userProfile.name}`,
      description: `AI-crafted study plan targeting your specific goals: ${goals.join(', ')}. Optimized for ${userProfile.learningStyle} learning style with focus on weak areas.`,
      duration: this.calculateOptimalDuration(userProfile, subjects.length),
      dailyTimeCommitment: userProfile.timeAvailable,
      difficulty: this.determineDifficulty(userProfile),
      subjects,
      milestones,
      adaptiveFeatures: {
        difficultyAdjustment: true,
        personalizedContent: true,
        progressTracking: true,
        weaknessIdentification: true
      },
      personalizedRecommendations,
      estimatedOutcome: this.generatePersonalizedOutcome(userProfile, subjects),
      confidence: this.calculateConfidence(userProfile, subjects)
    };

    console.log('✅ Personalized local study plan generated');
    return studyPlan;
  }

  private extractAPSubjects(goals: string[], weakAreas: string[], strongAreas: string[]): string[] {
    const apSubjectMap = {
      'calculus': 'AP Calculus AB',
      'calc': 'AP Calculus AB',
      'physics': 'AP Physics 1',
      'chemistry': 'AP Chemistry',
      'chem': 'AP Chemistry',
      'biology': 'AP Biology',
      'bio': 'AP Biology',
      'computer science': 'AP Computer Science A',
      'cs': 'AP Computer Science A',
      'programming': 'AP Computer Science A',
      'statistics': 'AP Statistics',
      'stats': 'AP Statistics',
      'english': 'AP English Language',
      'literature': 'AP English Literature',
      'history': 'AP US History',
      'psychology': 'AP Psychology',
      'economics': 'AP Economics',
      'government': 'AP Government',
      'environmental': 'AP Environmental Science',
      'art': 'AP Art History',
      'music': 'AP Music Theory',
      'spanish': 'AP Spanish Language',
      'french': 'AP French Language',
      'latin': 'AP Latin',
      'geography': 'AP Human Geography'
    };

    const allText = [...goals, ...weakAreas, ...strongAreas].join(' ').toLowerCase();
    const identifiedSubjects = new Set<string>();

    // Extract subjects from text
    Object.entries(apSubjectMap).forEach(([keyword, subject]) => {
      if (allText.includes(keyword)) {
        identifiedSubjects.add(subject);
      }
    });

    // If no subjects identified, provide default based on common AP courses
    if (identifiedSubjects.size === 0) {
      return ['AP Calculus AB', 'AP Physics 1', 'AP English Language'];
    }

    return Array.from(identifiedSubjects).slice(0, 4); // Limit to 4 subjects
  }

  private analyzeUploadedContent(content: string): any {
    if (!content || content.trim().length === 0) {
      return { topics: [], concepts: [], difficulty: 'medium', focus_areas: [] };
    }

    console.log('📄 Analyzing uploaded content for personalization...');
    
    // Extract key topics and concepts from uploaded content
    const topics = this.extractTopicsFromContent(content);
    const concepts = this.extractConceptsFromContent(content);
    const difficulty = this.assessContentDifficulty(content);
    const focusAreas = this.identifyFocusAreas(content);
    
    return {
      topics,
      concepts,
      difficulty,
      focus_areas: focusAreas,
      content_length: content.length,
      has_formulas: /\b(formula|equation|theorem)\b/i.test(content),
      has_examples: /\b(example|problem|solution)\b/i.test(content),
      has_definitions: /\b(define|definition|means)\b/i.test(content)
    };
  }

  private extractTopicsFromContent(content: string): string[] {
    const topicPatterns = [
      /chapter\s+\d+[:\s]+([^.\n]+)/gi,
      /section\s+\d+[:\s]+([^.\n]+)/gi,
      /topic[:\s]+([^.\n]+)/gi,
      /unit\s+\d+[:\s]+([^.\n]+)/gi,
      /lesson[:\s]+([^.\n]+)/gi
    ];

    const topics = new Set<string>();
    
    topicPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const topic = match.replace(/^(chapter|section|topic|unit|lesson)\s*\d*[:\s]*/i, '').trim();
          if (topic.length > 3 && topic.length < 100) {
            topics.add(topic);
          }
        });
      }
    });

    return Array.from(topics).slice(0, 10);
  }

  private extractConceptsFromContent(content: string): string[] {
    const conceptKeywords = [
      'derivative', 'integral', 'limit', 'function', 'equation', 'theorem',
      'velocity', 'acceleration', 'force', 'energy', 'momentum',
      'atom', 'molecule', 'reaction', 'equilibrium', 'bond',
      'cell', 'DNA', 'protein', 'evolution', 'ecosystem',
      'algorithm', 'data structure', 'object', 'class', 'method',
      'probability', 'statistics', 'hypothesis', 'correlation',
      'rhetoric', 'argument', 'analysis', 'synthesis', 'evidence'
    ];

    const concepts = new Set<string>();
    const contentLower = content.toLowerCase();
    
    conceptKeywords.forEach(keyword => {
      if (contentLower.includes(keyword)) {
        concepts.add(keyword);
      }
    });

    return Array.from(concepts);
  }

  private assessContentDifficulty(content: string): string {
    const advancedTerms = ['advanced', 'complex', 'sophisticated', 'intricate', 'comprehensive'];
    const basicTerms = ['basic', 'fundamental', 'introduction', 'simple', 'elementary'];
    
    const contentLower = content.toLowerCase();
    const advancedCount = advancedTerms.filter(term => contentLower.includes(term)).length;
    const basicCount = basicTerms.filter(term => contentLower.includes(term)).length;
    
    if (advancedCount > basicCount) return 'advanced';
    if (basicCount > advancedCount) return 'beginner';
    return 'intermediate';
  }

  private identifyFocusAreas(content: string): string[] {
    const focusPatterns = [
      /focus\s+on[:\s]+([^.\n]+)/gi,
      /emphasis\s+on[:\s]+([^.\n]+)/gi,
      /important[:\s]+([^.\n]+)/gi,
      /key\s+concept[:\s]+([^.\n]+)/gi,
      /main\s+idea[:\s]+([^.\n]+)/gi
    ];

    const focusAreas = new Set<string>();
    
    focusPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const area = match.replace(/^(focus|emphasis|important|key\s+concept|main\s+idea)\s*on\s*[:\s]*/i, '').trim();
          if (area.length > 3 && area.length < 100) {
            focusAreas.add(area);
          }
        });
      }
    });

    return Array.from(focusAreas).slice(0, 5);
  }

  private generatePersonalizedTopics(subject: string, userProfile: UserProfile, contentInsights: any): any[] {
    const baseTopics = this.getBaseTopicsForSubject(subject);
    
    // Personalize topics based on user profile and content
    const personalizedTopics = baseTopics.map(topic => {
      const difficulty = this.adjustTopicDifficulty(topic, userProfile, contentInsights);
      const estimatedTime = this.calculatePersonalizedTime(topic, userProfile);
      const learningObjectives = this.generatePersonalizedObjectives(topic, userProfile, contentInsights);
      
      return {
        name: topic.name,
        difficulty,
        estimatedTime,
        prerequisites: topic.prerequisites || [],
        learningObjectives,
        resources: this.generatePersonalizedResources(topic, userProfile),
        assessments: this.generatePersonalizedAssessments(topic, userProfile)
      };
    });

    // Add topics from uploaded content if available
    if (contentInsights.topics.length > 0) {
      contentInsights.topics.forEach((contentTopic: string) => {
        if (!personalizedTopics.some(t => t.name.toLowerCase().includes(contentTopic.toLowerCase()))) {
          personalizedTopics.push({
            name: `${contentTopic} (From Your Materials)`,
            difficulty: contentInsights.difficulty,
            estimatedTime: 45,
            prerequisites: [],
            learningObjectives: [`Master ${contentTopic} concepts from your uploaded materials`],
            resources: ['Your uploaded materials', 'Supplementary practice problems'],
            assessments: ['Custom questions based on your materials']
          });
        }
      });
    }

    return personalizedTopics.slice(0, 8); // Limit to 8 topics per subject
  }

  private getBaseTopicsForSubject(subject: string): any[] {
    const topicMap: { [key: string]: any[] } = {
      'AP Calculus AB': [
        { name: 'Limits and Continuity', prerequisites: ['Algebra', 'Functions'] },
        { name: 'Derivatives', prerequisites: ['Limits'] },
        { name: 'Applications of Derivatives', prerequisites: ['Derivatives'] },
        { name: 'Integrals', prerequisites: ['Derivatives'] },
        { name: 'Applications of Integrals', prerequisites: ['Integrals'] }
      ],
      'AP Physics 1': [
        { name: 'Kinematics', prerequisites: ['Algebra', 'Trigonometry'] },
        { name: 'Dynamics', prerequisites: ['Kinematics'] },
        { name: 'Energy and Momentum', prerequisites: ['Dynamics'] },
        { name: 'Rotational Motion', prerequisites: ['Dynamics'] },
        { name: 'Waves and Sound', prerequisites: ['Energy'] }
      ],
      'AP Chemistry': [
        { name: 'Atomic Structure', prerequisites: ['Basic Chemistry'] },
        { name: 'Chemical Bonding', prerequisites: ['Atomic Structure'] },
        { name: 'Stoichiometry', prerequisites: ['Chemical Bonding'] },
        { name: 'Thermodynamics', prerequisites: ['Stoichiometry'] },
        { name: 'Kinetics', prerequisites: ['Thermodynamics'] }
      ],
      'AP Biology': [
        { name: 'Cell Structure and Function', prerequisites: ['Basic Biology'] },
        { name: 'Genetics', prerequisites: ['Cell Biology'] },
        { name: 'Evolution', prerequisites: ['Genetics'] },
        { name: 'Ecology', prerequisites: ['Evolution'] },
        { name: 'Molecular Biology', prerequisites: ['Genetics'] }
      ],
      'AP Computer Science A': [
        { name: 'Object-Oriented Programming', prerequisites: ['Basic Programming'] },
        { name: 'Data Structures', prerequisites: ['OOP'] },
        { name: 'Algorithms', prerequisites: ['Data Structures'] },
        { name: 'Recursion', prerequisites: ['Algorithms'] },
        { name: 'Sorting and Searching', prerequisites: ['Algorithms'] }
      ]
    };

    return topicMap[subject] || [
      { name: `${subject} Fundamentals`, prerequisites: [] },
      { name: `${subject} Applications`, prerequisites: ['Fundamentals'] },
      { name: `${subject} Problem Solving`, prerequisites: ['Applications'] }
    ];
  }

  private adjustTopicDifficulty(topic: any, userProfile: UserProfile, contentInsights: any): string {
    let baseDifficulty = 'Intermediate';
    
    // Adjust based on user's weak/strong areas
    const isWeakArea = userProfile.weakAreas.some(weak => 
      topic.name.toLowerCase().includes(weak.toLowerCase())
    );
    const isStrongArea = userProfile.strongAreas.some(strong => 
      topic.name.toLowerCase().includes(strong.toLowerCase())
    );
    
    if (isWeakArea) {
      baseDifficulty = 'Beginner';
    } else if (isStrongArea) {
      baseDifficulty = 'Advanced';
    }
    
    // Adjust based on content insights
    if (contentInsights.difficulty === 'advanced' && baseDifficulty !== 'Beginner') {
      baseDifficulty = 'Advanced';
    } else if (contentInsights.difficulty === 'beginner') {
      baseDifficulty = 'Beginner';
    }
    
    return baseDifficulty;
  }

  private calculatePersonalizedTime(topic: any, userProfile: UserProfile): number {
    let baseTime = 45; // Default 45 minutes
    
    // Adjust based on user's available time
    if (userProfile.timeAvailable < 30) {
      baseTime = 25;
    } else if (userProfile.timeAvailable > 90) {
      baseTime = 60;
    }
    
    // Adjust based on learning style
    if (userProfile.learningStyle === 'kinesthetic') {
      baseTime += 15; // Hands-on learning takes more time
    } else if (userProfile.learningStyle === 'reading') {
      baseTime -= 10; // Reading-based learning can be faster
    }
    
    return baseTime;
  }

  private generatePersonalizedObjectives(topic: any, userProfile: UserProfile, contentInsights: any): string[] {
    const baseObjectives = [`Master ${topic.name} concepts and applications`];
    
    // Add learning style specific objectives
    switch (userProfile.learningStyle) {
      case 'visual':
        baseObjectives.push(`Visualize ${topic.name} through diagrams and graphs`);
        break;
      case 'auditory':
        baseObjectives.push(`Explain ${topic.name} concepts verbally`);
        break;
      case 'kinesthetic':
        baseObjectives.push(`Apply ${topic.name} through hands-on practice`);
        break;
      case 'reading':
        baseObjectives.push(`Analyze ${topic.name} through detailed reading and writing`);
        break;
    }
    
    // Add objectives based on content insights
    if (contentInsights.focus_areas.length > 0) {
      contentInsights.focus_areas.forEach((area: string) => {
        if (topic.name.toLowerCase().includes(area.toLowerCase())) {
          baseObjectives.push(`Focus on ${area} as identified in your materials`);
        }
      });
    }
    
    return baseObjectives.slice(0, 4);
  }

  private generatePersonalizedResources(topic: any, userProfile: UserProfile): string[] {
    const resources = ['AP Course Materials', 'Practice Problems'];
    
    // Add learning style specific resources
    switch (userProfile.learningStyle) {
      case 'visual':
        resources.push('Interactive Diagrams', 'Video Tutorials');
        break;
      case 'auditory':
        resources.push('Audio Lectures', 'Discussion Forums');
        break;
      case 'kinesthetic':
        resources.push('Lab Simulations', 'Hands-on Activities');
        break;
      case 'reading':
        resources.push('Detailed Textbooks', 'Research Articles');
        break;
    }
    
    return resources;
  }

  private generatePersonalizedAssessments(topic: any, userProfile: UserProfile): string[] {
    const assessments = ['Multiple Choice Quiz', 'Problem Solving'];
    
    // Add learning style specific assessments
    switch (userProfile.learningStyle) {
      case 'visual':
        assessments.push('Diagram Analysis', 'Graph Interpretation');
        break;
      case 'auditory':
        assessments.push('Oral Explanation', 'Discussion Questions');
        break;
      case 'kinesthetic':
        assessments.push('Practical Application', 'Lab Report');
        break;
      case 'reading':
        assessments.push('Essay Questions', 'Research Project');
        break;
    }
    
    return assessments;
  }

  private generateSubjectReasoning(
    subject: string, 
    userProfile: UserProfile, 
    isWeakArea: boolean, 
    isStrongArea: boolean,
    contentInsights: any
  ): string {
    let reasoning = `${subject} is included in your study plan`;
    
    if (isWeakArea) {
      reasoning += ` as a high priority because it's identified as a weak area. Extra time and foundational support will be provided.`;
    } else if (isStrongArea) {
      reasoning += ` to maintain and advance your existing strength. Focus will be on challenging applications.`;
    } else {
      reasoning += ` to build comprehensive AP knowledge and skills.`;
    }
    
    if (contentInsights.topics.length > 0) {
      const relevantTopics = contentInsights.topics.filter((topic: string) => 
        subject.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(subject.toLowerCase())
      );
      
      if (relevantTopics.length > 0) {
        reasoning += ` Your uploaded materials contain relevant content on ${relevantTopics.join(', ')}, which will be integrated into the study plan.`;
      }
    }
    
    return reasoning;
  }

  private generatePersonalizedMilestones(subjects: any[], userProfile: UserProfile): any[] {
    const totalWeeks = Math.ceil(this.calculateOptimalDuration(userProfile, subjects.length) / 7);
    const milestones = [];
    
    for (let week = 1; week <= Math.min(totalWeeks, 12); week += 2) {
      const milestone = {
        week,
        title: `Week ${week} Milestone`,
        description: '',
        successCriteria: [] as string[]
      };
      
      if (week <= 2) {
        milestone.title = 'Foundation Building';
        milestone.description = 'Establish strong fundamentals in your weak areas';
        milestone.successCriteria = [
          'Complete foundational topics in weak areas',
          'Achieve 70% accuracy on basic problems',
          'Establish consistent study routine'
        ];
      } else if (week <= 6) {
        milestone.title = 'Skill Development';
        milestone.description = 'Build problem-solving skills and deepen understanding';
        milestone.successCriteria = [
          'Master intermediate concepts',
          'Achieve 80% accuracy on practice problems',
          'Complete at least 2 full practice tests'
        ];
      } else if (week <= 10) {
        milestone.title = 'Application Mastery';
        milestone.description = 'Apply knowledge to complex, exam-style problems';
        milestone.successCriteria = [
          'Solve advanced application problems',
          'Achieve 85% accuracy on AP-style questions',
          'Complete comprehensive review of all topics'
        ];
      } else {
        milestone.title = 'Exam Readiness';
        milestone.description = 'Final preparation and confidence building';
        milestone.successCriteria = [
          'Score 4+ on practice AP exams',
          'Complete final review of weak areas',
          'Develop test-taking strategies'
        ];
      }
      
      milestones.push(milestone);
    }
    
    return milestones;
  }

  private generatePersonalizedRecommendations(userProfile: UserProfile, contentInsights: any): string[] {
    const recommendations = [];
    
    // Learning style recommendations
    switch (userProfile.learningStyle) {
      case 'visual':
        recommendations.push('Use concept maps and diagrams to visualize relationships between topics');
        recommendations.push('Create visual summaries and flowcharts for complex processes');
        break;
      case 'auditory':
        recommendations.push('Explain concepts out loud or teach them to others');
        recommendations.push('Use audio resources and participate in study groups');
        break;
      case 'kinesthetic':
        recommendations.push('Use hands-on activities and simulations when possible');
        recommendations.push('Take frequent breaks and incorporate movement into study sessions');
        break;
      case 'reading':
        recommendations.push('Take detailed notes and create written summaries');
        recommendations.push('Read multiple sources to deepen understanding');
        break;
    }
    
    // Weak area recommendations
    if (userProfile.weakAreas.length > 0) {
      recommendations.push(`Focus extra time on ${userProfile.weakAreas.join(', ')} - consider additional tutoring or resources`);
      recommendations.push('Start each study session with a brief review of challenging concepts');
    }
    
    // Time management recommendations
    if (userProfile.timeAvailable < 45) {
      recommendations.push('Use micro-learning sessions - focus on one concept at a time');
      recommendations.push('Utilize spaced repetition to maximize retention in limited time');
    } else if (userProfile.timeAvailable > 90) {
      recommendations.push('Break longer sessions into focused blocks with breaks');
      recommendations.push('Use extended time for deep practice and application problems');
    }
    
    // Content-based recommendations
    if (contentInsights.has_formulas) {
      recommendations.push('Create a formula sheet and practice applying formulas in different contexts');
    }
    
    if (contentInsights.has_examples) {
      recommendations.push('Work through all examples in your materials and create similar problems');
    }
    
    // Performance-based recommendations
    if (userProfile.recentPerformance) {
      if (userProfile.recentPerformance.accuracy < 70) {
        recommendations.push('Focus on understanding concepts before attempting speed');
        recommendations.push('Review incorrect answers thoroughly to identify patterns');
      }
      
      if (userProfile.recentPerformance.consistency < 70) {
        recommendations.push('Establish a regular study schedule and stick to it');
        recommendations.push('Use consistent problem-solving approaches');
      }
    }
    
    return recommendations.slice(0, 8);
  }

  private calculateOptimalDuration(userProfile: UserProfile, subjectCount: number): number {
    let baseDuration = 60; // 60 days base
    
    // Adjust for number of subjects
    baseDuration += (subjectCount - 1) * 20;
    
    // Adjust for user level
    if (userProfile.level < 3) {
      baseDuration += 30; // More time for beginners
    } else if (userProfile.level > 7) {
      baseDuration -= 20; // Less time for advanced users
    }
    
    // Adjust for available time
    if (userProfile.timeAvailable < 30) {
      baseDuration += 40; // More days needed with less daily time
    } else if (userProfile.timeAvailable > 90) {
      baseDuration -= 20; // Fewer days needed with more daily time
    }
    
    // Adjust for weak areas
    baseDuration += userProfile.weakAreas.length * 10;
    
    return Math.max(30, Math.min(baseDuration, 120)); // Between 30-120 days
  }

  private determineDifficulty(userProfile: UserProfile): string {
    if (userProfile.preferredDifficulty !== 'adaptive') {
      return userProfile.preferredDifficulty;
    }
    
    // Adaptive difficulty based on user profile
    const score = userProfile.level * 10 + 
                  userProfile.totalStars / 10 + 
                  (userProfile.strongAreas.length * 5) - 
                  (userProfile.weakAreas.length * 5);
    
    if (score < 50) return 'AP Supportive';
    if (score < 100) return 'AP Balanced';
    return 'AP Challenging';
  }

  private generatePersonalizedOutcome(userProfile: UserProfile, subjects: any[]): string {
    const subjectNames = subjects.map(s => s.name).join(', ');
    const weakAreaFocus = userProfile.weakAreas.length > 0 ? 
      ` with significant improvement in ${userProfile.weakAreas.join(', ')}` : '';
    
    return `Upon completion, you will have mastered ${subjectNames}${weakAreaFocus}. ` +
           `Based on your ${userProfile.learningStyle} learning style and current level ${userProfile.level}, ` +
           `you should be well-prepared for AP exam success with predicted scores of 4-5.`;
  }

  private calculateConfidence(userProfile: UserProfile, subjects: any[]): number {
    let confidence = 70; // Base confidence
    
    // Adjust for user level
    confidence += Math.min(userProfile.level * 3, 15);
    
    // Adjust for experience (total stars)
    confidence += Math.min(userProfile.totalStars / 50, 10);
    
    // Adjust for consistency (current streak)
    confidence += Math.min(userProfile.currentStreak / 2, 10);
    
    // Adjust for weak areas (negative impact)
    confidence -= userProfile.weakAreas.length * 3;
    
    // Adjust for strong areas (positive impact)
    confidence += userProfile.strongAreas.length * 2;
    
    // Adjust for time availability
    if (userProfile.timeAvailable >= 60) {
      confidence += 5;
    } else if (userProfile.timeAvailable < 30) {
      confidence -= 5;
    }
    
    return Math.max(60, Math.min(confidence, 95));
  }

  async generateStudyContent(
    subject: string, 
    topic: string, 
    difficulty: string, 
    learningStyle: string
  ): Promise<StudyContent> {
    console.log(`🎯 Generating personalized study content for ${topic} in ${subject}`);
    
    if (this.hasOpenAI) {
      try {
        console.log('🔥 Using OpenAI for enhanced content generation');
        const content = await openaiService.generateStudyContent(subject, topic, difficulty, learningStyle);
        console.log('✅ OpenAI content generated successfully');
        return content;
      } catch (error) {
        console.warn('⚠️ OpenAI failed, falling back to local content generation:', error);
        return this.generateLocalStudyContent(subject, topic, difficulty, learningStyle);
      }
    } else {
      console.log('🧠 Using advanced local content generation');
      return this.generateLocalStudyContent(subject, topic, difficulty, learningStyle);
    }
  }

  private generateLocalStudyContent(
    subject: string, 
    topic: string, 
    difficulty: string, 
    learningStyle: string
  ): StudyContent {
    console.log(`📚 Generating local content for ${topic} (${difficulty}, ${learningStyle})`);
    
    // Generate personalized question based on subject and topic
    const questionData = this.generatePersonalizedQuestion(subject, topic, difficulty);
    
    // Customize explanation based on learning style
    const explanation = this.customizeExplanationForLearningStyle(
      questionData.explanation, 
      learningStyle, 
      topic
    );
    
    // Generate learning style specific elements
    const visualAid = this.generateVisualAid(topic, learningStyle);
    const interactiveElement = this.generateInteractiveElement(topic, learningStyle);
    
    return {
      question: questionData.question,
      options: questionData.options,
      correct: questionData.correct,
      explanation,
      hint: this.generatePersonalizedHint(topic, difficulty, learningStyle),
      points: this.calculatePoints(difficulty),
      concepts: this.extractConcepts(subject, topic),
      apSkills: this.identifyAPSkills(subject, topic),
      visualAid,
      audioExplanation: learningStyle === 'auditory' ? 'Available' : undefined,
      interactiveElement,
      commonMistakes: this.generateCommonMistakes(subject, topic)
    };
  }

  private generatePersonalizedQuestion(subject: string, topic: string, difficulty: string): any {
    const questionTemplates = this.getQuestionTemplates(subject, topic);
    const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    
    // Adjust question complexity based on difficulty
    let question = template.question;
    let options = [...template.options];
    
    if (difficulty === 'Advanced' || difficulty === 'Expert') {
      question = question.replace('basic', 'advanced').replace('simple', 'complex');
      options = options.map(opt => opt.replace('basic', 'advanced'));
    } else if (difficulty === 'Beginner') {
      question = question.replace('advanced', 'basic').replace('complex', 'simple');
      options = options.map(opt => opt.replace('advanced', 'basic'));
    }
    
    return {
      question,
      options,
      correct: template.correct,
      explanation: template.explanation
    };
  }

  private getQuestionTemplates(subject: string, topic: string): any[] {
    // Comprehensive question templates for different AP subjects
    const templates: { [key: string]: any[] } = {
      'AP Calculus AB': [
        {
          question: `What is the fundamental concept behind ${topic} in calculus?`,
          options: [
            'Rate of change and accumulation',
            'Algebraic manipulation only',
            'Geometric visualization only',
            'Memorization of formulas'
          ],
          correct: 0,
          explanation: `${topic} in calculus focuses on understanding rates of change and accumulation, which are fundamental to solving real-world problems.`
        },
        {
          question: `How would you apply ${topic} to solve a real-world problem?`,
          options: [
            'Identify the variable relationships and set up appropriate equations',
            'Memorize standard formulas and substitute values',
            'Use only graphical methods',
            'Avoid mathematical modeling'
          ],
          correct: 0,
          explanation: `Applying ${topic} requires identifying relationships between variables and setting up mathematical models that represent the real situation.`
        }
      ],
      'AP Physics 1': [
        {
          question: `What is the key principle underlying ${topic} in physics?`,
          options: [
            'Conservation laws and fundamental interactions',
            'Mathematical complexity only',
            'Memorization of equations',
            'Abstract theoretical concepts only'
          ],
          correct: 0,
          explanation: `${topic} in physics is governed by conservation laws and fundamental interactions that explain natural phenomena.`
        },
        {
          question: `How does ${topic} connect to other areas of physics?`,
          options: [
            'Through fundamental principles that apply across different phenomena',
            'It operates in complete isolation',
            'Only through mathematical similarity',
            'No connections exist'
          ],
          correct: 0,
          explanation: `${topic} connects to other physics areas through fundamental principles like conservation of energy, momentum, and other universal laws.`
        }
      ],
      'AP Chemistry': [
        {
          question: `What is the molecular basis of ${topic} in chemistry?`,
          options: [
            'Atomic and molecular interactions based on electron behavior',
            'Random chemical events',
            'Only macroscopic observations',
            'Purely theoretical constructs'
          ],
          correct: 0,
          explanation: `${topic} in chemistry is fundamentally based on how atoms and molecules interact through electron behavior and bonding.`
        }
      ],
      'AP Biology': [
        {
          question: `How does ${topic} demonstrate the unity and diversity of life?`,
          options: [
            'Through common mechanisms with evolutionary variations',
            'Complete uniformity across all species',
            'Random biological processes',
            'Isolated biological phenomena'
          ],
          correct: 0,
          explanation: `${topic} shows how life uses common fundamental mechanisms while evolving diverse solutions to environmental challenges.`
        }
      ],
      'AP Computer Science A': [
        {
          question: `What is the fundamental programming concept illustrated by ${topic}?`,
          options: [
            'Abstraction and problem decomposition',
            'Memorizing syntax only',
            'Random code generation',
            'Avoiding systematic approaches'
          ],
          correct: 0,
          explanation: `${topic} in computer science demonstrates how abstraction and systematic problem decomposition lead to elegant solutions.`
        }
      ]
    };
    
    // Return templates for the subject, or generic templates if subject not found
    return templates[subject] || [
      {
        question: `What is the most important aspect of understanding ${topic}?`,
        options: [
          'Grasping the underlying principles and their applications',
          'Memorizing facts without understanding',
          'Avoiding practical applications',
          'Focusing only on test-taking strategies'
        ],
        correct: 0,
        explanation: `Understanding ${topic} requires grasping the underlying principles and seeing how they apply to solve real problems.`
      }
    ];
  }

  private customizeExplanationForLearningStyle(
    baseExplanation: string, 
    learningStyle: string, 
    topic: string
  ): string {
    let customizedExplanation = baseExplanation;
    
    switch (learningStyle) {
      case 'visual':
        customizedExplanation += ` Visualize this concept by creating diagrams or graphs that show the relationships in ${topic}.`;
        break;
      case 'auditory':
        customizedExplanation += ` Try explaining ${topic} out loud or discussing it with others to reinforce your understanding.`;
        break;
      case 'kinesthetic':
        customizedExplanation += ` Practice ${topic} through hands-on activities, simulations, or real-world applications.`;
        break;
      case 'reading':
        customizedExplanation += ` Read additional sources about ${topic} and take detailed notes to deepen your understanding.`;
        break;
    }
    
    return customizedExplanation;
  }

  private generatePersonalizedHint(topic: string, difficulty: string, learningStyle: string): string {
    let hint = `Think about the fundamental principles of ${topic}`;
    
    if (difficulty === 'Beginner') {
      hint = `Start with the basic definition of ${topic} and build from there`;
    } else if (difficulty === 'Advanced') {
      hint = `Consider how ${topic} connects to advanced applications and other concepts`;
    }
    
    // Add learning style specific hint
    switch (learningStyle) {
      case 'visual':
        hint += '. Try drawing a diagram to visualize the concept.';
        break;
      case 'auditory':
        hint += '. Try explaining the concept out loud.';
        break;
      case 'kinesthetic':
        hint += '. Think about how you could demonstrate this concept physically.';
        break;
      case 'reading':
        hint += '. Consider writing out the key points step by step.';
        break;
    }
    
    return hint;
  }

  private generateVisualAid(topic: string, learningStyle: string): string {
    if (learningStyle !== 'visual') return '';
    
    const visualTypes = [
      `Interactive ${topic} diagram`,
      `${topic} concept map`,
      `${topic} flowchart`,
      `${topic} graph visualization`,
      `${topic} 3D model`
    ];
    
    return visualTypes[Math.floor(Math.random() * visualTypes.length)];
  }

  private generateInteractiveElement(topic: string, learningStyle: string): string {
    const elements = {
      visual: `${topic} interactive diagram`,
      auditory: `${topic} audio explanation`,
      kinesthetic: `${topic} hands-on simulation`,
      reading: `${topic} detailed text analysis`
    };
    
    return elements[learningStyle as keyof typeof elements] || `${topic} interactive component`;
  }

  private calculatePoints(difficulty: string): number {
    const pointMap = {
      'Beginner': 10,
      'Intermediate': 15,
      'Advanced': 22,
      'Expert': 30
    };
    
    return pointMap[difficulty as keyof typeof pointMap] || 15;
  }

  private extractConcepts(subject: string, topic: string): string[] {
    const conceptMap: { [key: string]: string[] } = {
      'AP Calculus AB': ['derivatives', 'integrals', 'limits', 'functions', 'rates of change'],
      'AP Physics 1': ['forces', 'energy', 'momentum', 'waves', 'motion'],
      'AP Chemistry': ['atoms', 'molecules', 'reactions', 'bonding', 'equilibrium'],
      'AP Biology': ['cells', 'genetics', 'evolution', 'ecology', 'molecular biology'],
      'AP Computer Science A': ['algorithms', 'data structures', 'objects', 'methods', 'inheritance']
    };
    
    const baseConcepts = conceptMap[subject] || ['analysis', 'application', 'synthesis'];
    return [topic, ...baseConcepts.slice(0, 3)];
  }

  private identifyAPSkills(subject: string, topic: string): string[] {
    const skillMap: { [key: string]: string[] } = {
      'AP Calculus AB': ['Mathematical Reasoning', 'Problem Solving', 'Modeling'],
      'AP Physics 1': ['Scientific Reasoning', 'Experimental Design', 'Data Analysis'],
      'AP Chemistry': ['Chemical Reasoning', 'Laboratory Skills', 'Mathematical Analysis'],
      'AP Biology': ['Scientific Investigation', 'Data Analysis', 'Conceptual Understanding'],
      'AP Computer Science A': ['Program Design', 'Algorithm Implementation', 'Code Analysis']
    };
    
    return skillMap[subject] || ['Analysis', 'Application', 'Synthesis'];
  }

  private generateCommonMistakes(subject: string, topic: string): string[] {
    const mistakeMap: { [key: string]: string[] } = {
      'AP Calculus AB': [
        'Confusing derivative and integral operations',
        'Forgetting to apply the chain rule',
        'Misunderstanding the fundamental theorem of calculus'
      ],
      'AP Physics 1': [
        'Confusing velocity and acceleration',
        'Forgetting to consider all forces in equilibrium',
        'Misapplying conservation laws'
      ],
      'AP Chemistry': [
        'Confusing molecular and empirical formulas',
        'Forgetting to balance chemical equations',
        'Misunderstanding equilibrium concepts'
      ],
      'AP Biology': [
        'Confusing mitosis and meiosis processes',
        'Misunderstanding natural selection mechanisms',
        'Forgetting about enzyme specificity'
      ],
      'AP Computer Science A': [
        'Confusing assignment and equality operators',
        'Forgetting array bounds checking',
        'Misunderstanding object references vs. values'
      ]
    };
    
    return mistakeMap[subject] || [
      `Misunderstanding fundamental ${topic} concepts`,
      `Rushing through ${topic} problems without careful analysis`,
      `Not connecting ${topic} to real-world applications`
    ];
  }

  async generateQuestionSets(
    subject: string, 
    topic: string, 
    difficulty: string, 
    userProfile: UserProfile
  ): Promise<QuestionSet[]> {
    console.log(`🎯 Generating personalized question sets for ${topic}`);
    
    if (this.hasOpenAI) {
      try {
        // Use OpenAI for more sophisticated question generation
        const questionSets = await this.generateOpenAIQuestionSets(subject, topic, difficulty, userProfile);
        console.log('✅ OpenAI question sets generated');
        return questionSets;
      } catch (error) {
        console.warn('⚠️ OpenAI question generation failed, using local generation:', error);
        return this.generateLocalQuestionSets(subject, topic, difficulty, userProfile);
      }
    } else {
      return this.generateLocalQuestionSets(subject, topic, difficulty, userProfile);
    }
  }

  private async generateOpenAIQuestionSets(
    subject: string, 
    topic: string, 
    difficulty: string, 
    userProfile: UserProfile
  ): Promise<QuestionSet[]> {
    // This would use OpenAI to generate more sophisticated, personalized questions
    // For now, fall back to local generation
    return this.generateLocalQuestionSets(subject, topic, difficulty, userProfile);
  }

  private generateLocalQuestionSets(
    subject: string, 
    topic: string, 
    difficulty: string, 
    userProfile: UserProfile
  ): QuestionSet[] {
    const questionSets: QuestionSet[] = [];
    
    // Generate different types of question sets
    const setTypes = [
      { title: 'Conceptual Understanding', type: 'multiple_choice' },
      { title: 'Problem Solving', type: 'problem_solving' },
      { title: 'Application', type: 'short_answer' }
    ];
    
    setTypes.forEach(setType => {
      const questions = [];
      
      for (let i = 0; i < 4; i++) {
        const question = this.generatePersonalizedQuestionForSet(
          subject, 
          topic, 
          difficulty, 
          setType.type as any, 
          userProfile,
          i
        );
        questions.push(question);
      }
      
      questionSets.push({
        title: setType.title,
        description: `${setType.title} questions for ${topic} in ${subject}`,
        difficulty,
        questions
      });
    });
    
    return questionSets;
  }

  private generatePersonalizedQuestionForSet(
    subject: string,
    topic: string,
    difficulty: string,
    type: 'multiple_choice' | 'short_answer' | 'essay' | 'problem_solving',
    userProfile: UserProfile,
    index: number
  ): any {
    const baseQuestion = this.getBaseQuestionForType(subject, topic, type, index);
    
    // Personalize based on user profile
    let personalizedQuestion = baseQuestion.question;
    let personalizedExplanation = baseQuestion.explanation;
    
    // Adjust for learning style
    if (userProfile.learningStyle === 'visual' && type === 'multiple_choice') {
      personalizedQuestion = personalizedQuestion.replace('Which', 'Looking at a diagram, which');
    } else if (userProfile.learningStyle === 'kinesthetic' && type === 'problem_solving') {
      personalizedQuestion = personalizedQuestion.replace('Calculate', 'Through hands-on practice, calculate');
    }
    
    // Adjust for difficulty and user level
    if (difficulty === 'Beginner' || userProfile.level < 3) {
      personalizedQuestion = personalizedQuestion.replace('advanced', 'basic');
      personalizedExplanation += ' Start with the fundamental concepts and build up your understanding step by step.';
    } else if (difficulty === 'Advanced' || userProfile.level > 7) {
      personalizedQuestion = personalizedQuestion.replace('basic', 'advanced');
      personalizedExplanation += ' Consider the broader implications and connections to other advanced topics.';
    }
    
    return {
      type,
      question: personalizedQuestion,
      options: baseQuestion.options,
      correctAnswer: baseQuestion.correctAnswer,
      explanation: personalizedExplanation,
      hint: this.generatePersonalizedHint(topic, difficulty, userProfile.learningStyle),
      points: this.calculatePoints(difficulty),
      concepts: this.extractConcepts(subject, topic),
      apSkills: this.identifyAPSkills(subject, topic),
      commonMistakes: this.generateCommonMistakes(subject, topic)
    };
  }

  private getBaseQuestionForType(
    subject: string,
    topic: string,
    type: string,
    index: number
  ): any {
    const questionBases = {
      multiple_choice: [
        {
          question: `Which of the following best describes the fundamental principle of ${topic}?`,
          options: [
            `The core concept that governs ${topic} behavior`,
            `A secondary characteristic of ${topic}`,
            `An unrelated mathematical formula`,
            `A historical footnote about ${topic}`
          ],
          correctAnswer: 0,
          explanation: `The fundamental principle of ${topic} is essential for understanding how it works and applies to different situations.`
        },
        {
          question: `How does ${topic} relate to other concepts in ${subject}?`,
          options: [
            `It connects through shared underlying principles`,
            `It operates in complete isolation`,
            `It contradicts other concepts`,
            `It has no meaningful relationships`
          ],
          correctAnswer: 0,
          explanation: `${topic} connects to other concepts in ${subject} through shared principles and complementary applications.`
        }
      ],
      problem_solving: [
        {
          question: `Solve this ${topic} problem: Given the conditions described, find the solution using appropriate ${topic} methods.`,
          options: [],
          correctAnswer: 'Step-by-step solution using established methods',
          explanation: `This problem requires applying ${topic} methods systematically to reach the correct solution.`
        }
      ],
      short_answer: [
        {
          question: `Explain how ${topic} is applied in real-world scenarios within ${subject}.`,
          options: [],
          correctAnswer: `Real-world applications demonstrate the practical importance of ${topic}`,
          explanation: `${topic} has numerous practical applications that demonstrate its relevance and importance in ${subject}.`
        }
      ]
    };
    
    const typeQuestions = questionBases[type as keyof typeof questionBases] || questionBases.multiple_choice;
    return typeQuestions[index % typeQuestions.length];
  }

  async trackSessionProgress(sessionData: any): Promise<void> {
    console.log('📊 Tracking session progress for AI adaptation:', sessionData);
    
    // Store session data for future personalization
    try {
      const progressKey = `ai_session_${sessionData.userId}_${Date.now()}`;
      localStorage.setItem(progressKey, JSON.stringify({
        ...sessionData,
        timestamp: new Date().toISOString()
      }));
      
      // Keep only recent sessions (last 50)
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith(`ai_session_${sessionData.userId}`));
      if (allKeys.length > 50) {
        const sortedKeys = allKeys.sort();
        const keysToRemove = sortedKeys.slice(0, allKeys.length - 50);
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      
      console.log('✅ Session progress tracked successfully');
    } catch (error) {
      console.error('❌ Error tracking session progress:', error);
    }
  }

  getPersonalizationInsights(userId: string): any {
    try {
      const sessionKeys = Object.keys(localStorage).filter(key => key.startsWith(`ai_session_${userId}`));
      const sessions = sessionKeys.map(key => JSON.parse(localStorage.getItem(key) || '{}'));
      
      if (sessions.length === 0) {
        return { hasData: false };
      }
      
      // Analyze session data for insights
      const totalSessions = sessions.length;
      const averageAccuracy = sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / totalSessions;
      const commonWeakAreas = this.identifyCommonWeakAreas(sessions);
      const preferredDifficulty = this.identifyPreferredDifficulty(sessions);
      const studyPatterns = this.identifyStudyPatterns(sessions);
      
      return {
        hasData: true,
        totalSessions,
        averageAccuracy,
        commonWeakAreas,
        preferredDifficulty,
        studyPatterns,
        lastSessionDate: sessions[sessions.length - 1]?.timestamp
      };
    } catch (error) {
      console.error('Error getting personalization insights:', error);
      return { hasData: false };
    }
  }

  private identifyCommonWeakAreas(sessions: any[]): string[] {
    const weakAreas: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      if (session.areasForImprovement) {
        session.areasForImprovement.forEach((area: string) => {
          weakAreas[area] = (weakAreas[area] || 0) + 1;
        });
      }
    });
    
    return Object.entries(weakAreas)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([area]) => area);
  }

  private identifyPreferredDifficulty(sessions: any[]): string {
    const difficultyPerformance: { [key: string]: number[] } = {};
    
    sessions.forEach(session => {
      const difficulty = session.difficulty || 'medium';
      if (!difficultyPerformance[difficulty]) {
        difficultyPerformance[difficulty] = [];
      }
      difficultyPerformance[difficulty].push(session.accuracy || 0);
    });
    
    let bestDifficulty = 'medium';
    let bestScore = 0;
    
    Object.entries(difficultyPerformance).forEach(([difficulty, accuracies]) => {
      const avgAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
      const consistencyBonus = accuracies.length > 3 ? 5 : 0; // Bonus for consistent practice
      const totalScore = avgAccuracy + consistencyBonus;
      
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestDifficulty = difficulty;
      }
    });
    
    return bestDifficulty;
  }

  private identifyStudyPatterns(sessions: any[]): any {
    const patterns = {
      preferredSessionLength: 0,
      mostActiveTimeOfDay: 'morning',
      averageQuestionsPerSession: 0,
      consistencyScore: 0
    };
    
    if (sessions.length === 0) return patterns;
    
    // Calculate average session length
    const durations = sessions.map(s => s.duration || 30);
    patterns.preferredSessionLength = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    // Calculate average questions per session
    const questionCounts = sessions.map(s => s.questionsAnswered || 5);
    patterns.averageQuestionsPerSession = questionCounts.reduce((sum, q) => sum + q, 0) / questionCounts.length;
    
    // Calculate consistency score (based on regular study intervals)
    const dates = sessions.map(s => new Date(s.timestamp || Date.now()));
    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
      const interval = dates[i].getTime() - dates[i-1].getTime();
      intervals.push(interval / (1000 * 60 * 60 * 24)); // Convert to days
    }
    
    if (intervals.length > 0) {
      const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
      patterns.consistencyScore = Math.max(0, 100 - (avgInterval - 1) * 10); // Penalty for gaps > 1 day
    }
    
    return patterns;
  }
}

export const aiEngine = new AIEngine();