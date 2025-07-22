import { openaiService } from './openaiService';

export interface StudyPlan {
  id?: string;
  title: string;
  description: string;
  duration: number;
  dailyTimeCommitment: number;
  difficulty: string;
  units: Array<{
    name: string;
    priority: 'high' | 'medium' | 'low';
    estimatedHours: number;
    description: string;
    lessons: Array<{
      name: string;
      difficulty: string;
      estimatedTime: number;
      learningObjectives: string[];
      contentTypes: string[];
      materialQuestions: Array<{
        question: string;
        type: 'multiple_choice' | 'short_answer' | 'essay';
        options?: string[];
        correctAnswer?: number | string;
        explanation: string;
        pageReference?: string;
        difficulty: string;
      }>;
      activities: Array<{
        type: string;
        title: string;
        description: string;
        estimatedTime: number;
      }>;
      mastery: {
        requiredScore: number;
        practiceProblems: number;
      };
    }>;
    unitTest: {
      questions: number;
      timeLimit: number;
      passingScore: number;
    };
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
  };
  personalizedRecommendations: string[];
  estimatedOutcome: string;
  confidence: number;
}

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
  courseDetailing?: {
    questions: boolean;
    videos: boolean;
    lectures: boolean;
    interactiveExercises: boolean;
    practiceTests: boolean;
    studyGuides: boolean;
    flashcards: boolean;
    labActivities: boolean;
    groupDiscussions: boolean;
    realWorldApplications: boolean;
  };
  recentPerformance?: {
    accuracy: number;
    speed: number;
    consistency: number;
    engagement: number;
  };
}

export interface StudyContent {
  type: string;
  title: string;
  question: string;
  options?: string[];
  correct?: number;
  answer?: string;
  explanation: string;
  hint: string;
  points: number;
  difficulty: string;
  concepts: string[];
  apSkills?: string[];
  visualAid?: string;
  audioExplanation?: string;
  interactiveElement?: string;
  commonMistakes?: string[];
  steps?: Array<{
    step: number;
    instruction: string;
    answer: string;
  }>;
}

export interface QuestionSet {
  title: string;
  questions: Array<{
    type: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    hint: string;
    points: number;
    concepts: string[];
    apSkills: string[];
  }>;
}

class AIEngine {
  private hasOpenAI = import.meta.env.VITE_OPENAI_API_KEY && 
                     import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';

  async generateStudyPlan(
    userProfile: UserProfile, 
    goals: string[], 
    additionalInfo?: string
  ): Promise<StudyPlan> {
    console.log('🤖 AI Engine: Generating study plan...');
    
    // Use OpenAI if available, otherwise use local AI
    if (this.hasOpenAI) {
      try {
        console.log('🚀 Using OpenAI for enhanced study plan generation');
        const openaiResponse = await openaiService.generateStudyPlan({
          userProfile: {
            name: userProfile.name,
            level: userProfile.level,
            weakAreas: userProfile.weakAreas,
            strongAreas: userProfile.strongAreas,
            learningStyle: userProfile.learningStyle,
            studyGoals: userProfile.studyGoals,
            timeAvailable: userProfile.timeAvailable,
            additionalInfo
          },
          goals,
          uploadedContent: additionalInfo
        });

        // Convert OpenAI response to our format
        return this.convertOpenAIResponse(openaiResponse);
      } catch (error) {
        console.warn('OpenAI failed, falling back to local AI:', error);
        return this.generateLocalStudyPlan(userProfile, goals, additionalInfo);
      }
    } else {
      console.log('🧠 Using local AI engine for study plan generation');
      return this.generateLocalStudyPlan(userProfile, goals, additionalInfo);
    }
  }

  private convertOpenAIResponse(response: any): StudyPlan {
    return {
      title: response.title,
      description: response.description,
      duration: response.duration,
      dailyTimeCommitment: Math.round(response.duration * 0.5), // Estimate based on duration
      difficulty: response.difficulty,
      subjects: response.subjects.map((subject: any) => ({
        ...subject,
        topics: subject.topics.map((topic: any) => ({
          ...topic,
          prerequisites: topic.prerequisites || [],
          resources: topic.resources || [],
          assessments: topic.assessments || []
        }))
      })),
      milestones: response.milestones,
      adaptiveFeatures: {
        difficultyAdjustment: true,
        personalizedContent: true,
        progressTracking: true
      },
      personalizedRecommendations: response.personalizedRecommendations,
      estimatedOutcome: response.estimatedOutcome,
      confidence: response.confidence
    };
  }

  private async generateLocalStudyPlan(
    userProfile: UserProfile, 
    goals: string[], 
    additionalInfo?: string
  ): Promise<StudyPlan> {
    console.log('🧠 Generating local AI study plan...');
    
    // Analyze uploaded materials if provided
    const materialAnalysis = additionalInfo ? this.analyzeMaterials(additionalInfo) : null;
    console.log('📄 Material analysis:', materialAnalysis);
    
    // Analyze goals to identify AP subjects
    const apSubjects = this.identifyAPSubjects(goals, materialAnalysis);
    
    if (apSubjects.length === 0) {
      throw new Error('No AP subjects identified from your goals. Please be more specific about which AP courses you want to study.');
    }

    // Generate subjects with topics
    const subjects = apSubjects.map(subject => ({
      name: subject.name,
      priority: this.determinePriority(subject.name, userProfile.weakAreas, userProfile.strongAreas),
      timeAllocation: Math.round(100 / apSubjects.length),
      topics: this.generateTopicsForSubject(subject.name, userProfile.learningStyle, materialAnalysis),
      reasoning: this.generateReasoning(subject.name, userProfile, materialAnalysis)
    }));

    // Generate milestones
    const milestones = this.generateMilestones(subjects, userProfile.timeAvailable, materialAnalysis);

    // Calculate duration based on subjects and time available
    const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const estimatedDuration = materialAnalysis?.suggestedDuration || Math.max(30, Math.min(120, totalTopics * 3));

    return {
      title: `Personalized AP Study Plan for ${userProfile.name}`,
      description: `A comprehensive ${estimatedDuration}-day AP study plan covering ${subjects.length} AP subjects, tailored to your ${userProfile.learningStyle} learning style and ${userProfile.timeAvailable}-minute daily sessions.${materialAnalysis ? ' Customized based on your uploaded materials and course requirements.' : ''}`,
      duration: estimatedDuration,
      dailyTimeCommitment: userProfile.timeAvailable,
      difficulty: this.mapDifficulty(userProfile.preferredDifficulty),
      subjects,
      milestones,
      adaptiveFeatures: {
        difficultyAdjustment: true,
        personalizedContent: true,
        progressTracking: true
      },
      personalizedRecommendations: this.generateRecommendations(userProfile, subjects, materialAnalysis),
      estimatedOutcome: this.generateEstimatedOutcome(subjects, userProfile, materialAnalysis),
      confidence: this.calculateConfidence(userProfile, subjects)
    };
  }

  private analyzeMaterials(additionalInfo: string): {
    detectedSubjects: string[];
    keyTopics: string[];
    difficultyLevel: string;
    suggestedDuration: number;
    specificRequirements: string[];
    examDates: string[];
    coursework: string[];
    weaknessIndicators: string[];
    strengthIndicators: string[];
    extractedQuestions: Array<{
      question: string;
      context: string;
      type: 'multiple_choice' | 'short_answer' | 'essay';
      difficulty: string;
      pageReference?: string;
    }>;
    chapterStructure: Array<{
      chapter: string;
      topics: string[];
      pageRange?: string;
    }>;
  } | null {
    if (!additionalInfo || additionalInfo.trim().length < 10) {
      return null;
    }

    const text = additionalInfo.toLowerCase();
    console.log('🔍 Analyzing materials:', text.substring(0, 200) + '...');

    // Detect AP subjects from materials
    const subjectPatterns = {
      'AP Calculus AB': ['calculus ab', 'calc ab', 'derivative', 'integral', 'limit', 'continuity', 'ftc'],
      'AP Calculus BC': ['calculus bc', 'calc bc', 'series', 'parametric', 'polar', 'taylor', 'maclaurin'],
      'AP Physics 1': ['physics 1', 'mechanics', 'kinematics', 'newton', 'force', 'energy', 'momentum'],
      'AP Physics 2': ['physics 2', 'electricity', 'magnetism', 'waves', 'optics', 'thermodynamics'],
      'AP Chemistry': ['chemistry', 'stoichiometry', 'equilibrium', 'kinetics', 'thermochemistry', 'electrochemistry'],
      'AP Biology': ['biology', 'genetics', 'evolution', 'ecology', 'cellular', 'molecular', 'photosynthesis'],
      'AP Computer Science A': ['computer science', 'java', 'programming', 'algorithm', 'data structure', 'oop'],
      'AP Statistics': ['statistics', 'probability', 'hypothesis', 'regression', 'distribution', 'sampling'],
      'AP English Language': ['english language', 'rhetoric', 'argument', 'synthesis', 'rhetorical analysis'],
      'AP English Literature': ['english literature', 'poetry', 'prose', 'literary', 'theme', 'symbolism'],
      'AP US History': ['us history', 'american history', 'apush', 'colonial', 'revolution', 'civil war'],
      'AP World History': ['world history', 'global', 'civilization', 'trade', 'empire', 'cultural exchange'],
      'AP Psychology': ['psychology', 'behavior', 'cognition', 'neuroscience', 'development', 'personality'],
      'AP Economics': ['economics', 'microeconomics', 'macroeconomics', 'supply', 'demand', 'market'],
      'AP Government': ['government', 'politics', 'constitution', 'federalism', 'civil rights', 'congress']
    };

    const detectedSubjects: string[] = [];
    for (const [subject, patterns] of Object.entries(subjectPatterns)) {
      const matches = patterns.filter(pattern => text.includes(pattern)).length;
      if (matches >= 2 || (matches >= 1 && patterns.some(p => text.includes(p) && text.indexOf(p) < 100))) {
        detectedSubjects.push(subject);
      }
    }

    // Extract key topics mentioned
    const topicKeywords = [
      'chapter', 'unit', 'lesson', 'topic', 'section', 'module',
      'test', 'quiz', 'exam', 'assignment', 'homework', 'project',
      'review', 'study', 'practice', 'problem', 'exercise'
    ];

    const keyTopics: string[] = [];
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      if (topicKeywords.some(keyword => sentence.includes(keyword))) {
        // Extract potential topic names (capitalized words or phrases)
        const words = sentence.split(/\s+/);
        for (let i = 0; i < words.length - 1; i++) {
          if (words[i].length > 3 && words[i+1].length > 3) {
            const phrase = `${words[i]} ${words[i+1]}`.replace(/[^\w\s]/g, '').trim();
            if (phrase.length > 6 && !keyTopics.includes(phrase)) {
              keyTopics.push(phrase);
            }
          }
        }
      }
    });

    // Determine difficulty level from materials
    const difficultyIndicators = {
      'Beginner': ['introduction', 'basic', 'fundamentals', 'overview', 'getting started'],
      'Intermediate': ['application', 'practice', 'examples', 'problems', 'exercises'],
      'Advanced': ['complex', 'challenging', 'advanced', 'difficult', 'comprehensive'],
      'Expert': ['mastery', 'expert', 'professional', 'research', 'thesis']
    };

    let difficultyLevel = 'Intermediate';
    let maxMatches = 0;
    
    for (const [level, indicators] of Object.entries(difficultyIndicators)) {
      const matches = indicators.filter(indicator => text.includes(indicator)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        difficultyLevel = level;
      }
    }

    // Estimate duration based on content volume and complexity
    const wordCount = text.split(/\s+/).length;
    const baseWeeks = Math.ceil(wordCount / 500); // Rough estimate
    const suggestedDuration = Math.min(120, Math.max(30, baseWeeks * 7));

    // Extract specific requirements
    const requirementKeywords = ['must', 'required', 'need to', 'have to', 'should', 'important'];
    const specificRequirements: string[] = [];
    
    sentences.forEach(sentence => {
      if (requirementKeywords.some(keyword => sentence.includes(keyword))) {
        const cleaned = sentence.trim().replace(/[^\w\s.,]/g, '');
        if (cleaned.length > 10 && cleaned.length < 200) {
          specificRequirements.push(cleaned);
        }
      }
    });

    // Look for exam dates
    const datePattern = /\b(?:january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4})\b/gi;
    const examDates = text.match(datePattern) || [];

    // Identify coursework types
    const courseworkKeywords = ['essay', 'report', 'presentation', 'lab', 'experiment', 'project', 'research'];
    const coursework = courseworkKeywords.filter(keyword => text.includes(keyword));

    // Identify weakness and strength indicators
    const weaknessKeywords = ['struggle', 'difficult', 'hard', 'confusing', 'weak', 'need help', 'don\'t understand'];
    const strengthKeywords = ['good at', 'strong', 'understand', 'easy', 'confident', 'excel'];
    
    const weaknessIndicators = weaknessKeywords.filter(keyword => text.includes(keyword));
    const strengthIndicators = strengthKeywords.filter(keyword => text.includes(keyword));

    // Extract questions from materials
    const extractedQuestions = this.extractQuestionsFromText(text);
    
    // Extract chapter/unit structure
    const chapterStructure = this.extractChapterStructure(text);
    const analysis = {
      detectedSubjects: detectedSubjects.slice(0, 4), // Limit to 4 subjects
      keyTopics: keyTopics.slice(0, 10), // Limit to 10 topics
      difficultyLevel,
      suggestedDuration,
      specificRequirements: specificRequirements.slice(0, 5),
      examDates: [...new Set(examDates)].slice(0, 3),
      coursework: [...new Set(coursework)],
      weaknessIndicators,
      strengthIndicators,
      extractedQuestions,
      chapterStructure
    };

    console.log('📊 Material analysis results:', analysis);
    return analysis;
  }
  private identifyAPSubjects(goals: string[], materialAnalysis?: any): Array<{ name: string; keywords: string[] }> {
    // First, use subjects detected from materials if available
    if (materialAnalysis?.detectedSubjects && materialAnalysis.detectedSubjects.length > 0) {
      console.log('📚 Using subjects detected from materials:', materialAnalysis.detectedSubjects);
      return materialAnalysis.detectedSubjects.map((subject: string) => ({
        name: subject,
        keywords: [subject.toLowerCase()]
      }));
    }

    const apSubjectMap = {
      'AP Calculus AB': ['calculus ab', 'calc ab', 'derivatives', 'integrals', 'limits'],
      'AP Calculus BC': ['calculus bc', 'calc bc', 'series', 'parametric', 'polar'],
      'AP Physics 1': ['physics 1', 'mechanics', 'kinematics', 'dynamics', 'energy'],
      'AP Physics 2': ['physics 2', 'electricity', 'magnetism', 'waves', 'optics'],
      'AP Chemistry': ['chemistry', 'chem', 'stoichiometry', 'equilibrium', 'kinetics'],
      'AP Biology': ['biology', 'bio', 'genetics', 'evolution', 'ecology'],
      'AP Computer Science A': ['computer science', 'cs', 'java', 'programming', 'algorithms'],
      'AP Statistics': ['statistics', 'stats', 'probability', 'hypothesis', 'regression'],
      'AP English Language': ['english language', 'rhetoric', 'argument', 'synthesis'],
      'AP English Literature': ['english literature', 'poetry', 'prose', 'literary analysis'],
      'AP US History': ['us history', 'american history', 'apush', 'historical analysis'],
      'AP World History': ['world history', 'global history', 'comparative history'],
      'AP European History': ['european history', 'euro history', 'ap euro'],
      'AP Psychology': ['psychology', 'psych', 'behavior', 'cognition'],
      'AP Economics': ['economics', 'econ', 'micro', 'macro', 'market'],
      'AP Government': ['government', 'gov', 'politics', 'constitution', 'civics']
    };

    const identifiedSubjects: Array<{ name: string; keywords: string[] }> = [];
    const goalText = goals.join(' ').toLowerCase();

    for (const [subject, keywords] of Object.entries(apSubjectMap)) {
      if (keywords.some(keyword => goalText.includes(keyword))) {
        identifiedSubjects.push({ name: subject, keywords });
      }
    }

    // If no specific subjects found, suggest based on common AP courses
    if (identifiedSubjects.length === 0) {
      identifiedSubjects.push(
        { name: 'AP Calculus AB', keywords: ['calculus'] },
        { name: 'AP English Language', keywords: ['english'] },
        { name: 'AP US History', keywords: ['history'] }
      );
    }

    return identifiedSubjects.slice(0, 4); // Limit to 4 subjects max
  }

  private determinePriority(
    subjectName: string, 
    weakAreas: string[], 
    strongAreas: string[]
  ): 'high' | 'medium' | 'low' {
    const subjectLower = subjectName.toLowerCase();
    
    if (weakAreas.some(area => subjectLower.includes(area.toLowerCase()))) {
      return 'high';
    }
    if (strongAreas.some(area => subjectLower.includes(area.toLowerCase()))) {
      return 'low';
    }
    return 'medium';
  }

  private generateTopicsForSubject(subjectName: string, learningStyle: string, materialAnalysis?: any): Array<{
    name: string;
    difficulty: string;
    estimatedTime: number;
    prerequisites: string[];
    learningObjectives: string[];
    resources: string[];
    assessments: string[];
  }> {
    // Use topics from material analysis if available
    if (materialAnalysis?.keyTopics && materialAnalysis.keyTopics.length > 0) {
      console.log('📝 Using topics from materials:', materialAnalysis.keyTopics);
      return materialAnalysis.keyTopics.slice(0, 6).map((topic: string, index: number) => ({
        name: topic,
        difficulty: materialAnalysis.difficultyLevel || 'Intermediate',
        estimatedTime: 45 + (index * 5), // Vary time slightly
        prerequisites: index === 0 ? [] : [`Previous ${subjectName} topics`],
        learningObjectives: [
          `Master ${topic} concepts from your materials`,
          `Apply ${topic} to AP exam contexts`,
          `Connect ${topic} to broader ${subjectName} themes`
        ],
        resources: this.generateResourcesForLearningStyle(learningStyle, topic),
        assessments: [
          'Material-based practice problems',
          `${topic} concept quiz`,
          'AP-style application questions'
        ]
      }));
    }

    const topicTemplates = {
      'AP Calculus AB': [
        { name: 'Limits and Continuity', difficulty: 'Intermediate', time: 45 },
        { name: 'Derivatives and Applications', difficulty: 'Intermediate', time: 60 },
        { name: 'Integrals and FTC', difficulty: 'Advanced', time: 60 },
        { name: 'Applications of Integration', difficulty: 'Advanced', time: 45 }
      ],
      'AP Physics 1': [
        { name: 'Kinematics', difficulty: 'Beginner', time: 45 },
        { name: 'Newton\'s Laws', difficulty: 'Intermediate', time: 60 },
        { name: 'Energy and Momentum', difficulty: 'Intermediate', time: 60 },
        { name: 'Rotational Motion', difficulty: 'Advanced', time: 45 }
      ],
      'AP Chemistry': [
        { name: 'Atomic Structure', difficulty: 'Beginner', time: 45 },
        { name: 'Chemical Bonding', difficulty: 'Intermediate', time: 60 },
        { name: 'Stoichiometry', difficulty: 'Intermediate', time: 60 },
        { name: 'Equilibrium', difficulty: 'Advanced', time: 45 }
      ],
      'default': [
        { name: 'Fundamentals', difficulty: 'Beginner', time: 45 },
        { name: 'Core Concepts', difficulty: 'Intermediate', time: 60 },
        { name: 'Advanced Applications', difficulty: 'Advanced', time: 60 },
        { name: 'Exam Preparation', difficulty: 'Expert', time: 45 }
      ]
    };

    const templates = topicTemplates[subjectName as keyof typeof topicTemplates] || topicTemplates.default;
    
    return templates.map(template => ({
      name: template.name,
      difficulty: template.difficulty,
      estimatedTime: template.time,
      prerequisites: template.difficulty === 'Beginner' ? [] : ['Previous topic completion'],
      learningObjectives: [
        `Master ${template.name} concepts`,
        `Apply ${template.name} to AP exam problems`,
        `Develop problem-solving strategies for ${template.name}`
      ],
      resources: this.generateResourcesForLearningStyle(learningStyle, template.name),
      assessments: [
        'Practice problems',
        'Concept quiz',
        'AP-style questions'
      ]
    }));
  }

  private generateResourcesForLearningStyle(learningStyle: string, topicName: string): string[] {
    const baseResources = [`${topicName} study guide`, `AP ${topicName} practice problems`];
    
    switch (learningStyle) {
      case 'visual':
        return [...baseResources, `${topicName} diagrams`, `Interactive ${topicName} simulations`];
      case 'auditory':
        return [...baseResources, `${topicName} lecture videos`, `${topicName} discussion podcasts`];
      case 'kinesthetic':
        return [...baseResources, `${topicName} lab activities`, `Hands-on ${topicName} experiments`];
      case 'reading':
        return [...baseResources, `${topicName} textbook chapters`, `${topicName} research articles`];
      default:
        return baseResources;
    }
  }

  private generateReasoning(subjectName: string, userProfile: UserProfile, materialAnalysis?: any): string {
    const reasons = [];
    
    if (materialAnalysis?.detectedSubjects.includes(subjectName)) {
      reasons.push('identified from your uploaded materials and course requirements');
    }
    
    if (userProfile.weakAreas.some(area => subjectName.toLowerCase().includes(area.toLowerCase()))) {
      reasons.push('identified as a weak area requiring focused attention');
    }
    
    if (userProfile.studyGoals.some(goal => goal.toLowerCase().includes(subjectName.toLowerCase()))) {
      reasons.push('directly aligns with your stated learning goals');
    }
    
    if (materialAnalysis?.specificRequirements.length > 0) {
      reasons.push('addresses specific requirements from your course materials');
    }
    
    reasons.push('essential for comprehensive AP exam preparation');
    
    return `This subject is included because it ${reasons.join(' and ')}.`;
  }

  private generateMilestones(subjects: any[], timeAvailable: number, materialAnalysis?: any): Array<{
    week: number;
    title: string;
    description: string;
    successCriteria: string[];
  }> {
    const milestones = [];
    const weeksPerSubject = Math.max(1, Math.floor(8 / subjects.length));
    
    subjects.forEach((subject, index) => {
      const week = (index * weeksPerSubject) + 1;
      milestones.push({
        week,
        title: `${subject.name} Foundation`,
        description: `Complete foundational topics in ${subject.name} and demonstrate understanding through practice problems.${materialAnalysis ? ' Focus on concepts from your uploaded materials.' : ''}`,
        successCriteria: [
          `Complete all ${subject.name} foundational topics`,
          `Score 70%+ on ${subject.name} practice quiz`,
          `Identify and address knowledge gaps`,
          ...(materialAnalysis?.specificRequirements.slice(0, 1) || [])
        ]
      });
    });

    // Add material-specific milestones if exam dates are provided
    if (materialAnalysis?.examDates.length > 0) {
      milestones.push({
        week: Math.max(2, milestones.length),
        title: 'Exam Preparation Checkpoint',
        description: `Prepare for upcoming exams based on your course schedule: ${materialAnalysis.examDates.join(', ')}.`,
        successCriteria: [
          'Complete practice exams for scheduled tests',
          'Review all material-specific topics',
          'Address identified weak areas from materials'
        ]
      });
    }
    // Add final milestone
    milestones.push({
      week: Math.max(4, milestones.length + 1),
      title: 'AP Exam Readiness',
      description: 'Demonstrate mastery across all subjects through comprehensive practice exams and review.',
      successCriteria: [
        'Complete full-length AP practice exams',
        'Achieve target scores on all practice exams',
        'Review and reinforce weak areas identified',
        ...(materialAnalysis?.coursework.length > 0 ? [`Complete required coursework: ${materialAnalysis.coursework.join(', ')}`] : [])
      ]
    });

    return milestones;
  }

  private mapDifficulty(preferredDifficulty: string): string {
    const difficultyMap = {
      'easy': 'AP Supportive',
      'medium': 'AP Balanced',
      'hard': 'AP Challenging',
      'adaptive': 'AP Adaptive'
    };
    return difficultyMap[preferredDifficulty as keyof typeof difficultyMap] || 'AP Balanced';
  }

  private generateRecommendations(userProfile: UserProfile, subjects: any[], materialAnalysis?: any): string[] {
    const recommendations = [];
    
    // Material-specific recommendations
    if (materialAnalysis) {
      if (materialAnalysis.weaknessIndicators.length > 0) {
        recommendations.push(`Focus extra time on areas you mentioned struggling with: ${materialAnalysis.weaknessIndicators.slice(0, 2).join(', ')}`);
      }
      
      if (materialAnalysis.strengthIndicators.length > 0) {
        recommendations.push(`Leverage your strengths in: ${materialAnalysis.strengthIndicators.slice(0, 2).join(', ')}`);
      }
      
      if (materialAnalysis.coursework.length > 0) {
        recommendations.push(`Integrate study sessions with your coursework: ${materialAnalysis.coursework.join(', ')}`);
      }
      
      if (materialAnalysis.examDates.length > 0) {
        recommendations.push(`Plan intensive review sessions before exam dates: ${materialAnalysis.examDates.join(', ')}`);
      }
    }

    // Learning style recommendations
    switch (userProfile.learningStyle) {
      case 'visual':
        recommendations.push('Use diagrams and visual aids for complex concepts');
        recommendations.push('Create mind maps for topic relationships');
        break;
      case 'auditory':
        recommendations.push('Listen to educational podcasts during commute');
        recommendations.push('Explain concepts aloud to reinforce learning');
        break;
      case 'kinesthetic':
        recommendations.push('Use hands-on activities and experiments');
        recommendations.push('Take frequent breaks with physical movement');
        break;
      case 'reading':
        recommendations.push('Take detailed notes while reading');
        recommendations.push('Summarize key concepts in writing');
        break;
    }
    
    // Time-based recommendations
    if (userProfile.timeAvailable < 30) {
      recommendations.push('Focus on high-yield topics for maximum impact');
      recommendations.push('Use spaced repetition for efficient memorization');
    } else if (userProfile.timeAvailable > 90) {
      recommendations.push('Include comprehensive practice sessions');
      recommendations.push('Explore advanced applications and connections');
    }
    
    // Performance-based recommendations
    if (userProfile.level < 3) {
      recommendations.push('Start with foundational concepts before advancing');
      recommendations.push('Use additional practice problems for skill building');
    }
    
    return recommendations;
  }

  private generateEstimatedOutcome(subjects: any[], userProfile: UserProfile, materialAnalysis?: any): string {
    const subjectCount = subjects.length;
    const timeCommitment = userProfile.timeAvailable;
    
    let outcome = `After completing this study plan, you should be well-prepared for ${subjectCount} AP exam${subjectCount > 1 ? 's' : ''}. `;
    
    if (materialAnalysis?.examDates.length > 0) {
      outcome += `Your study plan is aligned with your exam schedule (${materialAnalysis.examDates.join(', ')}). `;
    }
    
    if (timeCommitment >= 60) {
      outcome += 'With your dedicated study schedule, you\'re positioned to achieve scores of 4-5 on your AP exams.';
    } else {
      outcome += 'With consistent effort, you should achieve solid scores of 3-4 on your AP exams.';
    }
    
    if (materialAnalysis?.specificRequirements.length > 0) {
      outcome += ' The plan addresses your specific course requirements and should help you excel in your coursework as well.';
    }
    
    return outcome;
  }

  private calculateConfidence(userProfile: UserProfile, units: any[]): number {
    let confidence = 70; // Base confidence
    
    // Adjust based on user level
    confidence += Math.min(20, userProfile.level * 3);
    
    // Adjust based on time commitment
    if (userProfile.timeAvailable >= 60) confidence += 10;
    if (userProfile.timeAvailable >= 90) confidence += 5;
    
    // Adjust based on current performance
    if (userProfile.totalStars > 100) confidence += 5;
    if (userProfile.currentStreak > 7) confidence += 5;
    
    // Adjust based on number of units (more units = lower confidence per unit)
    confidence -= Math.max(0, (units.length - 2) * 5);
    
    return Math.min(95, Math.max(60, confidence));
  }

  async generateStudyContent(
    subject: string, 
    topic: string, 
    difficulty: string, 
    learningStyle: string
  ): Promise<StudyContent> {
    console.log('🎯 Generating study content for:', { subject, topic, difficulty, learningStyle });
    
    // Use OpenAI if available
    if (this.hasOpenAI) {
      try {
        const content = await openaiService.generateStudyContent(subject, topic, difficulty, learningStyle);
        return this.validateAndFormatContent(content);
      } catch (error) {
        console.warn('OpenAI content generation failed, using local generation:', error);
      }
    }
    
    // Fallback to local content generation
    return this.generateLocalStudyContent(subject, topic, difficulty, learningStyle);
  }

  private generateLocalStudyContent(
    subject: string, 
    topic: string, 
    difficulty: string, 
    learningStyle: string
  ): StudyContent {
    const difficultyPoints = {
      'Beginner': 10,
      'Intermediate': 15,
      'Advanced': 22,
      'Expert': 30
    };

    return {
      type: 'multiple_choice',
      title: `${topic} - AP Concepts`,
      question: `Which of the following best describes the key concept of ${topic} in ${subject}?`,
      options: [
        `${topic} involves understanding fundamental principles and their applications`,
        `${topic} is primarily about memorizing formulas and procedures`,
        `${topic} focuses only on theoretical knowledge without practical use`,
        `${topic} is an advanced concept not needed for AP exams`
      ],
      correct: 0,
      explanation: `${topic} in ${subject} requires both conceptual understanding and practical application skills. This combination is essential for success on AP exams, where you need to demonstrate deep comprehension and problem-solving abilities.`,
      hint: `Think about how ${topic} concepts are applied in real-world scenarios and AP exam questions.`,
      points: difficultyPoints[difficulty as keyof typeof difficultyPoints] || 15,
      difficulty: difficulty.toLowerCase(),
      concepts: [topic, subject, 'AP Problem Solving'],
      apSkills: ['Knowledge', 'Comprehension', 'Application'],
      visualAid: `${topic.toLowerCase()}_${learningStyle}_diagram`,
      audioExplanation: 'Available',
      interactiveElement: this.getInteractiveElement(learningStyle, topic),
      commonMistakes: [
        `Confusing ${topic} with related concepts`,
        'Focusing only on memorization without understanding',
        'Not practicing enough AP-style problems'
      ]
    };
  }

  private getInteractiveElement(learningStyle: string, topic: string): string {
    const elements = {
      'visual': `interactive_${topic.toLowerCase()}_diagram`,
      'auditory': `${topic.toLowerCase()}_audio_explanation`,
      'kinesthetic': `hands_on_${topic.toLowerCase()}_simulation`,
      'reading': `detailed_${topic.toLowerCase()}_text_analysis`
    };
    return elements[learningStyle as keyof typeof elements] || 'concept_builder';
  }

  private validateAndFormatContent(content: any): StudyContent {
    // Ensure required fields exist
    return {
      type: content.type || 'multiple_choice',
      title: content.title || 'Study Content',
      question: content.question || 'What is the main concept?',
      options: content.options || ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: content.correct || 0,
      explanation: content.explanation || 'This is the explanation.',
      hint: content.hint || 'Think about the key concepts.',
      points: content.points || 15,
      difficulty: content.difficulty || 'intermediate',
      concepts: content.concepts || ['General'],
      apSkills: content.apSkills || ['Knowledge'],
      visualAid: content.visualAid || 'diagram',
      audioExplanation: content.audioExplanation || 'Available',
      interactiveElement: content.interactiveElement || 'concept_builder',
      commonMistakes: content.commonMistakes || []
    };
  }

  async generateQuestionSets(
    subject: string, 
    topic: string, 
    difficulty: string, 
    userProfile: UserProfile
  ): Promise<QuestionSet[]> {
    console.log('📝 Generating question sets for:', { subject, topic, difficulty });
    
    // Generate multiple question sets for variety
    const questionSets: QuestionSet[] = [];
    
    // Conceptual Understanding Set
    questionSets.push({
      title: 'Conceptual Understanding',
      questions: this.generateConceptualQuestions(subject, topic, difficulty)
    });
    
    // Application Problems Set
    questionSets.push({
      title: 'Application Problems',
      questions: this.generateApplicationQuestions(subject, topic, difficulty)
    });
    
    // AP Exam Style Set
    questionSets.push({
      title: 'AP Exam Style',
      questions: this.generateAPStyleQuestions(subject, topic, difficulty)
    });
    
    return questionSets;
  }

  private generateConceptualQuestions(subject: string, topic: string, difficulty: string): any[] {
    const questions = [];
    const basePoints = difficulty === 'Beginner' ? 10 : difficulty === 'Intermediate' ? 15 : 20;
    
    for (let i = 0; i < 3; i++) {
      questions.push({
        type: 'multiple_choice',
        question: `What is a key principle of ${topic} in ${subject}?`,
        options: [
          `Understanding the fundamental concepts and their relationships`,
          `Memorizing all formulas without understanding`,
          `Focusing only on computational skills`,
          `Avoiding practical applications`
        ],
        correctAnswer: 0,
        explanation: `${topic} requires deep conceptual understanding to succeed in ${subject} and on AP exams.`,
        hint: `Think about the underlying principles rather than just procedures.`,
        points: basePoints,
        concepts: [topic, subject, 'Conceptual Understanding'],
        apSkills: ['Knowledge', 'Comprehension']
      });
    }
    
    return questions;
  }

  private generateApplicationQuestions(subject: string, topic: string, difficulty: string): any[] {
    const questions = [];
    const basePoints = difficulty === 'Beginner' ? 12 : difficulty === 'Intermediate' ? 18 : 25;
    
    for (let i = 0; i < 3; i++) {
      questions.push({
        type: 'multiple_choice',
        question: `How would you apply ${topic} concepts to solve a real-world problem in ${subject}?`,
        options: [
          `Identify the relevant principles and apply them systematically`,
          `Use trial and error without understanding`,
          `Memorize similar problems and copy the approach`,
          `Avoid using ${topic} concepts altogether`
        ],
        correctAnswer: 0,
        explanation: `Successful application of ${topic} requires identifying relevant principles and applying them systematically to new situations.`,
        hint: `Consider how the concepts connect to practical scenarios.`,
        points: basePoints,
        concepts: [topic, subject, 'Problem Solving', 'Application'],
        apSkills: ['Application', 'Analysis']
      });
    }
    
    return questions;
  }

  private generateAPStyleQuestions(subject: string, topic: string, difficulty: string): any[] {
    const questions = [];
    const basePoints = difficulty === 'Beginner' ? 15 : difficulty === 'Intermediate' ? 22 : 30;
    
    for (let i = 0; i < 4; i++) {
      questions.push({
        type: 'multiple_choice',
        question: `[AP Style] In the context of ${subject}, which statement about ${topic} is most accurate?`,
        options: [
          `${topic} demonstrates complex relationships that require analytical thinking`,
          `${topic} is a simple concept with no real-world applications`,
          `${topic} only applies to theoretical situations`,
          `${topic} can be understood through memorization alone`
        ],
        correctAnswer: 0,
        explanation: `AP exams test your ability to analyze complex relationships and apply concepts to various contexts, which is exactly what ${topic} requires in ${subject}.`,
        hint: `AP questions often test analytical thinking and application rather than simple recall.`,
        points: basePoints,
        concepts: [topic, subject, 'AP Analysis', 'Critical Thinking'],
        apSkills: ['Analysis', 'Synthesis', 'Evaluation']
      });
    }
    
    return questions;
  }

  async trackSessionProgress(sessionData: {
    userId: string;
    subject: string;
    topic: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    questionsAnswered: number;
    correctAnswers: number;
    accuracy: number;
    starsEarned: number;
    conceptsMastered: string[];
    areasForImprovement: string[];
  }): Promise<void> {
    console.log('📊 Tracking session progress:', sessionData);
    
    // In a real implementation, this would update user analytics
    // For now, we'll just log the progress
    const progressSummary = {
      subject: sessionData.subject,
      topic: sessionData.topic,
      performance: {
        accuracy: Math.round(sessionData.accuracy),
        duration: sessionData.duration,
        starsEarned: sessionData.starsEarned
      },
      learning: {
        conceptsMastered: sessionData.conceptsMastered.length,
        areasForImprovement: sessionData.areasForImprovement.length
      }
    };
    
    console.log('📈 Session Progress Summary:', progressSummary);
    
    // Store in localStorage for guest users or future analytics
    const progressHistory = JSON.parse(localStorage.getItem('apollo_progress_history') || '[]');
    progressHistory.push({
      ...progressSummary,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 sessions
    if (progressHistory.length > 50) {
      progressHistory.splice(0, progressHistory.length - 50);
    }
    
    localStorage.setItem('apollo_progress_history', JSON.stringify(progressHistory));
  }
}

export const aiEngine = new AIEngine();