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
  Search
} from 'lucide-react';

interface StudySessionProps {
  task: any;
  onClose: () => void;
  onComplete: (earnedStars: number, performance: any) => void;
}

const InteractiveStudySession: React.FC<StudySessionProps> = ({ task, onClose, onComplete }) => {
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
  const [learningStyle, setLearningStyle] = useState('visual');
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

  // Enhanced study content based on task type and learning style
  const generateStudyContent = () => {
    const baseContent = {
      'Adaptive Practice': [
        {
          type: 'theory',
          title: 'Fundamental Concepts Review',
          question: 'Which principle underlies the integration by parts formula?',
          options: [
            'Product rule for differentiation',
            'Chain rule for differentiation', 
            'Quotient rule for differentiation',
            'Power rule for differentiation'
          ],
          correct: 0,
          explanation: 'Integration by parts is derived from the product rule for differentiation. If we have d/dx[uv] = u\'v + uv\', then integrating both sides gives us the integration by parts formula.',
          hint: 'Think about how integration and differentiation are inverse operations.',
          points: 5,
          difficulty: 'medium',
          concepts: ['Product rule', 'Integration theory', 'Inverse operations'],
          visualAid: 'product_rule_diagram',
          audioExplanation: 'Available',
          interactiveElement: 'formula_builder'
        },
        {
          type: 'guided_practice',
          title: 'Step-by-Step Integration',
          question: 'Solve: ∫ x·e^x dx using integration by parts',
          steps: [
            { step: 1, instruction: 'Choose u and dv', answer: 'u = x, dv = e^x dx' },
            { step: 2, instruction: 'Find du and v', answer: 'du = dx, v = e^x' },
            { step: 3, instruction: 'Apply the formula', answer: 'x·e^x - ∫e^x dx' },
            { step: 4, instruction: 'Simplify', answer: 'x·e^x - e^x + C = e^x(x-1) + C' }
          ],
          explanation: 'This is a classic integration by parts problem. The key insight is choosing u = x (which becomes simpler when differentiated) and dv = e^x dx (which remains manageable when integrated).',
          hint: 'Remember LIATE: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential - this helps choose u.',
          points: 10,
          difficulty: 'hard',
          concepts: ['Integration by parts', 'Exponential functions', 'LIATE rule'],
          visualAid: 'step_by_step_animation',
          audioExplanation: 'Available',
          interactiveElement: 'step_validator'
        },
        {
          type: 'application',
          title: 'Real-World Physics Problem',
          question: 'A particle\'s velocity is v(t) = t·e^(-t). Find the displacement from t=0 to t=2.',
          setup: 'Displacement = ∫₀² t·e^(-t) dt',
          solution_method: 'integration_by_parts',
          answer: '1 - 3e^(-2)',
          explanation: 'Using integration by parts with u = t and dv = e^(-t) dt, we get du = dt and v = -e^(-t). This gives us -t·e^(-t) + ∫e^(-t) dt = -t·e^(-t) - e^(-t) = -e^(-t)(t+1). Evaluating from 0 to 2 gives us the final answer.',
          hint: 'Set up the integration by parts formula carefully, paying attention to the negative sign in the exponential.',
          points: 15,
          difficulty: 'very_hard',
          concepts: ['Physics applications', 'Definite integrals', 'Integration by parts'],
          visualAid: 'velocity_displacement_graph',
          audioExplanation: 'Available',
          interactiveElement: 'graph_plotter'
        }
      ],
      'Interactive Simulation': [
        {
          type: 'simulation',
          title: 'Wave Function Visualization',
          question: 'Observe how the wave function ψ(x) = A·sin(nπx/L) changes as you vary n. What happens to the number of nodes?',
          simulation_params: {
            variable: 'n',
            range: [1, 5],
            observable: 'nodes'
          },
          answer: 'increases_by_one',
          explanation: 'As the quantum number n increases, the number of nodes (points where ψ = 0) increases by one each time. For n = 1, there are 0 nodes; for n = 2, there is 1 node, and so on.',
          hint: 'Count the zero-crossings of the wave function inside the box.',
          points: 8,
          difficulty: 'medium',
          concepts: ['Quantum mechanics', 'Wave functions', 'Boundary conditions'],
          visualAid: 'interactive_wave_simulator',
          audioExplanation: 'Available',
          interactiveElement: 'parameter_slider'
        },
        {
          type: 'conceptual',
          title: 'Quantum Tunneling Probability',
          question: 'In the simulation, increase the barrier height. How does this affect the transmission probability?',
          options: [
            'Increases exponentially',
            'Decreases exponentially',
            'Remains constant',
            'Increases linearly'
          ],
          correct: 1,
          explanation: 'The transmission probability decreases exponentially with barrier height. This is described by T ∝ e^(-2κa) where κ depends on the barrier height and a is the barrier width.',
          hint: 'Think about how classical particles would behave versus quantum particles.',
          points: 12,
          difficulty: 'hard',
          concepts: ['Quantum tunneling', 'Transmission probability', 'Exponential decay'],
          visualAid: 'tunneling_probability_graph',
          audioExplanation: 'Available',
          interactiveElement: 'barrier_height_control'
        }
      ],
      'Visual Learning + 3D Modeling': [
        {
          type: '3d_modeling',
          title: 'Stereochemistry Analysis',
          question: 'Build the 3D model of 2-chlorobutane and determine its R/S configuration.',
          molecule: '2-chlorobutane',
          task: 'assign_configuration',
          answer: 'R',
          explanation: 'Following the Cahn-Ingold-Prelog rules: 1) Assign priorities (Cl > C > C > H), 2) Orient with lowest priority away, 3) Trace path 1→2→3. The path goes clockwise, indicating R configuration.',
          hint: 'Remember to put the hydrogen (lowest priority) pointing away from you before determining the direction.',
          points: 10,
          difficulty: 'medium',
          concepts: ['Stereochemistry', 'R/S configuration', 'CIP rules'],
          visualAid: '3d_molecular_model',
          audioExplanation: 'Available',
          interactiveElement: 'molecular_builder'
        },
        {
          type: 'mechanism_drawing',
          title: 'SN2 Reaction Mechanism',
          question: 'Draw the complete mechanism for the reaction of CH₃CH₂Br with OH⁻.',
          mechanism_type: 'SN2',
          steps: [
            'Nucleophile approaches from backside',
            'Transition state formation',
            'Bond breaking and forming simultaneously',
            'Product formation with inversion'
          ],
          answer: 'concerted_mechanism',
          explanation: 'SN2 reactions proceed through a concerted mechanism where bond breaking and forming occur simultaneously. The nucleophile attacks from the backside, leading to inversion of stereochemistry.',
          hint: 'Remember that SN2 reactions are concerted - everything happens at once.',
          points: 15,
          difficulty: 'hard',
          concepts: ['SN2 mechanism', 'Nucleophilic substitution', 'Stereochemistry'],
          visualAid: 'mechanism_animation',
          audioExplanation: 'Available',
          interactiveElement: 'mechanism_drawer'
        }
      ]
    };

    return baseContent[task.type as keyof typeof baseContent] || baseContent['Adaptive Practice'];
  };

  const [studyContent] = useState(generateStudyContent());
  const currentQuestion = studyContent[currentStep];
  const totalSteps = studyContent.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

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
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(time => time + 1);
        updateSessionStats();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentStep, completedSteps]);

  const updateSessionStats = () => {
    const accuracy = completedSteps.size / Math.max(currentStep, 1) * 100;
    const speed = currentStep / Math.max(sessionTime / 60, 1); // questions per minute
    const consistency = 100 - (adaptiveAdjustments.hintUsage * 10); // penalty for hint usage
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
    if (currentQuestion.type === 'theory' || currentQuestion.type === 'conceptual') {
      isCorrect = answer === currentQuestion.correct;
    } else if (currentQuestion.type === 'guided_practice') {
      // For guided practice, check each step
      isCorrect = true; // Simplified for demo
    } else if (currentQuestion.type === 'application' || currentQuestion.type === '3d_modeling') {
      isCorrect = answer.toString().toLowerCase() === currentQuestion.answer.toLowerCase();
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

  const completeSession = () => {
    setIsActive(false);
    const performance = {
      accuracy: sessionStats.accuracy,
      speed: sessionStats.speed,
      consistency: sessionStats.consistency,
      engagement: sessionStats.engagement,
      adaptiveAdjustments,
      timeSpent: sessionTime,
      stepsCompleted: completedSteps.size,
      hintsUsed: adaptiveAdjustments.hintUsage
    };
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
              <span className="text-gray-400">{currentQuestion.visualAid || 'Interactive diagram would appear here'}</span>
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
              <span>Play Audio</span>
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
              <span className="text-gray-400">{currentQuestion.interactiveElement || 'Interactive component would be here'}</span>
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
      case 'conceptual':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">{currentQuestion.type === 'theory' ? 'Theory' : 'Conceptual Understanding'}</span>
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

      case 'guided_practice':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">Guided Practice</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{currentQuestion.title}</h3>
            <p className="text-gray-300 text-lg mb-6">{currentQuestion.question}</p>
            
            {renderLearningStyleContent()}

            <div className="space-y-4">
              {currentQuestion.steps.map((step: any, index: number) => (
                <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.step}
                    </div>
                    <span className="text-white font-semibold">{step.instruction}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your answer..."
                    className="w-full bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-gray-400 text-sm mt-2">Expected: {step.answer}</p>
                </div>
              ))}
              
              {!showExplanation && (
                <button
                  onClick={() => handleAnswer('completed')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Check Steps
                </button>
              )}
            </div>
          </div>
        );

      case 'application':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Real-World Application</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{currentQuestion.title}</h3>
            <p className="text-gray-300 text-lg mb-4">{currentQuestion.question}</p>
            
            {currentQuestion.setup && (
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-4">
                <p className="text-blue-300 font-mono">{currentQuestion.setup}</p>
              </div>
            )}
            
            {renderLearningStyleContent()}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your final answer..."
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

      case 'simulation':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Interactive Simulation</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{currentQuestion.title}</h3>
            <p className="text-gray-300 text-lg mb-6">{currentQuestion.question}</p>
            
            <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <span className="text-gray-400">Quantum Wave Function Simulator</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Quantum Number (n)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={answers[currentStep] || 1}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [currentStep]: e.target.value }))}
                    className="w-full"
                  />
                  <div className="text-center text-white mt-2">n = {answers[currentStep] || 1}</div>
                </div>
                <div className="h-32 bg-slate-800 rounded flex items-center justify-center">
                  <span className="text-gray-400">Wave function visualization would appear here</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${
                    answers[currentStep + '_answer'] === index
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
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case '3d_modeling':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Video className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">3D Molecular Modeling</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{currentQuestion.title}</h3>
            <p className="text-gray-300 text-lg mb-6">{currentQuestion.question}</p>
            
            <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <span className="text-gray-400">3D Molecular Builder - {currentQuestion.molecule}</span>
              </div>
              <div className="h-64 bg-slate-800 rounded flex items-center justify-center">
                <span className="text-gray-400">3D molecular model would appear here</span>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Rotate
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  Zoom
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                  Analyze
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <select
                value={answers[currentStep] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [currentStep]: e.target.value }))}
                disabled={showExplanation}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select configuration...</option>
                <option value="R">R configuration</option>
                <option value="S">S configuration</option>
                <option value="achiral">Achiral</option>
              </select>

              {!showExplanation && (
                <button
                  onClick={() => handleAnswer(answers[currentStep])}
                  disabled={!answers[currentStep]}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Submit Configuration
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
          {!showExplanation && studyMode !== 'challenge' && (
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
                  <p className="text-yellow-300 text-sm">{currentQuestion?.hint}</p>
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
                <p className="text-blue-300 text-sm">{currentQuestion?.explanation}</p>
              </div>
              
              {/* Concept Tags */}
              {currentQuestion?.concepts && (
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.concepts.map((concept: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      {concept}
                    </span>
                  ))}
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