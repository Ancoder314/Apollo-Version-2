import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  Play,
  Brain,
  Zap,
  Award,
  ChevronRight,
  Lightbulb,
  BarChart3,
  Users,
  Calendar,
  Settings,
  Sparkles,
  Rocket,
  Eye,
  Headphones,
  PenTool,
  MessageSquare
} from 'lucide-react';
import InteractiveStudySession from './InteractiveStudySession';
import { aiEngine, UserProfile, StudyPlan } from '../utils/aiEngine';

interface DashboardProps {
  userData: any;
  setShowTimer: (show: boolean) => void;
  setUserData: (data: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, setShowTimer, setUserData }) => {
  const [activeTask, setActiveTask] = useState<any>(null);
  const [showStudySession, setShowStudySession] = useState(false);
  const [aiStudyPlan, setAiStudyPlan] = useState<StudyPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [planGenerationStep, setPlanGenerationStep] = useState(0);

  const studyTasks = [
    {
      id: 1,
      type: 'Adaptive Practice',
      subject: 'Mathematics',
      topic: 'Integration by Parts',
      difficulty: 'Advanced',
      duration: 45,
      stars: 15,
      description: 'Master advanced integration techniques with step-by-step guidance',
      aiRecommended: true,
      learningStyle: 'visual',
      prerequisites: ['Basic Integration', 'Product Rule']
    },
    {
      id: 2,
      type: 'Interactive Simulation',
      subject: 'Physics',
      topic: 'Quantum Mechanics',
      difficulty: 'Expert',
      duration: 60,
      stars: 25,
      description: 'Explore wave functions and quantum tunneling through interactive simulations',
      aiRecommended: true,
      learningStyle: 'kinesthetic',
      prerequisites: ['Wave Physics', 'Linear Algebra']
    },
    {
      id: 3,
      type: 'Visual Learning + 3D Modeling',
      subject: 'Chemistry',
      topic: 'Organic Stereochemistry',
      difficulty: 'Intermediate',
      duration: 40,
      stars: 18,
      description: 'Build and analyze 3D molecular structures to understand stereochemistry',
      aiRecommended: false,
      learningStyle: 'visual',
      prerequisites: ['Basic Organic Chemistry']
    }
  ];

  const quickActions = [
    { 
      icon: Brain, 
      label: 'AI Study Plan', 
      color: 'from-purple-500 to-pink-500',
      action: () => generateAIStudyPlan(),
      description: 'Get a personalized study plan powered by AI'
    },
    { 
      icon: Target, 
      label: 'Focus Areas', 
      color: 'from-blue-500 to-cyan-500',
      action: () => console.log('Focus Areas'),
      description: 'Work on your identified weak areas'
    },
    { 
      icon: Zap, 
      label: 'Quick Review', 
      color: 'from-green-500 to-emerald-500',
      action: () => console.log('Quick Review'),
      description: 'Review recent topics and concepts'
    },
    { 
      icon: Award, 
      label: 'Challenges', 
      color: 'from-orange-500 to-red-500',
      action: () => console.log('Challenges'),
      description: 'Take on advanced problem sets'
    }
  ];

  const generateAIStudyPlan = async () => {
    setIsGeneratingPlan(true);
    setPlanGenerationStep(0);
    
    // Simulate AI processing steps
    const steps = [
      'Analyzing your learning profile...',
      'Identifying knowledge gaps...',
      'Selecting optimal topics...',
      'Creating adaptive milestones...',
      'Personalizing recommendations...',
      'Finalizing your study plan...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setPlanGenerationStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Convert userData to UserProfile format
    const userProfile: UserProfile = {
      name: userData.name,
      level: userData.level,
      totalStars: userData.totalStars,
      currentStreak: userData.currentStreak,
      studyTime: userData.studyTime,
      completedLessons: userData.completedLessons,
      weakAreas: userData.weakAreas,
      strongAreas: userData.strongAreas,
      learningStyle: 'visual', // Default, could be user-selected
      preferredDifficulty: 'adaptive',
      studyGoals: ['Improve weak areas', 'Maintain strong areas'],
      timeAvailable: 90, // 1.5 hours per day
      recentPerformance: {
        accuracy: 75,
        speed: 1.2,
        consistency: 80,
        engagement: 85
      }
    };

    const plan = aiEngine.generateStudyPlan(userProfile, ['Master Calculus', 'Understand Quantum Physics']);
    setAiStudyPlan(plan);
    setIsGeneratingPlan(false);
    setShowPlanDetails(true);
  };

  const handleTaskStart = (task: any) => {
    setActiveTask(task);
    setShowStudySession(true);
  };

  const handleSessionComplete = (earnedStars: number, performance: any) => {
    setUserData({
      ...userData,
      totalStars: userData.totalStars + earnedStars,
      completedLessons: userData.completedLessons + 1,
      studyTime: userData.studyTime + (activeTask?.duration || 30)
    });
    setShowStudySession(false);
    setActiveTask(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/10';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/10';
      case 'Advanced': return 'text-orange-400 bg-orange-500/10';
      case 'Expert': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case 'visual': return Eye;
      case 'auditory': return Headphones;
      case 'kinesthetic': return PenTool;
      case 'reading': return BookOpen;
      default: return Eye;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {userData.name}! 🚀
            </h2>
            <p className="text-gray-300">
              Ready to continue your learning journey? Your AI tutor has prepared personalized recommendations.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-400">{userData.level}</div>
            <div className="text-gray-400 text-sm">Current Level</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className="group bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{action.label}</h3>
              <p className="text-gray-400 text-sm">{action.description}</p>
            </button>
          );
        })}
      </div>

      {/* AI Study Plan Generation Modal */}
      {isGeneratingPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Study Plan Generator</h3>
              <div className="space-y-4">
                {[
                  'Analyzing your learning profile...',
                  'Identifying knowledge gaps...',
                  'Selecting optimal topics...',
                  'Creating adaptive milestones...',
                  'Personalizing recommendations...',
                  'Finalizing your study plan...'
                ].map((step, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    index <= planGenerationStep 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'bg-slate-700/30 text-gray-500'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      index < planGenerationStep 
                        ? 'bg-green-500 text-white' 
                        : index === planGenerationStep 
                          ? 'bg-purple-500 text-white animate-spin' 
                          : 'bg-gray-600 text-gray-400'
                    }`}>
                      {index < planGenerationStep ? '✓' : index === planGenerationStep ? '⟳' : index + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Study Plan Details Modal */}
      {showPlanDetails && aiStudyPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{aiStudyPlan.title}</h2>
                  <p className="text-gray-300">{aiStudyPlan.description}</p>
                </div>
                <button
                  onClick={() => setShowPlanDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Plan Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-purple-400 text-sm">Duration</div>
                  <div className="text-white font-bold">{aiStudyPlan.duration} days</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-blue-400 text-sm">Daily Time</div>
                  <div className="text-white font-bold">{aiStudyPlan.dailyTimeCommitment} min</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-green-400 text-sm">Difficulty</div>
                  <div className="text-white font-bold">{aiStudyPlan.difficulty}</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-yellow-400 text-sm">Confidence</div>
                  <div className="text-white font-bold">{aiStudyPlan.confidence}%</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              {/* Subjects */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Study Subjects</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiStudyPlan.subjects.map((subject, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold">{subject.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          subject.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          subject.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {subject.priority} priority
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{subject.reasoning}</p>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-300">
                          <strong>Topics:</strong> {subject.topics.map(t => t.name).join(', ')}
                        </div>
                        <div className="text-sm text-purple-400">
                          <strong>Time Allocation:</strong> {subject.timeAllocation}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Learning Milestones</span>
                </h3>
                <div className="space-y-3">
                  {aiStudyPlan.milestones.slice(0, 4).map((milestone, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Week {milestone.week}: {milestone.title}</h4>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">{milestone.rewards.join(', ')}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{milestone.description}</p>
                      <div className="text-sm text-green-400">
                        <strong>Success Criteria:</strong> {milestone.successCriteria.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adaptive Features */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Adaptive Features</span>
                </h3>
                <div className="space-y-3">
                  {aiStudyPlan.adaptiveFeatures.map((feature, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                      <div className="flex items-start space-x-3">
                        <Zap className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div>
                          <div className="text-white font-medium">{feature.trigger}</div>
                          <div className="text-purple-400 text-sm">{feature.action}</div>
                          <div className="text-gray-400 text-sm mt-1">{feature.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized Recommendations */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>AI Recommendations</span>
                </h3>
                <div className="space-y-2">
                  {aiStudyPlan.personalizedRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5" />
                      <span className="text-blue-300 text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Outcome */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                  <Rocket className="w-5 h-5 text-green-400" />
                  <span>Expected Outcome</span>
                </h3>
                <p className="text-green-300">{aiStudyPlan.estimatedOutcome}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700/50 bg-slate-800/50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Generated with {aiStudyPlan.confidence}% confidence • Personalized for your learning style
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => setShowPlanDetails(false)}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowPlanDetails(false);
                      // Here you would implement plan activation
                      console.log('Activating AI study plan:', aiStudyPlan);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors"
                  >
                    Start This Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Study Tasks */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>AI-Recommended Study Sessions</span>
            </h3>
            <span className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
              Personalized for you
            </span>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {studyTasks.map((task) => {
            const LearningIcon = getLearningStyleIcon(task.learningStyle);
            return (
              <div
                key={task.id}
                className="group bg-slate-700/30 rounded-lg p-6 border border-slate-600/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-semibold">{task.subject}</span>
                      </div>
                      {task.aiRecommended && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                          <Brain className="w-3 h-3" />
                          <span>AI Pick</span>
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-2">{task.topic}</h4>
                    <p className="text-gray-300 mb-4">{task.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{task.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{task.stars} stars</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <LearningIcon className="w-4 h-4 text-blue-400" />
                        <span>{task.learningStyle} learning</span>
                      </div>
                    </div>
                    
                    {task.prerequisites.length > 0 && (
                      <div className="mt-3 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Prerequisites:</span>
                        <div className="flex flex-wrap gap-1">
                          {task.prerequisites.map((prereq, index) => (
                            <span key={index} className="text-xs bg-slate-600/50 text-gray-400 px-2 py-1 rounded">
                              {prereq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleTaskStart(task)}
                    className="ml-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 group-hover:shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Session Modal */}
      {showStudySession && activeTask && (
        <InteractiveStudySession
          task={activeTask}
          onClose={() => setShowStudySession(false)}
          onComplete={handleSessionComplete}
        />
      )}

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Today's Focus</h3>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Study Time</span>
              <span className="text-white font-semibold">2.5h / 3h</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '83%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Lessons</span>
              <span className="text-white font-semibold">3 / 4</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Weekly Streak</h3>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{userData.currentStreak}</div>
            <div className="text-gray-400 text-sm">days in a row</div>
            <div className="mt-4 flex justify-center space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < userData.currentStreak % 7 ? 'bg-purple-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Next Milestone</h3>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3">
            <div className="text-white font-medium">Level {userData.level + 1}</div>
            <div className="text-gray-400 text-sm">Complete 5 more lessons</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '60%' }} />
            </div>
            <div className="text-yellow-400 text-sm">3 / 5 lessons</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;