// Enhanced AI Engine for AP Course Preparation with Question Generation
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
  questionSets?: QuestionSet[];
}

export interface QuestionSet {
  id: string;
  title: string;
  type: 'multiple_choice' | 'free_response' | 'problem_solving' | 'lab_analysis';
  difficulty: string;
  questions: Question[];
  timeLimit: number; // minutes
  passingScore: number;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'free_response' | 'calculation' | 'analysis';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
  points: number;
  concepts: string[];
  apSkills: string[];
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

export interface SessionProgress {
  sessionId: string;
  userId: string;
  subject: string;
  topic: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  starsEarned: number;
  conceptsMastered: string[];
  areasForImprovement: string[];
}

class APCourseEngine {
  private localizedEngine: LocalizedAPEngine;
  private progressTracker: ProgressTracker;

  constructor() {
    this.localizedEngine = new LocalizedAPEngine();
    this.progressTracker = new ProgressTracker();
  }

  public async generateStudyPlan(userProfile: UserProfile, goals: string[] = [], uploadedContent: string = ''): Promise<StudyPlan> {
    console.log('🤖 AP Engine: Starting AP study plan generation for:', userProfile.name);
    
    try {
      // Check if OpenAI API key is available
      const hasOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY && 
                           import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';

      if (hasOpenAIKey) {
        console.log('🔑 Attempting OpenAI API for enhanced AP study plan generation');
        return await this.generateWithOpenAI(userProfile, goals, uploadedContent);
      } else {
        console.log('⚡ Using localized AP engine (OpenAI key not configured)');
        return this.localizedEngine.generateStudyPlan(userProfile, goals, uploadedContent);
      }
    } catch (error) {
      console.error('❌ OpenAI generation failed, falling back to localized AP engine:', error);
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
    
    // Convert OpenAI response to our StudyPlan format with question generation
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
          assessments: this.generateAssessments(topic.name, topic.difficulty),
          questionSets: this.localizedEngine.generateQuestionSets(subject.name, topic.name, topic.difficulty, userProfile)
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

    console.log('✅ OpenAI AP study plan generated successfully');
    return studyPlan;
  }

  public async generateStudyContent(subject: string, topic: string, difficulty: string, learningStyle: string, userGoals?: string[]): Promise<any> {
    try {
      const hasOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY && 
                           import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';

      if (hasOpenAIKey) {
        return await openaiService.generateStudyContent(subject, topic, difficulty, learningStyle);
      } else {
        return this.localizedEngine.generateStudyContent(subject, topic, difficulty, learningStyle, userGoals);
      }
    } catch (error) {
      console.error('Content generation failed, using localized AP engine:', error);
      return this.localizedEngine.generateStudyContent(subject, topic, difficulty, learningStyle, userGoals);
    }
  }

  public async trackSessionProgress(sessionData: Partial<SessionProgress>): Promise<SessionProgress> {
    return this.progressTracker.recordSession(sessionData);
  }

  public async getProgressAnalytics(userId: string, timeframe: 'week' | 'month' | 'all' = 'week'): Promise<any> {
    return this.progressTracker.getAnalytics(userId, timeframe);
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
      title: `${topicName} - AP Practice Problems`,
      description: `AP-style practice problems for ${topicName}`,
      estimatedTime: 45,
      difficulty: 'medium'
    });

    return resources;
  }

  private generateAssessments(topicName: string, difficulty: string): Assessment[] {
    const assessments: Assessment[] = [
      {
        type: 'quiz',
        title: `${topicName} - AP Knowledge Check`,
        questions: difficulty === 'Expert' ? 15 : difficulty === 'Advanced' ? 12 : 8,
        estimatedTime: 20,
        passingScore: 75
      }
    ];

    if (difficulty === 'Advanced' || difficulty === 'Expert') {
      assessments.push({
        type: 'problem_set',
        title: `${topicName} - AP Practice Set`,
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
        action: 'Reduce difficulty and provide additional AP practice',
        description: 'Automatically adjusts content difficulty when struggling'
      },
      {
        trigger: 'High performance (> 90% accuracy)',
        action: 'Increase difficulty and introduce advanced AP topics',
        description: 'Challenges high performers with more complex AP material'
      },
      {
        trigger: 'Inconsistent study pattern',
        action: 'Send motivational reminders and adjust AP schedule',
        description: 'Helps maintain consistent AP study habits'
      }
    ];
  }

  private generateMilestoneRewards(week: number): string[] {
    const baseRewards = [`${week * 10} bonus stars`, 'AP Progress badge'];
    
    if (week % 4 === 0) {
      baseRewards.push('Special AP achievement unlock');
    }
    
    return baseRewards;
  }
}

// Advanced Localized AP Engine with Question Generation
class LocalizedAPEngine {
  private apKnowledgeBase: Map<string, any>;
  private contentAnalyzer: ContentAnalyzer;
  private questionGenerator: QuestionGenerator;

  constructor() {
    this.apKnowledgeBase = new Map();
    this.contentAnalyzer = new ContentAnalyzer();
    this.questionGenerator = new QuestionGenerator();
    this.initializeAPKnowledgeBase();
  }

  private initializeAPKnowledgeBase() {
    this.apKnowledgeBase.set('ap_courses', {
      'AP Calculus AB': {
        topics: {
          'Limits and Continuity': { 
            difficulty: 0.4, 
            time: 60, 
            category: 'foundation', 
            keywords: ['limits', 'continuity', 'asymptotes'],
            apSkills: ['Determining limits', 'Continuity analysis', 'Asymptotic behavior'],
            commonMistakes: ['Confusing one-sided limits', 'Misunderstanding removable discontinuities']
          },
          'Differentiation': { 
            difficulty: 0.6, 
            time: 75, 
            category: 'intermediate', 
            keywords: ['derivatives', 'chain rule', 'implicit'],
            apSkills: ['Computing derivatives', 'Chain rule application', 'Implicit differentiation'],
            commonMistakes: ['Forgetting chain rule', 'Sign errors in derivatives']
          },
          'Applications of Derivatives': { 
            difficulty: 0.7, 
            time: 80, 
            category: 'advanced', 
            keywords: ['optimization', 'related rates', 'motion'],
            apSkills: ['Optimization problems', 'Related rates', 'Motion analysis'],
            commonMistakes: ['Setting up optimization incorrectly', 'Unit errors in related rates']
          },
          'Integration': { 
            difficulty: 0.8, 
            time: 85, 
            category: 'advanced', 
            keywords: ['antiderivatives', 'fundamental theorem', 'substitution'],
            apSkills: ['Computing integrals', 'Substitution method', 'Fundamental theorem application'],
            commonMistakes: ['Forgetting +C', 'Incorrect substitution setup']
          },
          'Applications of Integration': { 
            difficulty: 0.9, 
            time: 90, 
            category: 'expert', 
            keywords: ['area', 'volume', 'accumulation'],
            apSkills: ['Area calculations', 'Volume by revolution', 'Accumulation functions'],
            commonMistakes: ['Wrong bounds of integration', 'Confusing disk vs washer method']
          }
        }
      },
      'AP Physics 1': {
        topics: {
          'Kinematics': { 
            difficulty: 0.5, 
            time: 60, 
            category: 'foundation', 
            keywords: ['motion', 'velocity', 'acceleration'],
            apSkills: ['Motion graphs', 'Kinematic equations', 'Free fall analysis'],
            commonMistakes: ['Confusing velocity and acceleration', 'Sign convention errors']
          },
          'Dynamics': { 
            difficulty: 0.6, 
            time: 70, 
            category: 'intermediate', 
            keywords: ['forces', 'newton laws', 'friction'],
            apSkills: ['Force analysis', 'Free body diagrams', 'Newton\'s laws application'],
            commonMistakes: ['Missing forces in FBD', 'Confusing mass and weight']
          },
          'Circular Motion and Gravitation': { 
            difficulty: 0.7, 
            time: 75, 
            category: 'advanced', 
            keywords: ['centripetal', 'gravity', 'orbits'],
            apSkills: ['Centripetal force', 'Gravitational force', 'Orbital mechanics'],
            commonMistakes: ['Centrifugal force misconception', 'Incorrect radius in circular motion']
          },
          'Energy': { 
            difficulty: 0.6, 
            time: 65, 
            category: 'intermediate', 
            keywords: ['kinetic', 'potential', 'conservation'],
            apSkills: ['Energy conservation', 'Work-energy theorem', 'Power calculations'],
            commonMistakes: ['Not accounting for all energy forms', 'Sign errors in work']
          },
          'Momentum': { 
            difficulty: 0.7, 
            time: 70, 
            category: 'advanced', 
            keywords: ['impulse', 'collisions', 'conservation'],
            apSkills: ['Momentum conservation', 'Impulse-momentum theorem', 'Collision analysis'],
            commonMistakes: ['Not considering vector nature', 'Confusing elastic vs inelastic']
          }
        }
      },
      'AP Chemistry': {
        topics: {
          'Atomic Structure and Properties': { 
            difficulty: 0.5, 
            time: 60, 
            category: 'foundation', 
            keywords: ['atoms', 'electrons', 'periodic trends'],
            apSkills: ['Electron configuration', 'Periodic trends', 'Atomic structure'],
            commonMistakes: ['Incorrect electron configuration', 'Confusing ionization energy trends']
          },
          'Molecular and Ionic Compound Structure': { 
            difficulty: 0.6, 
            time: 65, 
            category: 'intermediate', 
            keywords: ['bonding', 'lewis structures', 'molecular geometry'],
            apSkills: ['Lewis structures', 'VSEPR theory', 'Hybridization'],
            commonMistakes: ['Incorrect formal charges', 'Wrong molecular geometry prediction']
          },
          'Kinetics': { 
            difficulty: 0.8, 
            time: 80, 
            category: 'advanced', 
            keywords: ['reaction rates', 'rate laws', 'mechanisms'],
            apSkills: ['Rate law determination', 'Mechanism analysis', 'Activation energy'],
            commonMistakes: ['Confusing rate and rate constant', 'Incorrect mechanism steps']
          },
          'Equilibrium': { 
            difficulty: 0.8, 
            time: 80, 
            category: 'advanced', 
            keywords: ['le chatelier', 'equilibrium constant', 'ice tables'],
            apSkills: ['Equilibrium calculations', 'Le Chatelier\'s principle', 'ICE tables'],
            commonMistakes: ['Incorrect ICE table setup', 'Wrong equilibrium expression']
          }
        }
      },
      'AP Biology': {
        topics: {
          'Chemistry of Life': { 
            difficulty: 0.5, 
            time: 60, 
            category: 'foundation', 
            keywords: ['water', 'carbon', 'macromolecules'],
            apSkills: ['Macromolecule structure', 'Chemical bonding', 'pH and buffers'],
            commonMistakes: ['Confusing polymer types', 'pH calculation errors']
          },
          'Cell Structure and Function': { 
            difficulty: 0.6, 
            time: 65, 
            category: 'intermediate', 
            keywords: ['organelles', 'membrane', 'transport'],
            apSkills: ['Organelle functions', 'Membrane transport', 'Cell communication'],
            commonMistakes: ['Confusing organelle functions', 'Misunderstanding transport types']
          },
          'Cellular Energetics': { 
            difficulty: 0.7, 
            time: 75, 
            category: 'advanced', 
            keywords: ['photosynthesis', 'cellular respiration', 'enzymes'],
            apSkills: ['Energy pathways', 'Enzyme kinetics', 'ATP synthesis'],
            commonMistakes: ['Confusing photosynthesis and respiration', 'Enzyme inhibition types']
          }
        }
      },
      'AP Computer Science A': {
        topics: {
          'Primitive Types': { 
            difficulty: 0.4, 
            time: 50, 
            category: 'foundation', 
            keywords: ['int', 'double', 'boolean', 'operators'],
            apSkills: ['Variable declaration', 'Arithmetic operations', 'Type casting'],
            commonMistakes: ['Integer division truncation', 'Operator precedence']
          },
          'Using Objects': { 
            difficulty: 0.5, 
            time: 60, 
            category: 'foundation', 
            keywords: ['classes', 'methods', 'string'],
            apSkills: ['Object instantiation', 'Method calls', 'String manipulation'],
            commonMistakes: ['Null pointer exceptions', 'String immutability confusion']
          },
          'Boolean Expressions and if Statements': { 
            difficulty: 0.5, 
            time: 55, 
            category: 'foundation', 
            keywords: ['conditionals', 'logical operators', 'control flow'],
            apSkills: ['Boolean logic', 'Conditional statements', 'Logical operators'],
            commonMistakes: ['Assignment vs equality', 'Short-circuit evaluation']
          },
          'Iteration': { 
            difficulty: 0.6, 
            time: 65, 
            category: 'intermediate', 
            keywords: ['for loops', 'while loops', 'nested loops'],
            apSkills: ['Loop construction', 'Loop control', 'Nested iteration'],
            commonMistakes: ['Off-by-one errors', 'Infinite loops']
          },
          'Writing Classes': { 
            difficulty: 0.7, 
            time: 75, 
            category: 'advanced', 
            keywords: ['constructors', 'instance variables', 'methods'],
            apSkills: ['Class design', 'Encapsulation', 'Method overloading'],
            commonMistakes: ['Public vs private access', 'Constructor chaining']
          }
        }
      }
    });

    // Learning patterns specific to AP courses
    this.apKnowledgeBase.set('learning_patterns', {
      'visual': {
        preferences: ['diagrams', 'charts', 'concept maps', 'timelines'],
        content_types: ['interactive_visualization', 'concept_mapping', 'flowcharts'],
        difficulty_adjustment: 0.9
      },
      'auditory': {
        preferences: ['lectures', 'discussions', 'audio explanations', 'verbal practice'],
        content_types: ['audio_content', 'discussion_prompts', 'verbal_explanations'],
        difficulty_adjustment: 1.0
      },
      'kinesthetic': {
        preferences: ['hands-on', 'experiments', 'simulations', 'practice problems'],
        content_types: ['interactive_simulations', 'lab_exercises', 'problem_solving'],
        difficulty_adjustment: 1.1
      },
      'reading': {
        preferences: ['text-based', 'articles', 'textbooks', 'written explanations'],
        content_types: ['comprehensive_guides', 'detailed_explanations', 'case_studies'],
        difficulty_adjustment: 1.0
      }
    });
  }

  public generateStudyPlan(userProfile: UserProfile, goals: string[] = [], uploadedContent: string = ''): StudyPlan {
    console.log('🧠 Localized AP Engine: Generating AP study plan with content analysis');
    
    // Analyze uploaded content if provided
    const contentAnalysis = uploadedContent ? this.contentAnalyzer.analyzeContent(uploadedContent) : null;
    
    // Select AP courses based on goals, weak areas, and content analysis
    const subjects = this.selectOptimalAPCourses(userProfile, goals, contentAnalysis);
    
    // Generate question sets for each topic
    subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        topic.questionSets = this.generateQuestionSets(subject.name, topic.name, topic.difficulty, userProfile, goals);
      });
    });
    
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

  public generateQuestionSets(subject: string, topic: string, difficulty: string, userProfile: UserProfile, userGoals?: string[]): QuestionSet[] {
    return this.questionGenerator.generateForTopic(subject, topic, difficulty, userProfile, userGoals);
  }

  public generateStudyContent(subject: string, topic: string, difficulty: string, learningStyle: string, userGoals?: string[]): any {
    const apCoursesData = this.apKnowledgeBase.get('ap_courses');
    const topicData = apCoursesData[subject]?.topics[topic];
    
    if (!topicData) {
      return this.generateGenericAPContent(subject, topic, difficulty, learningStyle, userGoals);
    }

    return this.generateSpecificAPContent(subject, topic, difficulty, learningStyle, topicData, userGoals);
  }

  private selectOptimalAPCourses(userProfile: UserProfile, goals: string[], contentAnalysis: any): StudySubject[] {
    const subjects: StudySubject[] = [];
    const apCoursesData = this.apKnowledgeBase.get('ap_courses');
    const availableCourses = Object.keys(apCoursesData);

    // Priority 1: Courses from content analysis
    if (contentAnalysis?.detectedSubjects) {
      contentAnalysis.detectedSubjects.forEach((detectedSubject: string) => {
        const matchingCourse = this.findBestAPCourseMatch(detectedSubject, availableCourses);
        if (matchingCourse && !subjects.find(s => s.name === matchingCourse)) {
          subjects.push(this.createAPStudySubject(
            matchingCourse, 
            'high', 
            userProfile, 
            apCoursesData[matchingCourse],
            `Identified from your uploaded content as a key AP focus area`
          ));
        }
      });
    }

    // Priority 2: Weak areas mapped to AP courses
    userProfile.weakAreas.forEach(weakArea => {
      const matchingCourse = this.findBestAPCourseMatch(weakArea, availableCourses);
      if (matchingCourse && !subjects.find(s => s.name === matchingCourse)) {
        subjects.push(this.createAPStudySubject(
          matchingCourse, 
          'high', 
          userProfile, 
          apCoursesData[matchingCourse],
          `Addressing identified weak area: ${weakArea}`
        ));
      }
    });

    // Priority 3: Goals-based AP courses
    goals.forEach(goal => {
      const matchingCourse = this.findBestAPCourseMatch(goal, availableCourses);
      if (matchingCourse && !subjects.find(s => s.name === matchingCourse)) {
        subjects.push(this.createAPStudySubject(
          matchingCourse, 
          'medium', 
          userProfile, 
          apCoursesData[matchingCourse],
          `Supporting your goal: ${goal}`
        ));
      }
    });

    // Add default AP courses if none found
    if (subjects.length === 0) {
      const defaultCourses = ['AP Calculus AB', 'AP Physics 1'];
      defaultCourses.forEach(courseName => {
        if (apCoursesData[courseName]) {
          subjects.push(this.createAPStudySubject(
            courseName, 
            'medium', 
            userProfile, 
            apCoursesData[courseName],
            'Foundational AP course for comprehensive preparation'
          ));
        }
      });
    }

    return subjects.slice(0, 3); // Limit to 3 AP courses for focus
  }

  private findBestAPCourseMatch(searchTerm: string, availableCourses: string[]): string | null {
    const searchLower = searchTerm.toLowerCase();
    
    // Exact match
    const exactMatch = availableCourses.find(course => 
      course.toLowerCase().includes(searchLower) || 
      searchLower.includes(course.toLowerCase().replace('ap ', ''))
    );
    if (exactMatch) return exactMatch;

    // Subject mapping
    const subjectMap: { [key: string]: string } = {
      'calculus': 'AP Calculus AB',
      'physics': 'AP Physics 1',
      'chemistry': 'AP Chemistry',
      'biology': 'AP Biology',
      'computer science': 'AP Computer Science A',
      'statistics': 'AP Statistics',
      'english': 'AP English Language',
      'literature': 'AP English Literature',
      'history': 'AP US History'
    };

    for (const [key, course] of Object.entries(subjectMap)) {
      if (searchLower.includes(key)) {
        return course;
      }
    }

    return null;
  }

  private createAPStudySubject(
    courseName: string, 
    priority: 'high' | 'medium' | 'low', 
    userProfile: UserProfile, 
    courseData: any,
    reasoning: string
  ): StudySubject {
    const topics = this.selectTopicsForAPCourse(courseData, userProfile);
    
    return {
      name: courseName,
      priority,
      timeAllocation: priority === 'high' ? 40 : priority === 'medium' ? 35 : 25,
      topics,
      reasoning
    };
  }

  private selectTopicsForAPCourse(courseData: any, userProfile: UserProfile): Topic[] {
    const topics: Topic[] = [];
    const topicsData = courseData.topics;
    const learningPattern = this.apKnowledgeBase.get('learning_patterns')[userProfile.learningStyle || 'visual'];
    
    // Sort topics by difficulty and select based on user level
    const sortedTopics = Object.entries(topicsData)
      .sort(([, a], [, b]) => (a as any).difficulty - (b as any).difficulty)
      .slice(0, 6); // Limit to 6 topics per AP course

    sortedTopics.forEach(([topicName, topicInfo]: [string, any]) => {
      const adjustedDifficulty = topicInfo.difficulty * learningPattern.difficulty_adjustment;
      
      topics.push({
        name: topicName,
        difficulty: this.mapDifficultyToString(adjustedDifficulty),
        estimatedTime: Math.round(topicInfo.time * (userProfile.timeAvailable || 60) / 60),
        prerequisites: this.generatePrerequisites(topicName, topicsData),
        learningObjectives: this.generateAPLearningObjectives(topicName, topicInfo),
        resources: this.generateTopicResources(topicName, userProfile.learningStyle || 'visual'),
        assessments: this.generateTopicAssessments(topicName, adjustedDifficulty)
      });
    });

    return topics;
  }

  private generateSpecificAPContent(subject: string, topic: string, difficulty: string, learningStyle: string, topicData: any, userGoals?: string[]): any {
    const keywords = topicData.keywords || [];
    const apSkills = topicData.apSkills || [];
    const category = topicData.category || 'foundation';
    
    // Generate content based on user goals if provided
    const goalContext = userGoals ? ` focusing on your goals: ${userGoals.join(', ')}` : '';
    
    return {
      type: category === 'foundation' ? 'theory' : 'application',
      title: `${topic} - AP ${category.charAt(0).toUpperCase() + category.slice(1)} Level`,
      question: `How do ${keywords.slice(0, 2).join(' and ')} relate to ${topic} on the AP exam${goalContext}?`,
      options: [
        `They are fundamental components tested on the AP exam`,
        `They are advanced applications for AP free response`,
        `They are prerequisites for understanding AP ${topic}`,
        `They are related but separate AP concepts`
      ],
      correct: 0,
      explanation: `In AP ${topic}, ${keywords.slice(0, 2).join(' and ')} serve as key building blocks that help understand the broader concepts and applications tested on the AP exam. ${apSkills.length > 0 ? `Key AP skills include: ${apSkills.join(', ')}.` : ''}`,
      hint: `Consider how ${keywords[0]} connects to the main principles of ${topic} for AP success.`,
      points: Math.round(topicData.difficulty * 20),
      difficulty: difficulty.toLowerCase(),
      concepts: [topic, ...keywords.slice(0, 3)],
      apSkills: apSkills.slice(0, 3),
      visualAid: `${topic.toLowerCase()}_${learningStyle}_ap_aid`,
      audioExplanation: 'Available',
      interactiveElement: this.getInteractiveElement(learningStyle, topic),
      commonMistakes: topicData.commonMistakes || []
    };
  }

  private generateGenericAPContent(subject: string, topic: string, difficulty: string, learningStyle: string, userGoals?: string[]): any {
    const goalContext = userGoals ? ` aligned with your goals: ${userGoals.join(', ')}` : '';
    
    return {
      type: 'theory',
      title: `${topic} - AP Fundamentals`,
      question: `What are the key AP concepts in ${topic}${goalContext}?`,
      options: [
        'Fundamental principles and AP applications',
        'Advanced theoretical frameworks for AP exam',
        'Practical implementation strategies for AP',
        'Integration with related AP topics'
      ],
      correct: 0,
      explanation: `${topic} involves understanding core principles and their practical applications in ${subject} for the AP exam.`,
      hint: `Focus on the fundamental concepts first before moving to advanced AP applications.`,
      points: 10,
      difficulty: difficulty.toLowerCase(),
      concepts: [topic, subject, 'AP Problem Solving'],
      apSkills: ['Analysis', 'Application', 'Synthesis'],
      visualAid: `${topic.toLowerCase()}_ap_diagram`,
      audioExplanation: 'Available',
      interactiveElement: 'ap_concept_builder',
      commonMistakes: ['Rushing through fundamentals', 'Not practicing enough']
    };
  }

  // ... (continuing with other methods - same as before but with enhanced question generation)

  private getInteractiveElement(learningStyle: string, topic: string): string {
    const elements = {
      'visual': 'interactive_ap_diagram',
      'auditory': 'ap_audio_explanation',
      'kinesthetic': 'hands_on_ap_simulation',
      'reading': 'detailed_ap_text_analysis'
    };
    return elements[learningStyle as keyof typeof elements] || 'ap_concept_builder';
  }

  private generateMilestones(subjects: StudySubject[], userProfile: UserProfile): Milestone[] {
    const milestones: Milestone[] = [];
    const totalWeeks = Math.ceil(this.calculateOptimalDuration(subjects, userProfile) / 7);

    for (let week = 1; week <= Math.min(totalWeeks, 16); week++) {
      const subjectsThisWeek = subjects.slice(0, Math.ceil(subjects.length * week / totalWeeks));
      
      milestones.push({
        week,
        title: `Week ${week}: ${this.generateAPMilestoneTitle(week, subjectsThisWeek)}`,
        description: this.generateAPMilestoneDescription(week, subjectsThisWeek),
        successCriteria: this.generateAPSuccessCriteria(week, subjectsThisWeek),
        rewards: this.generateMilestoneRewards(week)
      });
    }

    return milestones;
  }

  private generateAPMilestoneTitle(week: number, subjects: StudySubject[]): string {
    if (week <= 3) return 'AP Foundation Building';
    if (week <= 8) return 'AP Core Concepts';
    if (week <= 12) return 'AP Advanced Applications';
    return 'AP Exam Preparation';
  }

  private generateAPMilestoneDescription(week: number, subjects: StudySubject[]): string {
    const subjectNames = subjects.map(s => s.name).join(', ');
    return `Focus on ${subjectNames} with emphasis on ${this.generateAPMilestoneTitle(week, subjects).toLowerCase()}`;
  }

  private generateAPSuccessCriteria(week: number, subjects: StudySubject[]): string[] {
    const criteria = [
      `Complete ${week * 2} AP practice problems`,
      `Achieve ${Math.min(70 + week * 2, 90)}%+ accuracy on AP assessments`,
      `Study for ${Math.min(30 + week * 10, 90)} minutes daily`
    ];

    if (week > 8) {
      criteria.push('Complete AP practice exam sections');
    }

    return criteria;
  }

  private generateAdaptiveFeatures(userProfile: UserProfile): AdaptiveFeature[] {
    const features = [
      {
        trigger: 'Low AP performance detected (< 70% accuracy)',
        action: 'Reduce difficulty and provide additional AP foundational content',
        description: 'Automatically adapts to your AP learning pace and provides extra support'
      },
      {
        trigger: 'High AP performance detected (> 90% accuracy)',
        action: 'Introduce more challenging AP content and exam-level questions',
        description: 'Keeps you challenged and accelerates AP learning when ready'
      },
      {
        trigger: 'Inconsistent AP study pattern detected',
        action: 'Adjust AP schedule and send motivational reminders',
        description: 'Helps maintain consistent AP study habits and momentum'
      }
    ];

    if (userProfile.learningStyle === 'kinesthetic') {
      features.push({
        trigger: 'Extended reading sessions in AP content',
        action: 'Suggest interactive AP exercises and hands-on activities',
        description: 'Adapts AP content delivery to match your kinesthetic learning style'
      });
    }

    return features;
  }

  private generateRecommendations(userProfile: UserProfile, contentAnalysis: any): string[] {
    const recommendations = [
      'Maintain consistent daily AP study schedule for optimal retention',
      'Use active recall techniques with AP practice questions',
      'Take regular breaks using the Pomodoro Technique during AP study',
      'Review previous AP topics weekly to strengthen long-term memory',
      'Practice with official AP exam questions and timing'
    ];

    // Learning style specific recommendations
    const learningPattern = this.apKnowledgeBase.get('learning_patterns')[userProfile.learningStyle || 'visual'];
    recommendations.push(`Leverage ${learningPattern.preferences.join(', ')} for enhanced AP learning`);

    // Content-specific recommendations
    if (contentAnalysis?.complexity === 'high') {
      recommendations.push('Break down complex AP topics into smaller, manageable chunks');
    }

    if (userProfile.currentStreak < 7) {
      recommendations.push('Focus on building a consistent AP study habit before increasing intensity');
    }

    return recommendations;
  }

  private generatePlanTitle(userProfile: UserProfile, subjects: StudySubject[], contentAnalysis: any): string {
    const subjectNames = subjects.slice(0, 2).map(s => s.name.replace('AP ', '')).join(' & ');
    const focusArea = contentAnalysis?.primaryFocus || 'Comprehensive AP Preparation';
    return `${userProfile.name}'s ${focusArea}: ${subjectNames}`;
  }

  private generatePlanDescription(subjects: StudySubject[], userProfile: UserProfile, contentAnalysis: any): string {
    const subjectList = subjects.map(s => s.name).join(', ');
    const contentNote = contentAnalysis ? ' incorporating your uploaded materials' : '';
    return `A personalized AP study plan focusing on ${subjectList}, designed for ${userProfile.learningStyle} learners${contentNote}. This plan addresses your specific AP learning goals while building on your existing strengths.`;
  }

  private generateEstimatedOutcome(subjects: StudySubject[], userProfile: UserProfile): string {
    const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const timeFrame = this.calculateOptimalDuration(subjects, userProfile);
    return `Expected to master ${totalTopics} key AP topics across ${subjects.length} courses within ${timeFrame} days, with significant improvement in AP exam readiness and overall academic performance.`;
  }

  private calculateOptimalDuration(subjects: StudySubject[], userProfile: UserProfile): number {
    const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const baseTime = totalTopics * 4; // 4 days per AP topic
    const difficultyMultiplier = userProfile.level < 5 ? 1.4 : userProfile.level > 15 ? 0.9 : 1.0;
    return Math.max(30, Math.min(Math.round(baseTime * difficultyMultiplier), 120));
  }

  private determineDifficulty(userProfile: UserProfile): string {
    if (userProfile.level > 15 && userProfile.totalStars > 500) return 'AP Challenging';
    if (userProfile.level < 5 || userProfile.totalStars < 100) return 'AP Supportive';
    return 'AP Balanced';
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
    
    // Adjust based on AP course difficulty
    const avgDifficulty = subjects.reduce((sum, s) => 
      sum + s.topics.reduce((topicSum, t) => topicSum + this.mapStringToNumericDifficulty(t.difficulty), 0) / s.topics.length, 0
    ) / subjects.length;
    
    confidence -= Math.round(avgDifficulty * 8);
    
    return Math.max(65, Math.min(95, confidence));
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

  private generateAPLearningObjectives(topicName: string, topicInfo: any): string[] {
    const objectives = [
      `Master fundamental concepts of ${topicName} for AP exam`,
      `Apply ${topicName} principles to AP-style problems`,
      `Analyze complex AP scenarios involving ${topicName}`
    ];

    if (topicInfo.category === 'advanced' || topicInfo.category === 'expert') {
      objectives.push(`Synthesize ${topicName} knowledge for AP free response questions`);
    }

    return objectives;
  }

  private generateTopicResources(topicName: string, learningStyle: string): Resource[] {
    const learningPattern = this.apKnowledgeBase.get('learning_patterns')[learningStyle];
    const resources: Resource[] = [];

    learningPattern.content_types.forEach((contentType: string) => {
      resources.push({
        type: this.mapContentTypeToResourceType(contentType),
        title: `${topicName} - ${this.formatContentType(contentType)}`,
        description: `AP-focused ${this.formatContentType(contentType)} for ${topicName}`,
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
        title: `${topicName} - AP Knowledge Check`,
        questions: Math.round(8 + difficulty * 10),
        estimatedTime: Math.round(15 + difficulty * 15),
        passingScore: Math.round(70 + difficulty * 10)
      }
    ];

    if (difficulty > 0.6) {
      assessments.push({
        type: 'problem_set',
        title: `${topicName} - AP Practice Set`,
        questions: Math.round(5 + difficulty * 8),
        estimatedTime: Math.round(30 + difficulty * 20),
        passingScore: Math.round(65 + difficulty * 15)
      });
    }

    return assessments;
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
    const baseRewards = [`${week * 15} bonus stars`, 'AP Progress badge'];
    
    if (week % 2 === 0) {
      baseRewards.push('AP study streak bonus');
    }
    
    if (week % 4 === 0) {
      baseRewards.push('Special AP achievement unlock');
    }
    
    if (week >= 12) {
      baseRewards.push('AP mastery certificate');
    }
    
    return baseRewards;
  }
}

// Question Generator for AP Content
class QuestionGenerator {
  private questionTemplates: Map<string, any>;

  constructor() {
    this.questionTemplates = new Map();
    this.initializeQuestionTemplates();
  }

  private initializeQuestionTemplates() {
    this.questionTemplates.set('AP Calculus AB', {
      'Limits and Continuity': {
        multiple_choice: [
          {
            template: "What is the limit of {function} as x approaches {value}?",
            options: ["{correct_answer}", "{distractor1}", "{distractor2}", "The limit does not exist"],
            concepts: ['limits', 'continuity', 'asymptotes']
          },
          {
            template: "At which point is the function f(x) = {function} discontinuous?",
            options: ["x = {correct_answer}", "x = {distractor1}", "x = {distractor2}", "The function is continuous everywhere"],
            concepts: ['discontinuity', 'continuity', 'function analysis']
          }
        ],
        free_response: [
          {
            template: "Given f(x) = {function}, find all points of discontinuity and classify each type. Justify your answer.",
            concepts: ['discontinuity classification', 'limit analysis', 'function behavior']
          }
        ]
      },
      'Differentiation': {
        multiple_choice: [
          {
            template: "Find the derivative of f(x) = {function}",
            options: ["{correct_derivative}", "{common_mistake1}", "{common_mistake2}", "{common_mistake3}"],
            concepts: ['derivatives', 'differentiation rules', 'chain rule']
          }
        ],
        problem_solving: [
          {
            template: "Use implicit differentiation to find dy/dx for the equation {equation}",
            concepts: ['implicit differentiation', 'chain rule', 'algebraic manipulation']
          }
        ]
      }
    });

    this.questionTemplates.set('AP Physics 1', {
      'Kinematics': {
        multiple_choice: [
          {
            template: "A ball is thrown upward with initial velocity {velocity} m/s. What is its velocity after {time} seconds?",
            options: ["{correct_velocity} m/s", "{distractor1} m/s", "{distractor2} m/s", "{distractor3} m/s"],
            concepts: ['kinematics', 'projectile motion', 'velocity']
          }
        ],
        problem_solving: [
          {
            template: "A car accelerates from rest at {acceleration} m/s² for {time} seconds, then maintains constant velocity. Find the total distance traveled in {total_time} seconds.",
            concepts: ['kinematics equations', 'acceleration', 'distance calculations']
          }
        ]
      },
      'Dynamics': {
        multiple_choice: [
          {
            template: "A {mass} kg object is pulled by a force of {force} N. If the coefficient of friction is {friction}, what is the acceleration?",
            options: ["{correct_acceleration} m/s²", "{distractor1} m/s²", "{distractor2} m/s²", "{distractor3} m/s²"],
            concepts: ['Newton\'s laws', 'friction', 'force analysis']
          }
        ],
        lab_analysis: [
          {
            template: "Design an experiment to determine the coefficient of kinetic friction between two surfaces. Include variables, procedure, and data analysis.",
            concepts: ['experimental design', 'friction', 'data analysis']
          }
        ]
      }
    });

    this.questionTemplates.set('AP Chemistry', {
      'Atomic Structure and Properties': {
        multiple_choice: [
          {
            template: "Which element has the electron configuration {electron_config}?",
            options: ["{correct_element}", "{distractor1}", "{distractor2}", "{distractor3}"],
            concepts: ['electron configuration', 'periodic table', 'atomic structure']
          }
        ],
        problem_solving: [
          {
            template: "Calculate the wavelength of light emitted when an electron transitions from n={initial} to n={final} in a hydrogen atom.",
            concepts: ['atomic spectra', 'energy levels', 'electromagnetic radiation']
          }
        ]
      },
      'Equilibrium': {
        multiple_choice: [
          {
            template: "For the reaction {reaction}, if Kc = {kc_value}, what is the equilibrium concentration of {species}?",
            options: ["{correct_concentration} M", "{distractor1} M", "{distractor2} M", "{distractor3} M"],
            concepts: ['equilibrium constant', 'ICE tables', 'concentration calculations']
          }
        ],
        free_response: [
          {
            template: "A {volume} L container initially contains {initial_conditions}. Calculate all equilibrium concentrations for the reaction {reaction} with Kc = {kc_value}.",
            concepts: ['equilibrium calculations', 'ICE tables', 'quadratic equations']
          }
        ]
      }
    });

    this.questionTemplates.set('AP Computer Science A', {
      'Iteration': {
        multiple_choice: [
          {
            template: "What is the output of the following code?\n{code_snippet}",
            options: ["{correct_output}", "{distractor1}", "{distractor2}", "Compilation error"],
            concepts: ['loops', 'iteration', 'code tracing']
          }
        ],
        problem_solving: [
          {
            template: "Write a method that {task_description} using a {loop_type} loop.",
            concepts: ['loop construction', 'algorithm design', 'method implementation']
          }
        ]
      },
      'Writing Classes': {
        free_response: [
          {
            template: "Design a class {class_name} that {class_description}. Include appropriate constructors, instance variables, and methods.",
            concepts: ['class design', 'encapsulation', 'object-oriented programming']
          }
        ]
      }
    });
  }

  public generateForTopic(subject: string, topic: string, difficulty: string, userProfile: UserProfile, userGoals?: string[]): QuestionSet[] {
    const templates = this.questionTemplates.get(subject)?.[topic];
    if (!templates) {
      return this.generateGenericQuestionSet(subject, topic, difficulty, userProfile);
    }

    const questionSets: QuestionSet[] = [];
    const difficultyLevel = this.mapDifficultyToNumeric(difficulty);

    // Generate multiple choice questions
    if (templates.multiple_choice) {
      const mcQuestions = this.generateMultipleChoiceQuestions(templates.multiple_choice, difficultyLevel, userProfile, userGoals);
      questionSets.push({
        id: `${subject}_${topic}_mc_${Date.now()}`,
        title: `${topic} - Multiple Choice Practice`,
        type: 'multiple_choice',
        difficulty,
        questions: mcQuestions,
        timeLimit: mcQuestions.length * 2, // 2 minutes per question
        passingScore: 70
      });
    }

    // Generate free response questions
    if (templates.free_response) {
      const frQuestions = this.generateFreeResponseQuestions(templates.free_response, difficultyLevel, userProfile, userGoals);
      questionSets.push({
        id: `${subject}_${topic}_fr_${Date.now()}`,
        title: `${topic} - Free Response Practice`,
        type: 'free_response',
        difficulty,
        questions: frQuestions,
        timeLimit: frQuestions.length * 15, // 15 minutes per question
        passingScore: 65
      });
    }

    // Generate problem solving questions
    if (templates.problem_solving) {
      const psQuestions = this.generateProblemSolvingQuestions(templates.problem_solving, difficultyLevel, userProfile, userGoals);
      questionSets.push({
        id: `${subject}_${topic}_ps_${Date.now()}`,
        title: `${topic} - Problem Solving Practice`,
        type: 'problem_solving',
        difficulty,
        questions: psQuestions,
        timeLimit: psQuestions.length * 10, // 10 minutes per question
        passingScore: 75
      });
    }

    return questionSets;
  }

  private generateMultipleChoiceQuestions(templates: any[], difficultyLevel: number, userProfile: UserProfile, userGoals?: string[]): Question[] {
    const questions: Question[] = [];
    const numQuestions = Math.min(Math.max(3, Math.round(difficultyLevel * 8)), 10);

    for (let i = 0; i < numQuestions; i++) {
      const template = templates[i % templates.length];
      const question = this.populateQuestionTemplate(template, difficultyLevel, userProfile, userGoals);
      questions.push({
        id: `mc_${Date.now()}_${i}`,
        type: 'multiple_choice',
        question: question.text,
        options: question.options,
        correctAnswer: 0, // First option is always correct in our template
        explanation: question.explanation,
        hint: question.hint,
        points: Math.round(5 + difficultyLevel * 10),
        concepts: template.concepts,
        apSkills: question.apSkills || ['Analysis', 'Application']
      });
    }

    return questions;
  }

  private generateFreeResponseQuestions(templates: any[], difficultyLevel: number, userProfile: UserProfile, userGoals?: string[]): Question[] {
    const questions: Question[] = [];
    const numQuestions = Math.min(Math.max(1, Math.round(difficultyLevel * 3)), 4);

    for (let i = 0; i < numQuestions; i++) {
      const template = templates[i % templates.length];
      const question = this.populateQuestionTemplate(template, difficultyLevel, userProfile, userGoals);
      questions.push({
        id: `fr_${Date.now()}_${i}`,
        type: 'free_response',
        question: question.text,
        correctAnswer: question.sampleAnswer,
        explanation: question.explanation,
        hint: question.hint,
        points: Math.round(10 + difficultyLevel * 15),
        concepts: template.concepts,
        apSkills: question.apSkills || ['Analysis', 'Synthesis', 'Evaluation']
      });
    }

    return questions;
  }

  private generateProblemSolvingQuestions(templates: any[], difficultyLevel: number, userProfile: UserProfile, userGoals?: string[]): Question[] {
    const questions: Question[] = [];
    const numQuestions = Math.min(Math.max(2, Math.round(difficultyLevel * 5)), 6);

    for (let i = 0; i < numQuestions; i++) {
      const template = templates[i % templates.length];
      const question = this.populateQuestionTemplate(template, difficultyLevel, userProfile, userGoals);
      questions.push({
        id: `ps_${Date.now()}_${i}`,
        type: 'calculation',
        question: question.text,
        correctAnswer: question.answer,
        explanation: question.explanation,
        hint: question.hint,
        points: Math.round(8 + difficultyLevel * 12),
        concepts: template.concepts,
        apSkills: question.apSkills || ['Problem Solving', 'Mathematical Reasoning']
      });
    }

    return questions;
  }

  private populateQuestionTemplate(template: any, difficultyLevel: number, userProfile: UserProfile, userGoals?: string[]): any {
    // This is a simplified version - in a real implementation, you'd have more sophisticated
    // template population based on the specific subject and user context
    const goalContext = userGoals ? ` (focusing on: ${userGoals.slice(0, 2).join(', ')})` : '';
    
    return {
      text: template.template + goalContext,
      options: template.options || [],
      explanation: `This question tests your understanding of ${template.concepts.join(', ')}. ${goalContext}`,
      hint: `Consider the key concepts: ${template.concepts.slice(0, 2).join(' and ')}.`,
      answer: "Sample answer based on template",
      sampleAnswer: "Detailed sample response for free response questions",
      apSkills: ['Analysis', 'Application', 'Synthesis'].slice(0, Math.ceil(difficultyLevel * 3))
    };
  }

  private generateGenericQuestionSet(subject: string, topic: string, difficulty: string, userProfile: UserProfile): QuestionSet[] {
    const difficultyLevel = this.mapDifficultyToNumeric(difficulty);
    const numQuestions = Math.max(3, Math.round(difficultyLevel * 6));

    const questions: Question[] = [];
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        id: `generic_${Date.now()}_${i}`,
        type: 'multiple_choice',
        question: `Which of the following best describes a key concept in ${topic}?`,
        options: [
          'Fundamental principle with broad applications',
          'Specific technique with limited use',
          'Advanced concept requiring prerequisites',
          'Theoretical framework without practical application'
        ],
        correctAnswer: 0,
        explanation: `This question assesses your understanding of fundamental concepts in ${topic} within ${subject}.`,
        hint: `Think about the core principles that define ${topic}.`,
        points: Math.round(5 + difficultyLevel * 10),
        concepts: [topic, subject],
        apSkills: ['Knowledge', 'Comprehension']
      });
    }

    return [{
      id: `generic_${subject}_${topic}_${Date.now()}`,
      title: `${topic} - Practice Questions`,
      type: 'multiple_choice',
      difficulty,
      questions,
      timeLimit: questions.length * 3,
      passingScore: 70
    }];
  }

  private mapDifficultyToNumeric(difficulty: string): number {
    const map = { 'Beginner': 0.3, 'Intermediate': 0.6, 'Advanced': 0.8, 'Expert': 0.95 };
    return map[difficulty as keyof typeof map] || 0.5;
  }
}

// Progress Tracker for Session Management
class ProgressTracker {
  private sessions: Map<string, SessionProgress[]>;

  constructor() {
    this.sessions = new Map();
  }

  public async recordSession(sessionData: Partial<SessionProgress>): Promise<SessionProgress> {
    const session: SessionProgress = {
      sessionId: sessionData.sessionId || `session_${Date.now()}`,
      userId: sessionData.userId || '',
      subject: sessionData.subject || '',
      topic: sessionData.topic || '',
      startTime: sessionData.startTime || new Date(),
      endTime: sessionData.endTime || new Date(),
      duration: sessionData.duration || 0,
      questionsAnswered: sessionData.questionsAnswered || 0,
      correctAnswers: sessionData.correctAnswers || 0,
      accuracy: sessionData.accuracy || 0,
      starsEarned: sessionData.starsEarned || 0,
      conceptsMastered: sessionData.conceptsMastered || [],
      areasForImprovement: sessionData.areasForImprovement || []
    };

    // Store session data (in a real app, this would go to a database)
    const userSessions = this.sessions.get(session.userId) || [];
    userSessions.push(session);
    this.sessions.set(session.userId, userSessions);

    return session;
  }

  public async getAnalytics(userId: string, timeframe: 'week' | 'month' | 'all' = 'week'): Promise<any> {
    const userSessions = this.sessions.get(userId) || [];
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
    }

    const filteredSessions = userSessions.filter(session => 
      session.startTime >= startDate
    );

    return {
      totalSessions: filteredSessions.length,
      totalStudyTime: filteredSessions.reduce((sum, session) => sum + session.duration, 0),
      averageAccuracy: filteredSessions.length > 0 
        ? filteredSessions.reduce((sum, session) => sum + session.accuracy, 0) / filteredSessions.length 
        : 0,
      totalStarsEarned: filteredSessions.reduce((sum, session) => sum + session.starsEarned, 0),
      subjectBreakdown: this.getSubjectBreakdown(filteredSessions),
      conceptsMastered: this.getUniqueConcepts(filteredSessions, 'conceptsMastered'),
      areasForImprovement: this.getUniqueConcepts(filteredSessions, 'areasForImprovement'),
      progressTrend: this.calculateProgressTrend(filteredSessions)
    };
  }

  private getSubjectBreakdown(sessions: SessionProgress[]): any {
    const breakdown: { [key: string]: any } = {};
    
    sessions.forEach(session => {
      if (!breakdown[session.subject]) {
        breakdown[session.subject] = {
          sessions: 0,
          totalTime: 0,
          averageAccuracy: 0,
          starsEarned: 0
        };
      }
      
      breakdown[session.subject].sessions++;
      breakdown[session.subject].totalTime += session.duration;
      breakdown[session.subject].averageAccuracy += session.accuracy;
      breakdown[session.subject].starsEarned += session.starsEarned;
    });

    // Calculate averages
    Object.keys(breakdown).forEach(subject => {
      breakdown[subject].averageAccuracy /= breakdown[subject].sessions;
    });

    return breakdown;
  }

  private getUniqueConcepts(sessions: SessionProgress[], field: 'conceptsMastered' | 'areasForImprovement'): string[] {
    const concepts = new Set<string>();
    sessions.forEach(session => {
      session[field].forEach(concept => concepts.add(concept));
    });
    return Array.from(concepts);
  }

  private calculateProgressTrend(sessions: SessionProgress[]): 'improving' | 'stable' | 'declining' {
    if (sessions.length < 3) return 'stable';
    
    const recentSessions = sessions.slice(-5);
    const earlierSessions = sessions.slice(-10, -5);
    
    const recentAvg = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
    const earlierAvg = earlierSessions.length > 0 
      ? earlierSessions.reduce((sum, s) => sum + s.accuracy, 0) / earlierSessions.length 
      : recentAvg;
    
    if (recentAvg > earlierAvg + 5) return 'improving';
    if (recentAvg < earlierAvg - 5) return 'declining';
    return 'stable';
  }
}

// Content Analysis Engine for AP Content
class ContentAnalyzer {
  private apSubjectKeywords: Map<string, string[]>;

  constructor() {
    this.apSubjectKeywords = new Map([
      ['AP Calculus', ['derivative', 'integral', 'limit', 'function', 'calculus', 'differential', 'antiderivative', 'optimization']],
      ['AP Physics', ['force', 'energy', 'momentum', 'wave', 'electric', 'magnetic', 'quantum', 'thermodynamics', 'kinematics']],
      ['AP Chemistry', ['molecule', 'atom', 'reaction', 'bond', 'equilibrium', 'kinetics', 'thermodynamics', 'acid', 'base']],
      ['AP Biology', ['cell', 'DNA', 'protein', 'evolution', 'genetics', 'photosynthesis', 'respiration', 'ecology', 'heredity']],
      ['AP Computer Science', ['algorithm', 'array', 'loop', 'class', 'method', 'inheritance', 'recursion', 'object', 'programming']],
      ['AP Statistics', ['probability', 'distribution', 'hypothesis', 'confidence', 'regression', 'correlation', 'sampling', 'inference']],
      ['AP English', ['rhetoric', 'argument', 'analysis', 'synthesis', 'evidence', 'thesis', 'literary', 'composition']],
      ['AP History', ['period', 'historical', 'political', 'social', 'economic', 'cultural', 'revolution', 'reform', 'movement']]
    ]);
  }

  public analyzeContent(content: string): any {
    const words = content.toLowerCase().split(/\s+/);
    const detectedSubjects: string[] = [];
    const subjectScores = new Map<string, number>();

    // Analyze AP subject relevance
    for (const [subject, keywords] of this.apSubjectKeywords) {
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
      primaryFocus: sortedSubjects[0] || 'General AP Studies',
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

    const keywords = this.apSubjectKeywords.get(primarySubject) || [];
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
export const aiEngine = new APCourseEngine();