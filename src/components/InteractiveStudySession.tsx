import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Circle, 
  Star, 
  Clock, 
  Brain,
  Target,
  Award,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  BookOpen,
  Zap,
  Eye,
  Headphones,
  PenTool,
  Users,
  Video,
  MessageSquare,
  BarChart3,
  Settings,
  Timer,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Shuffle,
  Filter,
  Search,
  GraduationCap
} from 'lucide-react';
import { aiEngine } from '../utils/aiEngine';
import { useAuth } from '../hooks/useAuth';

interface StudySessionProps {
  task: any;
  onClose: () => void;
  onComplete: (earnedStars: number, performance: any) => void;
}

const InteractiveStudySession: React.FC<StudySessionProps> = ({ task, onClose, onComplete }) => {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: any}>({});
  const [showHint, setShowHint] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [studyMode, setStudyMode] = useState('guided'); // guided, practice, challenge, adaptive
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [learningStyle, setLearningStyle] = useState(profile?.learning_style || 'visual');
  const [sessionStats, setSessionStats] = useState({
    accuracy: 0,
    speed: 0,
    consistency: 0,
    engagement: 0
  });
  const [adaptiveAdjustments, setAdaptiveAdjustments] = useState({
    difficultyIncrease: 0,
    hintUsage: 0,
    timeExtensions: 0
  });
  const [studyContent, setStudyContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionStartTime] = useState(new Date());

  // Generate study content when component mounts
  useEffect(() => {
    const generateContent = async () => {
      try {
        await generateAPStudyContent();
      } catch (error) {
        console.error('Error generating study content:', error);
        setLoading(false);
        // Set fallback content
        setStudyContent([generateFallbackContent()]);
      }
    };
    
    generateContent();
  }, [task]);

  const generateAPStudyContent = async () => {
    setLoading(true);
    try {
      // Add timeout for content generation
      const contentPromise = generateContentWithTimeout();
      const content = await contentPromise;
      
      setStudyContent(content);
    } catch (error) {
      console.error('Error generating study content:', error);
      // Fallback to basic content
      setStudyContent([generateFallbackContent()]);
    } finally {
      setLoading(false);
    }
  };

  const generateContentWithTimeout = async () => {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Content generation timed out')), 15000)
    );
    
    const contentPromise = (async () => {
      // Generate content using the AI engine with user goals
      const content = await aiEngine.generateStudyContent(
        task.subject, 
        task.topic, 
        task.difficulty, 
        learningStyle,
        profile?.study_goals
      );
      
      // Generate multiple questions for a comprehensive session
      const questionSets = await aiEngine.generateQuestionSets?.(
        task.subject, 
        task.topic, 
        task.difficulty, 
        profile
      ) || [];

      // Combine generated content with question sets
      const sessionContent = [];
      
      // Add theory/concept introduction
      sessionContent.push({
        type: 'theory',
        title: `${task.topic} - AP Concepts`,
        question: content.question || `What are the key AP concepts in ${task.topic}?`,
        options: content.options || [
          'Fundamental principles and AP applications',
          'Advanced theoretical frameworks for AP exam',
          'Practical implementation strategies for AP',
          'Integration with related AP topics'
        ],
        correct: content.correct || 0,
        explanation: content.explanation || `${task.topic} involves understanding core principles and their practical applications in ${task.subject} for the AP exam.`,
        hint: content.hint || `Focus on the fundamental concepts first before moving to advanced AP applications.`,
        points: content.points || 10,
        difficulty: task.difficulty.toLowerCase(),
        concepts: content.concepts || [task.topic, task.subject, 'AP Problem Solving'],
        apSkills: content.apSkills || ['Analysis', 'Application'],
        visualAid: content.visualAid || `${task.topic.toLowerCase()}_ap_diagram`,
        audioExplanation: 'Available',
        interactiveElement: content.interactiveElement || 'ap_concept_builder',
        commonMistakes: content.commonMistakes || []
      });

      // Add questions from question sets
      if (questionSets.length > 0) {
        questionSets.forEach(questionSet => {
          questionSet.questions.slice(0, 6).forEach(question => { // Increased to 6 questions per set
            sessionContent.push({
              type: question.type,
              title: `${task.topic} - ${questionSet.title}`,
              question: question.question,
              options: question.options,
              correct: typeof question.correctAnswer === 'number' ? question.correctAnswer : 0,
              explanation: question.explanation,
              hint: question.hint,
              points: question.points,
              difficulty: task.difficulty.toLowerCase(),
              concepts: question.concepts,
              apSkills: question.apSkills,
              visualAid: `${task.topic.toLowerCase()}_${learningStyle}_ap_aid`,
              audioExplanation: 'Available',
              interactiveElement: getInteractiveElement(learningStyle, task.topic)
            });
          });
        });
      } else {
        // Generate more practice questions if no question sets available
        for (let i = 0; i < 8; i++) {
          sessionContent.push(generatePracticeQuestion(i));
        }
      }

      // Add application/synthesis question
      sessionContent.push({
        type: 'application',
        title: `${task.topic} - AP Application`,
        question: `Apply your knowledge of ${task.topic} to solve this AP-style problem: How would you approach a complex scenario involving ${task.topic} concepts?`,
        steps: [
          { step: 1, instruction: 'Identify key concepts', answer: `Identify the main ${task.topic} principles involved` },
          { step: 2, instruction: 'Analyze the problem', answer: 'Break down the problem into manageable parts' },
          { step: 3, instruction: 'Apply appropriate methods', answer: `Use ${task.topic} techniques to solve each part` },
          { step: 4, instruction: 'Synthesize solution', answer: 'Combine results and verify the answer' }
        ],
        explanation: `This application question tests your ability to use ${task.topic} concepts in complex, real-world scenarios similar to AP exam questions.`,
        hint: `Start by identifying which ${task.topic} concepts are most relevant to the problem.`,
        points: 20,
        difficulty: task.difficulty.toLowerCase(),
        concepts: [task.topic, task.subject, 'Problem Solving', 'Application'],
        apSkills: ['Analysis', 'Application', 'Synthesis'],
        visualAid: `${task.topic.toLowerCase()}_application_diagram`,
        audioExplanation: 'Available',
        interactiveElement: 'ap_problem_solver'
      });

      return sessionContent;
    })();
    
    return Promise.race([contentPromise, timeoutPromise]);
  };

  const generatePracticeQuestion = (index: number) => {
    return {
      type: 'multiple_choice',
      title: `${task.topic} - Practice Question ${index + 1}`,
      question: `Which of the following best demonstrates understanding of ${task.topic} in ${task.subject}?`,
      options: [
        `Correct application of ${task.topic} principles`,
        `Memorization of ${task.topic} formulas`,
        `Basic recognition of ${task.topic} terms`,
        `Advanced theoretical knowledge only`
      ],
      correct: 0,
      explanation: `Understanding ${task.topic} requires both conceptual knowledge and practical application skills, which are essential for AP exam success.`,
      hint: `Think about how ${task.topic} concepts are applied in real AP exam questions.`,
      points: 12,
      difficulty: task.difficulty.toLowerCase(),
      concepts: [task.topic, task.subject, 'AP Application'],
      apSkills: ['Knowledge', 'Application'],
      visualAid: `${task.topic.toLowerCase()}_practice_diagram`,
      audioExplanation: 'Available',
      interactiveElement: 'ap_practice_tool'
    };
  };

  const generateFallbackContent = () => {
    return {
      type: 'theory',
      title: `${task.topic} - AP Overview`,
      question: `What are the essential concepts you need to master in ${task.topic} for the AP exam?`,
      options: [
        'Core principles and their applications',
        'Advanced theoretical frameworks',
        'Memorization of facts and formulas',
        'Historical context only'
      ],
      correct: 0,
      explanation: `Success in AP ${task.subject} requires mastering core principles of ${task.topic} and understanding how to apply them in various contexts.`,
      hint: `Focus on understanding the fundamental concepts rather than just memorizing.`,
      points: 10,
      difficulty: task.difficulty.toLowerCase(),
      concepts: [task.topic, task.subject],
      apSkills: ['Knowledge', 'Comprehension'],
      visualAid: `${task.topic.toLowerCase()}_overview`,
      audioExplanation: 'Available',
      interactiveElement: 'concept_review'
    };
  };

  const getInteractiveElement = (learningStyle: string, topic: string): string => {
    const elements = {
      'visual': 'interactive_ap_diagram',
      'auditory': 'ap_audio_explanation',
      'kinesthetic': 'hands_on_ap_simulation',
      'reading': 'detailed_ap_text_analysis'
    };
    return elements[learningStyle as keyof typeof elements] || 'ap_concept_builder';
  };

  const currentQuestion = studyContent[currentStep];
  const totalSteps = studyContent.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  // Study mode configurations
  const studyModes = {
    guided: { name: 'Guided Learning', icon: BookOpen, description: 'Step-by-step with hints' },
    practice: { name: 'Practice Mode', icon: PenTool, description: 'Independent problem solving' },
    challenge: { name: 'Challenge Mode', icon: Target, description: 'Timed, no hints' },
    adaptive: { name: 'Adaptive AI', icon: Brain, description: 'AI adjusts difficulty' }
  };

  const learningStyles = {
    visual: { name: 'Visual', icon: Eye, description: 'Diagrams and animations' },
    auditory: { name: 'Auditory', icon: Headphones, description: 'Audio explanations' },
    kinesthetic: { name: 'Hands-on', icon: PenTool, description: 'Interactive elements' },
    reading: { name: 'Reading', icon: BookOpen, description: 'Text-based learning' }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !loading) {
      interval = setInterval(() => {
        setSessionTime(time => time + 1);
        updateSessionStats();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentStep, completedSteps, loading]);

  const updateSessionStats = () => {
    const accuracy = totalSteps > 0 ? (completedSteps.size / Math.max(currentStep, 1)) * 100 : 0;
    const speed = sessionTime > 0 ? currentStep / (sessionTime / 60) : 0; // questions per minute
    const consistency = Math.max(0, 100 - (adaptiveAdjustments.hintUsage * 10)); // penalty for hint usage
    const engagement = Math.min(100, sessionTime / (task.duration * 60) * 100);

    setSessionStats({ accuracy, speed, consistency, engagement });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentStep]: answer }));
    
    // Check if answer is correct and award points
    let isCorrect = false;
    if (currentQuestion.type === 'theory' || currentQuestion.type === 'multiple_choice') {
      isCorrect = answer === currentQuestion.correct;
    } else if (currentQuestion.type === 'application') {
      // For application questions, check if all steps are completed
      isCorrect = true; // Simplified for demo
    } else {
      isCorrect = answer.toString().toLowerCase() === currentQuestion.answer?.toLowerCase();
    }

    if (isCorrect) {
      setEarnedStars(prev => prev + currentQuestion.points);
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }

    // Adaptive difficulty adjustment
    if (studyMode === 'adaptive') {
      if (isCorrect && sessionStats.accuracy > 80) {
        setAdaptiveAdjustments(prev => ({ ...prev, difficultyIncrease: prev.difficultyIncrease + 1 }));
      }
    }

    setShowExplanation(true);
  };

  const useHint = () => {
    setShowHint(true);
    setAdaptiveAdjustments(prev => ({ ...prev, hintUsage: prev.hintUsage + 1 }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setShowExplanation(false);
      setShowHint(false);
    } else {
      completeSession();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowExplanation(false);
      setShowHint(false);
    }
  };

  const completeSession = async () => {
    setIsActive(false);
    const endTime = new Date();
    const actualDuration = Math.round((endTime.getTime() - sessionStartTime.getTime()) / 1000 / 60); // minutes
    
    const performance = {
      accuracy: sessionStats.accuracy,
      speed: sessionStats.speed,
      consistency: sessionStats.consistency,
      engagement: sessionStats.engagement,
      adaptiveAdjustments,
      timeSpent: actualDuration,
      stepsCompleted: completedSteps.size,
      hintsUsed: adaptiveAdjustments.hintUsage,
      conceptsMastered: currentQuestion?.concepts || [],
      areasForImprovement: adaptiveAdjustments.hintUsage > 2 ? [task.topic] : []
    };

    // Track session progress with AI engine
    try {
      await aiEngine.trackSessionProgress({
        userId: profile?.id,
        subject: task.subject,
        topic: task.topic,
        startTime: sessionStartTime,
        endTime: endTime,
        duration: actualDuration,
        questionsAnswered: currentStep + 1,
        correctAnswers: completedSteps.size,
        accuracy: sessionStats.accuracy,
        starsEarned: earnedStars,
        conceptsMastered: performance.conceptsMastered,
        areasForImprovement: performance.areasForImprovement
      });
    } catch (error) {
      console.error('Error tracking session progress:', error);
    }

    onComplete(earnedStars, performance);
  };

  const renderLearningStyleContent = () => {
    if (!currentQuestion) return null;

    switch (learningStyle) {
      case 'visual':
        return (
          <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-semibold">Visual Aid</span>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <span className="text-gray-400">{currentQuestion.visualAid || 'Interactive AP diagram would appear here'}</span>
            </div>
          </div>
        );
      case 'auditory':
        return (
          <div className="mb-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Headphones className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold">Audio Explanation</span>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Play AP Audio</span>
            </button>
          </div>
        );
      case 'kinesthetic':
        return (
          <div className="mb-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <PenTool className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-semibold">Interactive Element</span>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <span className="text-gray-400">{currentQuestion.interactiveElement || 'Interactive AP component would be here'}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'theory':
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">AP {currentQuestion.type === 'theory' ? 'Theory' : 'Multiple Choice'}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{currentQuestion.title}</h3>
            <p className="text-gray-300 text-lg mb-6">{currentQuestion.question}</p>
            
            {renderLearningStyleContent()}

            <div className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                    answers[currentStep] === index
                      ? showExplanation
                        ? index === currentQuestion.correct
                          ? 'bg-green-500/20 border-green-500 text-green-300'
                          : 'bg-red-500/20 border-red-500 text-red-300'
                        : 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : showExplanation && index === currentQuestion.correct
                        ? 'bg-green-500/20 border-green-500 text-green-300'
                        : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-purple-500/50 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentStep] === index ? 'border-current' : 'border-gray-500'
                    }`}>
                      {answers[currentStep] === index && <div className="w-3 h-3 rounded-full bg-current" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'application':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">AP Application</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{currentQuestion.title}</h3>
            <p className="text-gray-300 text-lg mb-4">{currentQuestion.question}</p>
            
            {renderLearningStyleContent()}

            <div className="space-y-4">
              {currentQuestion.steps?.map((step: any, index: number) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.step}
                    </div>
                    <span className="text-white font-semibold">{step.instruction}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your approach..."
                    className="w-full bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-gray-400 text-sm mt-2">Suggested approach: {step.answer}</p>
                </div>
              ))}
              
              {!showExplanation && (
                <button
                  onClick={() => handleAnswer('completed')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Complete Application
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">{currentQuestion.title}</h3>
            <p className="text-gray-300 text-lg mb-6">{currentQuestion.question}</p>
            
            {renderLearningStyleContent()}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your answer..."
                value={answers[currentStep] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [currentStep]: e.target.value }))}
                disabled={showExplanation}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none text-lg"
              />

              {!showExplanation && (
                <button
                  onClick={() => handleAnswer(answers[currentStep])}
                  disabled={!answers[currentStep]}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Submit Answer
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Generating AP Study Content</h2>
          <p className="text-gray-300">Creating personalized questions for {task.topic}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{task.subject}</h2>
              <p className="text-purple-400 font-semibold">{task.topic}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Study Mode and Learning Style Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Study Mode</label>
              <select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
              >
                {Object.entries(studyModes).map(([key, mode]) => (
                  <option key={key} value={key}>{mode.name} - {mode.description}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Learning Style</label>
              <select
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
              >
                {Object.entries(learningStyles).map(([key, style]) => (
                  <option key={key} value={key}>{style.name} - {style.description}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Enhanced Progress and Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-white font-mono">{formatTime(sessionTime)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-semibold">{earnedStars} stars</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-white">{completedSteps.size}/{totalSteps}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-white">{Math.round(sessionStats.accuracy)}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-white">{sessionStats.speed.toFixed(1)}/min</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-pink-400" />
              <span className="text-white">{Math.round(sessionStats.engagement)}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Progress</span>
              <span className="text-purple-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Question {currentStep + 1} of {totalSteps}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-sm">{currentQuestion?.points || 0} points</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm">{currentQuestion?.difficulty || 'medium'}</span>
                </div>
              </div>
            </div>
          </div>

          {renderQuestion()}

          {/* Enhanced Hint System */}
          {!showExplanation && studyMode !== 'challenge' && currentQuestion?.hint && (
            <div className="mt-6">
              <button
                onClick={useHint}
                disabled={showHint}
                className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors disabled:opacity-50"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHint ? 'Hint Used' : 'Need a Hint?'}</span>
              </button>
              
              {showHint && (
                <div className="mt-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-yellow-300 text-sm">{currentQuestion.hint}</p>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Explanation */}
          {showExplanation && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Detailed Explanation</span>
                </div>
                <p className="text-blue-300 text-sm">{currentQuestion.explanation}</p>
              </div>
              
              {/* AP Skills Tags */}
              {currentQuestion?.apSkills && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-400 text-sm">AP Skills:</span>
                  {currentQuestion.apSkills.map((skill: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Concept Tags */}
              {currentQuestion?.concepts && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-400 text-sm">Concepts:</span>
                  {currentQuestion.concepts.map((concept: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      {concept}
                    </span>
                  ))}
                </div>
              )}

              {/* Common Mistakes */}
              {currentQuestion?.commonMistakes && currentQuestion.commonMistakes.length > 0 && (
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-semibold">Common Mistakes to Avoid</span>
                  </div>
                  <ul className="text-red-300 text-sm space-y-1">
                    {currentQuestion.commonMistakes.map((mistake: string, index: number) => (
                      <li key={index}>• {mistake}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {completedSteps.has(currentStep) && (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">+{currentQuestion?.points} stars earned!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Navigation */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentStep
                      ? 'bg-purple-500'
                      : completedSteps.has(i)
                        ? 'bg-green-500'
                        : i < currentStep
                          ? 'bg-gray-500'
                          : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={!showExplanation}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <span>{currentStep === totalSteps - 1 ? 'Complete' : 'Next'}</span>
              {currentStep === totalSteps - 1 ? <Award className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveStudySession;