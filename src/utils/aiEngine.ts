// Enhanced AI Engine for AP Course Preparation
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

class APCourseEngine {
  private localizedEngine: LocalizedAPEngine;

  constructor() {
    this.localizedEngine = new LocalizedAPEngine();
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

    console.log('✅ OpenAI AP study plan generated successfully');
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
      console.error('Content generation failed, using localized AP engine:', error);
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

// Advanced Localized AP Engine
class LocalizedAPEngine {
  private apKnowledgeBase: Map<string, any>;
  private contentAnalyzer: ContentAnalyzer;

  constructor() {
    this.apKnowledgeBase = new Map();
    this.contentAnalyzer = new ContentAnalyzer();
    this.initializeAPKnowledgeBase();
  }

  private initializeAPKnowledgeBase() {
    this.apKnowledgeBase.set('ap_courses', {
      'AP Calculus AB': {
        topics: {
          'Limits and Continuity': { difficulty: 0.4, time: 60, category: 'foundation', keywords: ['limits', 'continuity', 'asymptotes'] },
          'Differentiation': { difficulty: 0.6, time: 75, category: 'intermediate', keywords: ['derivatives', 'chain rule', 'implicit'] },
          'Applications of Derivatives': { difficulty: 0.7, time: 80, category: 'advanced', keywords: ['optimization', 'related rates', 'motion'] },
          'Integration': { difficulty: 0.8, time: 85, category: 'advanced', keywords: ['antiderivatives', 'fundamental theorem', 'substitution'] },
          'Applications of Integration': { difficulty: 0.9, time: 90, category: 'expert', keywords: ['area', 'volume', 'accumulation'] }
        }
      },
      'AP Calculus BC': {
        topics: {
          'Parametric and Polar': { difficulty: 0.8, time: 70, category: 'advanced', keywords: ['parametric', 'polar', 'curves'] },
          'Infinite Sequences and Series': { difficulty: 0.9, time: 85, category: 'expert', keywords: ['series', 'convergence', 'taylor'] },
          'Advanced Integration': { difficulty: 0.85, time: 80, category: 'expert', keywords: ['integration by parts', 'partial fractions', 'improper'] }
        }
      },
      'AP Physics 1': {
        topics: {
          'Kinematics': { difficulty: 0.5, time: 60, category: 'foundation', keywords: ['motion', 'velocity', 'acceleration'] },
          'Dynamics': { difficulty: 0.6, time: 70, category: 'intermediate', keywords: ['forces', 'newton laws', 'friction'] },
          'Circular Motion and Gravitation': { difficulty: 0.7, time: 75, category: 'advanced', keywords: ['centripetal', 'gravity', 'orbits'] },
          'Energy': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['kinetic', 'potential', 'conservation'] },
          'Momentum': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['impulse', 'collisions', 'conservation'] },
          'Simple Harmonic Motion': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['oscillations', 'springs', 'pendulums'] },
          'Waves and Sound': { difficulty: 0.7, time: 75, category: 'advanced', keywords: ['wave properties', 'interference', 'doppler'] }
        }
      },
      'AP Physics 2': {
        topics: {
          'Fluid Statics and Dynamics': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['pressure', 'buoyancy', 'flow'] },
          'Thermodynamics': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['heat', 'temperature', 'entropy'] },
          'Electric Force and Field': { difficulty: 0.7, time: 75, category: 'advanced', keywords: ['coulomb', 'electric field', 'potential'] },
          'Electric Potential and Capacitance': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['voltage', 'capacitors', 'energy'] },
          'Electric Circuits': { difficulty: 0.7, time: 75, category: 'advanced', keywords: ['current', 'resistance', 'kirchhoff'] },
          'Magnetic Forces and Fields': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['magnetic field', 'lorentz force', 'induction'] },
          'Electromagnetic Induction': { difficulty: 0.9, time: 85, category: 'expert', keywords: ['faraday law', 'lenz law', 'transformers'] },
          'Quantum Physics': { difficulty: 0.9, time: 90, category: 'expert', keywords: ['photons', 'photoelectric', 'atomic models'] }
        }
      },
      'AP Chemistry': {
        topics: {
          'Atomic Structure and Properties': { difficulty: 0.5, time: 60, category: 'foundation', keywords: ['atoms', 'electrons', 'periodic trends'] },
          'Molecular and Ionic Compound Structure': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['bonding', 'lewis structures', 'molecular geometry'] },
          'Intermolecular Forces and Properties': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['van der waals', 'hydrogen bonding', 'phase changes'] },
          'Chemical Reactions': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['stoichiometry', 'balancing', 'types of reactions'] },
          'Kinetics': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['reaction rates', 'rate laws', 'mechanisms'] },
          'Thermodynamics': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['enthalpy', 'entropy', 'gibbs free energy'] },
          'Equilibrium': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['le chatelier', 'equilibrium constant', 'ice tables'] },
          'Acids and Bases': { difficulty: 0.7, time: 75, category: 'advanced', keywords: ['ph', 'buffers', 'titrations'] },
          'Applications of Thermodynamics': { difficulty: 0.9, time: 85, category: 'expert', keywords: ['electrochemistry', 'galvanic cells', 'electrolysis'] }
        }
      },
      'AP Biology': {
        topics: {
          'Chemistry of Life': { difficulty: 0.5, time: 60, category: 'foundation', keywords: ['water', 'carbon', 'macromolecules'] },
          'Cell Structure and Function': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['organelles', 'membrane', 'transport'] },
          'Cellular Energetics': { difficulty: 0.7, time: 75, category: 'advanced', keywords: ['photosynthesis', 'cellular respiration', 'enzymes'] },
          'Cell Communication and Cell Cycle': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['signal transduction', 'mitosis', 'meiosis'] },
          'Heredity': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['mendelian genetics', 'chromosomes', 'inheritance'] },
          'Gene Expression and Regulation': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['transcription', 'translation', 'gene regulation'] },
          'Natural Selection': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['evolution', 'adaptation', 'speciation'] },
          'Ecology': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['populations', 'communities', 'ecosystems'] }
        }
      },
      'AP Computer Science A': {
        topics: {
          'Primitive Types': { difficulty: 0.4, time: 50, category: 'foundation', keywords: ['int', 'double', 'boolean', 'operators'] },
          'Using Objects': { difficulty: 0.5, time: 60, category: 'foundation', keywords: ['classes', 'methods', 'string'] },
          'Boolean Expressions and if Statements': { difficulty: 0.5, time: 55, category: 'foundation', keywords: ['conditionals', 'logical operators', 'control flow'] },
          'Iteration': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['for loops', 'while loops', 'nested loops'] },
          'Writing Classes': { difficulty: 0.7, time: 75, category: 'advanced', keywords: ['constructors', 'instance variables', 'methods'] },
          'Array': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['arrays', 'traversing', 'algorithms'] },
          'ArrayList': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['arraylist', 'wrapper classes', 'autoboxing'] },
          '2D Array': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['2d arrays', 'row-major', 'column-major'] },
          'Inheritance': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['extends', 'super', 'polymorphism'] },
          'Recursion': { difficulty: 0.9, time: 85, category: 'expert', keywords: ['recursive methods', 'base case', 'recursive case'] }
        }
      },
      'AP Statistics': {
        topics: {
          'Exploring One-Variable Data': { difficulty: 0.4, time: 55, category: 'foundation', keywords: ['distributions', 'center', 'spread'] },
          'Exploring Two-Variable Data': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['scatterplots', 'correlation', 'regression'] },
          'Collecting Data': { difficulty: 0.5, time: 60, category: 'foundation', keywords: ['sampling', 'experiments', 'bias'] },
          'Probability': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['random variables', 'probability distributions', 'expected value'] },
          'Sampling Distributions': { difficulty: 0.8, time: 75, category: 'advanced', keywords: ['central limit theorem', 'sampling distribution', 'standard error'] },
          'Inference for Categorical Data': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['confidence intervals', 'hypothesis tests', 'proportions'] },
          'Inference for Quantitative Data': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['t-tests', 'confidence intervals', 'means'] },
          'Inference for Categorical Data: Chi-Square': { difficulty: 0.9, time: 85, category: 'expert', keywords: ['chi-square', 'goodness of fit', 'independence'] },
          'Inference for Quantitative Data: Slopes': { difficulty: 0.9, time: 85, category: 'expert', keywords: ['regression inference', 'slope', 'correlation'] }
        }
      },
      'AP English Language': {
        topics: {
          'Rhetorical Situation': { difficulty: 0.5, time: 60, category: 'foundation', keywords: ['audience', 'purpose', 'context'] },
          'Claims and Evidence': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['thesis', 'evidence', 'reasoning'] },
          'Reasoning and Organization': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['logical structure', 'transitions', 'coherence'] },
          'Style': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['diction', 'syntax', 'tone'] },
          'Joining the Conversation': { difficulty: 0.8, time: 75, category: 'advanced', keywords: ['synthesis', 'sources', 'attribution'] }
        }
      },
      'AP English Literature': {
        topics: {
          'Short Fiction': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['character', 'setting', 'plot'] },
          'Poetry': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['figurative language', 'structure', 'speaker'] },
          'Longer Fiction or Drama': { difficulty: 0.7, time: 75, category: 'advanced', keywords: ['themes', 'literary elements', 'interpretation'] },
          'Literary Argumentation': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['thesis', 'evidence', 'analysis'] }
        }
      },
      'AP US History': {
        topics: {
          'Period 1: 1491-1607': { difficulty: 0.5, time: 60, category: 'foundation', keywords: ['native americans', 'european exploration', 'columbian exchange'] },
          'Period 2: 1607-1754': { difficulty: 0.6, time: 65, category: 'intermediate', keywords: ['colonial development', 'slavery', 'great awakening'] },
          'Period 3: 1754-1800': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['revolution', 'constitution', 'early republic'] },
          'Period 4: 1800-1848': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['democracy', 'market revolution', 'reform movements'] },
          'Period 5: 1844-1877': { difficulty: 0.8, time: 75, category: 'advanced', keywords: ['civil war', 'reconstruction', 'westward expansion'] },
          'Period 6: 1865-1898': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['industrialization', 'immigration', 'gilded age'] },
          'Period 7: 1890-1945': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['progressivism', 'world wars', 'great depression'] },
          'Period 8: 1945-1980': { difficulty: 0.8, time: 80, category: 'advanced', keywords: ['cold war', 'civil rights', 'social movements'] },
          'Period 9: 1980-Present': { difficulty: 0.7, time: 70, category: 'advanced', keywords: ['globalization', 'technology', 'political polarization'] }
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
    const apCoursesData = this.apKnowledgeBase.get('ap_courses');
    const topicData = apCoursesData[subject]?.topics[topic];
    
    if (!topicData) {
      return this.generateGenericAPContent(subject, topic, difficulty, learningStyle);
    }

    return this.generateSpecificAPContent(subject, topic, difficulty, learningStyle, topicData);
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

  private generateGenericAPContent(subject: string, topic: string, difficulty: string, learningStyle: string): any {
    return {
      type: 'theory',
      title: `${topic} - AP Fundamentals`,
      question: `What are the key AP concepts in ${topic}?`,
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
      visualAid: `${topic.toLowerCase()}_ap_diagram`,
      audioExplanation: 'Available',
      interactiveElement: 'ap_concept_builder'
    };
  }

  private generateSpecificAPContent(subject: string, topic: string, difficulty: string, learningStyle: string, topicData: any): any {
    const keywords = topicData.keywords || [];
    const category = topicData.category || 'foundation';
    
    return {
      type: category === 'foundation' ? 'theory' : 'application',
      title: `${topic} - AP ${category.charAt(0).toUpperCase() + category.slice(1)} Level`,
      question: `How do ${keywords.slice(0, 2).join(' and ')} relate to ${topic} on the AP exam?`,
      options: [
        `They are fundamental components tested on the AP exam`,
        `They are advanced applications for AP free response`,
        `They are prerequisites for understanding AP ${topic}`,
        `They are related but separate AP concepts`
      ],
      correct: 0,
      explanation: `In AP ${topic}, ${keywords.slice(0, 2).join(' and ')} serve as key building blocks that help understand the broader concepts and applications tested on the AP exam.`,
      hint: `Consider how ${keywords[0]} connects to the main principles of ${topic} for AP success.`,
      points: Math.round(topicData.difficulty * 20),
      difficulty: difficulty.toLowerCase(),
      concepts: [topic, ...keywords.slice(0, 3)],
      visualAid: `${topic.toLowerCase()}_${learningStyle}_ap_aid`,
      audioExplanation: 'Available',
      interactiveElement: this.getInteractiveElement(learningStyle, topic)
    };
  }

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