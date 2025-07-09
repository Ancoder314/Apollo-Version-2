import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BarChart3, 
  Star, 
  User, 
  Timer,
  Target,
  TrendingUp,
  Award,
  LogOut,
  Brain,
  Zap,
  Play,
  Clock,
  Lock,
  CheckCircle,
  Plus,
  Sparkles,
  BookOpen,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import InteractiveStudySession from './InteractiveStudySession';
import StudyPlanGenerator from './StudyPlanGenerator';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { StudyPlan } from '../utils/aiEngine';

interface DashboardProps {
  setShowTimer: (show: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setShowTimer }) => {
  const { profile, updateProfile } = useAuth();
  const [activeTask, setActiveTask] = useState<any>(null);
  const [showStudySession, setShowStudySession] = useState(false);
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const [currentStudyPlan, setCurrentStudyPlan] = useState<StudyPlan | null>(null);
  const [studyTasks, setStudyTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [dailyProgress, setDailyProgress] = useState({
    studyTime: 0,
    lessonsCompleted: 0,
    starsEarned: 0,
    targetStudyTime: 180, // 3 hours
    targetLessons: 4
  });

  useEffect(() => {
    if (profile) {
      fetchActiveStudyPlan();
      fetchDailyProgress();
      loadCompletedTasks();
    }
  }, [profile]);

  useEffect(() => {
    if (currentStudyPlan) {
      generateAPRecommendedTasks();
    }
  }, [currentStudyPlan]);

  const loadCompletedTasks = () => {
    const today = new Date().toDateString();
    const savedTasks = localStorage.getItem(`completed_tasks_${profile?.id}_${today}`);
    if (savedTasks) {
      setCompletedTasks(new Set(JSON.parse(savedTasks)));
    }
  };

  const saveCompletedTask = (taskId: string) => {
    const today = new Date().toDateString();
    const newCompleted = new Set([...completedTasks, taskId]);
    setCompletedTasks(newCompleted);
    localStorage.setItem(`completed_tasks_${profile?.id}_${today}`, JSON.stringify([...newCompleted]));
  };

  const fetchActiveStudyPlan = async () => {
    if (!profile) return;

    try {
      setError(''); // Clear any previous errors
      
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching study plan:', error);
        setError('Failed to load study plan. Some features may be limited.');
        return;
      }

      if (data && data.length > 0) {
        const planData = data[0];
        
        // Validate plan data structure
        if (!planData.subjects || !Array.isArray(planData.subjects)) {
          console.warn('Invalid study plan structure, fixing...');
          planData.subjects = [];
        }
        
        const studyPlan = {
          id: planData.id,
          title: planData.title,
          description: planData.description,
          duration: planData.duration,
          dailyTimeCommitment: planData.daily_time_commitment,
          difficulty: planData.difficulty,
          subjects: planData.subjects,
          milestones: planData.milestones,
          adaptiveFeatures: planData.adaptive_features,
          personalizedRecommendations: planData.personalized_recommendations,
          estimatedOutcome: planData.estimated_outcome,
          confidence: planData.confidence
        };
        
        setCurrentStudyPlan(studyPlan);
      }
    } catch (error) {
      console.error('Error fetching study plan:', error);
      setError('Failed to load study plan. Please try refreshing the page.');
    }
  };

  const fetchDailyProgress = async () => {
    if (!profile) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', profile.id)
        .eq('date', today);

      if (error) {
        console.error('Error fetching daily progress:', error);
        // Don't show error for daily progress as it's not critical
        return;
      }

      if (data && data.length > 0) {
        const progressData = data[0];
        setDailyProgress(prev => ({
          ...prev,
          studyTime: progressData.study_time,
          lessonsCompleted: progressData.lessons_completed,
          starsEarned: progressData.stars_earned
        }));
      }
    } catch (error) {
      console.error('Error fetching daily progress:', error);
      // Don't show error for daily progress as it's not critical
    }
  };

  const generateAPRecommendedTasks = () => {
    if (!currentStudyPlan || !profile || !currentStudyPlan.subjects) {
      console.warn('Missing study plan or profile for task generation');
      setStudyTasks([]);
      return;
    }

    // Validate that currentStudyPlan has proper structure
    if (!Array.isArray(currentStudyPlan.subjects)) {
      console.warn('Study plan subjects is not a valid array:', currentStudyPlan.subjects);
      setStudyTasks([]);
      return;
    }
    
    const tasks: any[] = [];
    
    // Generate tasks based on AP study plan subjects
    currentStudyPlan.subjects.forEach((subject, index) => {
      // Validate subject structure
      if (!subject || typeof subject !== 'object') {
        console.warn('Invalid subject object at index', index, ':', subject);
        return;
      }
      
      // Ensure subject has topics array
      if (!subject.topics || !Array.isArray(subject.topics)) {
        console.warn('Subject topics is not a valid array for subject:', subject.name);
        // Create a default topic for this subject
        const defaultTopic = {
          name: `${subject?.name || 'AP Subject'} Fundamentals`,
          difficulty: 'Intermediate',
          estimatedTime: 45,
          prerequisites: [],
          learningObjectives: [`Master ${subject?.name || 'AP'} basics`],
          resources: [],
          assessments: []
        };
        
        subject.topics = [defaultTopic];
      }
      
      subject.topics.forEach((topic, topicIndex) => {
        // Validate topic structure
        if (!topic || typeof topic !== 'object') {
          console.warn('Invalid topic object:', topic);
          return;
        }
        
        // Ensure topic has required properties
        if (!topic.name) {
          console.warn('Topic missing name property:', topic);
          topic.name = `${subject.name} Topic ${topicIndex + 1}`;
        }
        
        if (!topic.difficulty) {
          topic.difficulty = 'Intermediate';
        }
        
        if (!topic.estimatedTime) {
          topic.estimatedTime = 30;
        }
        
        // Ensure arrays exist
        if (!Array.isArray(topic.prerequisites)) {
          topic.prerequisites = [];
        }
        if (!Array.isArray(topic.learningObjectives)) {
          topic.learningObjectives = [`Master ${topic.name} concepts`];
        }
        if (!Array.isArray(topic.resources)) {
          topic.resources = [];
        }
        if (!Array.isArray(topic.assessments)) {
          topic.assessments = [];
        }
        
        if (tasks.length >= 6) {
          return;
        }
        
        tasks.push({
          id: `${index}-${topicIndex}`,
          type: getAPTaskType(subject.name || 'AP Subject', topic.difficulty),
          subject: subject.name || 'AP Subject',
          topic: topic.name,
          difficulty: topic.difficulty,
          duration: topic.estimatedTime,
          stars: calculateAPStars(topic.difficulty),
          description: `Master ${topic.name} with ${getAPTaskType(subject.name || 'AP Subject', topic.difficulty).toLowerCase()}`,
          aiRecommended: (subject.priority || 'medium') === 'high',
          learningStyle: profile.learning_style || 'visual',
          prerequisites: topic.prerequisites,
          learningObjectives: topic.learningObjectives,
          resources: topic.resources,
          assessments: topic.assessments
        });
      });
    });

    setStudyTasks(tasks);
  };

  const getAPTaskType = (subject: string, difficulty: string) => {
    const apTypes = {
      'AP Calculus AB': ['Derivative Practice', 'Integration Problems', 'Limit Analysis'],
      'AP Calculus BC': ['Series Convergence', 'Parametric Equations', 'Advanced Integration'],
      'AP Physics 1': ['Kinematics Lab', 'Force Analysis', 'Energy Conservation'],
      'AP Physics 2': ['Circuit Analysis', 'Thermodynamics', 'Wave Properties'],
      'AP Chemistry': ['Stoichiometry Practice', 'Equilibrium Problems', 'Kinetics Analysis'],
      'AP Biology': ['Cell Structure Study', 'Genetics Problems', 'Evolution Analysis'],
      'AP Computer Science A': ['Algorithm Design', 'Object-Oriented Programming', 'Data Structure Implementation'],
      'AP Statistics': ['Probability Calculations', 'Hypothesis Testing', 'Regression Analysis'],
      'AP English Language': ['Rhetorical Analysis', 'Argument Construction', 'Synthesis Writing'],
      'AP English Literature': ['Poetry Analysis', 'Literary Interpretation', 'Thematic Essays'],
      'AP US History': ['Document Analysis', 'Historical Argumentation', 'Period Synthesis'],
      'default': ['AP Practice Problems', 'Concept Review', 'Exam Preparation']
    };
    
    const subjectTypes = apTypes[subject as keyof typeof apTypes] || apTypes.default;
    return subjectTypes[Math.floor(Math.random() * subjectTypes.length)];
  };

  const calculateAPStars = (difficulty: string) => {
    const starMap = {
      'Beginner': 10,
      'Intermediate': 15,
      'Advanced': 22,
      'Expert': 30
    };
    return starMap[difficulty as keyof typeof starMap] || 12;
  };

  const handleTaskStart = (task: any) => {
    setActiveTask(task);
    setShowStudySession(true);
  };

  const handleSessionComplete = async (earnedStars: number, performance: any) => {
    if (!profile || !activeTask) return;

    try {
      // Mark task as completed
      saveCompletedTask(activeTask.id);

      // Update user profile
      const newTotalStars = profile.total_stars + earnedStars;
      const newCompletedLessons = profile.completed_lessons + 1;
      const newStudyTime = profile.study_time + activeTask.duration;
      const newLevel = Math.floor(newTotalStars / 100) + 1; // Level up every 100 stars

      await updateProfile({
        total_stars: newTotalStars,
        completed_lessons: newCompletedLessons,
        study_time: newStudyTime,
        level: Math.max(profile.level, newLevel)
      });

      // Record study session
      await supabase.from('study_sessions').insert({
        user_id: profile.id,
        subject: activeTask.subject,
        topic: activeTask.topic,
        duration: activeTask.duration,
        stars_earned: earnedStars,
        accuracy: performance.accuracy,
        session_data: performance
      });

      // Update daily progress
      const today = new Date().toISOString().split('T')[0];
      const { data: existingProgress } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', profile.id)
        .eq('date', today);

      if (existingProgress && existingProgress.length > 0) {
        const progressData = existingProgress[0];
        await supabase
          .from('daily_progress')
          .update({
            study_time: progressData.study_time + activeTask.duration,
            lessons_completed: progressData.lessons_completed + 1,
            stars_earned: progressData.stars_earned + earnedStars,
            subjects_studied: Array.from(new Set([...progressData.subjects_studied, activeTask.subject]))
          })
          .eq('id', progressData.id);
      } else {
        await supabase.from('daily_progress').insert({
          user_id: profile.id,
          date: today,
          study_time: activeTask.duration,
          lessons_completed: 1,
          stars_earned: earnedStars,
          subjects_studied: [activeTask.subject]
        });
      }

      // Refresh daily progress
      fetchDailyProgress();
      
    } catch (error) {
      console.error('Error completing session:', error);
    }

    setShowStudySession(false);
    setActiveTask(null);
  };

  const generatePersonalizedFocusTask = () => {
    if (!currentStudyPlan || !currentStudyPlan.subjects || !Array.isArray(currentStudyPlan.subjects)) {
      return null;
    }
    
    // Find high priority AP subjects (weak areas) or use user's weak areas
    let focusSubjects = currentStudyPlan.subjects.filter(s => s && s.priority === 'high');
    
    // If no high priority subjects, use user's weak areas
    if (focusSubjects.length === 0 && profile?.weak_areas && profile.weak_areas.length > 0) {
      // Create a focus subject from weak areas
      const weakArea = profile.weak_areas[0];
      focusSubjects = [{
        name: `AP ${weakArea}`,
        priority: 'high',
        topics: [{
          name: `${weakArea} Fundamentals`,
          difficulty: 'Intermediate',
          estimatedTime: 45,
          prerequisites: [],
          learningObjectives: [`Master ${weakArea} concepts`, `Improve ${weakArea} problem-solving`],
          resources: [],
          assessments: []
        }],
        reasoning: `Focus on your identified weak area: ${weakArea}`
      }];
    }
    
    if (focusSubjects.length === 0) {
      // Create a general focus task based on current level
      const generalTopics = [
        'Problem Solving Strategies',
        'Critical Thinking Skills',
        'Test-Taking Techniques',
        'Time Management',
        'Study Methods'
      ];
      const topic = generalTopics[Math.floor(Math.random() * generalTopics.length)];
      
      return {
        id: 'focus-general',
        type: 'AP Focus Session',
        subject: 'AP Study Skills',
        topic: topic,
        difficulty: 'Intermediate',
        duration: 30,
        stars: 20,
        description: `Improve your AP study effectiveness with ${topic.toLowerCase()} practice.`,
        aiRecommended: true,
        learningStyle: profile?.learning_style || 'visual',
        prerequisites: [],
        learningObjectives: [`Develop ${topic.toLowerCase()}`, 'Improve AP exam performance'],
        resources: [],
        assessments: [],
        isPersonalized: true
      };
    }

    const subject = focusSubjects[0];
    const topic = subject.topics && subject.topics.length > 0 ? subject.topics[0] : null;
    
    return {
      id: 'focus-task',
      type: 'AP Focus Session',
      subject: subject.name || 'AP Focus',
      topic: topic?.name || 'Foundation Review',
      difficulty: topic?.difficulty || 'Intermediate',
      duration: 45,
      stars: 25,
      description: `Targeted AP practice for your weak area: ${subject.name || 'AP Focus'}. ${subject.reasoning || 'Focus on improving weak areas.'}`,
      aiRecommended: true,
      learningStyle: profile?.learning_style || 'visual',
      prerequisites: topic?.prerequisites || [],
      learningObjectives: topic?.learningObjectives || [`Master ${subject.name} fundamentals`],
      resources: topic?.resources || [],
      assessments: topic?.assessments || [],
      isPersonalized: true
    };
  };

  const generatePersonalizedQuickReview = () => {
    if (!currentStudyPlan || !currentStudyPlan.subjects || !Array.isArray(currentStudyPlan.subjects)) {
      return null;
    }
    
    // Get recently studied topics from completed tasks
    let recentTopics = studyTasks
      .filter(task => completedTasks.has(task.id))
      .slice(-3)
      .map(task => task.topic);
    
    if (recentTopics.length === 0) {
      // Use first few topics from study plan or create general review
      if (currentStudyPlan.subjects.length > 0) {
        const allTopics = currentStudyPlan.subjects.flatMap(s => s.topics.slice(0, 2));
        recentTopics = allTopics.slice(0, 3).map(t => t.name);
      } else {
        // Create a general review based on user's strong areas
        recentTopics = profile?.strong_areas?.slice(0, 3) || ['AP Fundamentals', 'Study Techniques', 'Exam Strategies'];
      }
    }
    
    if (recentTopics.length === 0) {
      recentTopics = ['AP Fundamentals', 'Study Techniques'];
    }
    
    return {
      id: 'review-task',
      type: 'AP Quick Review',
      subject: 'Mixed AP Review',
      topic: 'Recent AP Concepts',
      difficulty: 'Intermediate',
      duration: 25,
      stars: 15,
      description: `Quick review of recently studied AP concepts: ${recentTopics.join(', ')}`,
      aiRecommended: true,
      learningStyle: profile?.learning_style || 'visual',
      prerequisites: [],
      learningObjectives: ['Review and reinforce recent AP learning'],
      resources: [],
      assessments: [],
      reviewTopics: recentTopics,
      isPersonalized: true
    };
  };

  const generatePersonalizedChallenge = () => {
    if (!currentStudyPlan || !currentStudyPlan.subjects || !Array.isArray(currentStudyPlan.subjects)) {
      return null;
    }
    
    // Find advanced topics from AP study plan
    let challengeSubjects = currentStudyPlan.subjects.filter(s => 
      s && s.topics && Array.isArray(s.topics) && 
      s.topics.some(t => t && (t.difficulty === 'Advanced' || t.difficulty === 'Expert'))
    );
    
    // If no advanced topics, create challenges from intermediate topics
    if (challengeSubjects.length === 0) {
      challengeSubjects = currentStudyPlan.subjects.filter(s => 
        s && s.topics && Array.isArray(s.topics) && 
        s.topics.some(t => t && t.difficulty === 'Intermediate')
      );
    }
    
    // If still no subjects, create a general challenge
    if (challengeSubjects.length === 0) {
      const challengeTopics = [
        'Advanced Problem Solving',
        'Complex Analysis',
        'Synthesis and Evaluation',
        'Multi-Step Problems',
        'Critical Thinking'
      ];
      const topic = challengeTopics[Math.floor(Math.random() * challengeTopics.length)];
      
      return {
        id: 'challenge-general',
        type: 'AP Challenge Mode',
        subject: 'AP Advanced Skills',
        topic: topic,
        difficulty: 'Advanced',
        duration: 45,
        stars: 30,
        description: `Challenge yourself with advanced AP skills: ${topic}. Test your mastery!`,
        aiRecommended: true,
        learningStyle: profile?.learning_style || 'visual',
        prerequisites: [],
        learningObjectives: [`Master ${topic.toLowerCase()}`, 'Develop advanced AP skills'],
        resources: [],
        assessments: [],
        isPersonalized: true
      };
    }

    const subject = challengeSubjects[0];
    let advancedTopic = subject.topics && subject.topics.find(t => 
      t.difficulty === 'Advanced' || t.difficulty === 'Expert'
    );
    
    // If no advanced topic, use intermediate and make it challenging
    if (!advancedTopic) {
      advancedTopic = subject.topics && subject.topics.find(t => t && t.difficulty === 'Intermediate');
    }
    
    return {
      id: 'challenge-task',
      type: 'AP Challenge Mode',
      subject: subject.name || 'AP Challenge',
      topic: advancedTopic?.name || 'Advanced AP Problems',
      difficulty: 'Advanced',
      duration: 60,
      stars: 35,
      description: `Challenge yourself with advanced ${subject.name || 'AP'} problems. Test your mastery!`,
      aiRecommended: true,
      learningStyle: profile?.learning_style || 'visual',
      prerequisites: advancedTopic?.prerequisites || [],
      learningObjectives: advancedTopic?.learningObjectives || [`Master advanced ${subject.name}`],
      resources: advancedTopic?.resources || [],
      assessments: advancedTopic?.assessments || [],
      isPersonalized: true
    };
  };

  const handleFocusAreas = () => {
    if (!currentStudyPlan) {
      setError('Please create an AP study plan first to access focus areas.');
      return;
    }
    const focusTask = generatePersonalizedFocusTask();
    if (focusTask) {
      handleTaskStart(focusTask);
    } else {
      setError('No focus areas identified. Complete more sessions to identify weak areas.');
    }
  };

  const handleQuickReview = () => {
    if (!currentStudyPlan) {
      setError('Please create an AP study plan first to access quick review.');
      return;
    }
    const reviewTask = generatePersonalizedQuickReview();
    if (reviewTask) {
      handleTaskStart(reviewTask);
    } else {
      setError('No recent topics to review. Complete some study sessions first.');
    }
  };

  const handleChallenges = () => {
    if (!currentStudyPlan) {
      setError('Please create an AP study plan first to access challenges.');
      return;
    }
    const challengeTask = generatePersonalizedChallenge();
    if (challengeTask) {
      handleTaskStart(challengeTask);
    } else {
      setError('No advanced challenges available yet. Master more basic concepts first.');
    }
  };

  const quickActions = [
    { 
      icon: Brain, 
      label: 'AI AP Study Plan', 
      color: 'from-purple-500 to-pink-500',
      action: () => setShowPlanGenerator(true),
      description: currentStudyPlan ? 'Update your AP study plan' : 'Get a personalized AP study plan powered by AI',
      disabled: false
    },
    { 
      icon: Target, 
      label: 'AP Focus Areas', 
      color: 'from-blue-500 to-cyan-500',
      action: handleFocusAreas,
      description: currentStudyPlan 
        ? `Work on ${currentStudyPlan.subjects.filter(s => s.priority === 'high')[0]?.name || 'your weak AP areas'}`
        : 'Work on your identified weak AP areas',
      disabled: !currentStudyPlan
    },
    { 
      icon: Zap, 
      label: 'AP Quick Review', 
      color: 'from-green-500 to-emerald-500',
      action: handleQuickReview,
      description: currentStudyPlan 
        ? 'Review recently completed AP topics and concepts'
        : 'Review recent AP topics and concepts',
      disabled: !currentStudyPlan
    },
    { 
      icon: Award, 
      label: 'AP Challenges', 
      color: 'from-orange-500 to-red-500',
      action: handleChallenges,
      description: currentStudyPlan 
        ? `Advanced ${currentStudyPlan.subjects.find(s => s.topics.some(t => t.difficulty === 'Advanced'))?.name || 'AP problem'} sets`
        : 'Take on advanced AP problem sets',
      disabled: !currentStudyPlan
    }
  ];

  if (!profile) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="mt-2 text-red-300 hover:text-red-200 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {profile.name}! 🎓
            </h2>
            <p className="text-gray-300">
              {currentStudyPlan 
                ? `Continue with your "${currentStudyPlan.title}" AP study plan`
                : 'Ready to create your personalized AP study plan?'
              }
            </p>
            {currentStudyPlan && (
              <div className="mt-2 flex items-center space-x-4 text-sm">
                <span className="text-purple-400">
                  {currentStudyPlan.subjects.length} AP courses • {currentStudyPlan.duration} days
                </span>
                <span className="text-green-400">
                  {currentStudyPlan.confidence}% confidence
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-400">{profile.level}</div>
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
              disabled={action.disabled}
              className={`group bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 transition-all duration-300 ${
                action.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:border-purple-500/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10'
              }`}
              title={action.disabled ? 'Create an AP study plan first' : action.description}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative`}>
                <Icon className="w-6 h-6 text-white" />
                {action.disabled && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold mb-2">{action.label}</h3>
              <p className="text-gray-400 text-sm">{action.description}</p>
              {action.disabled && (
                <p className="text-yellow-400 text-xs mt-2 flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Create an AP study plan first</span>
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Study Plan Required Notice */}
      {!currentStudyPlan && (
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Create Your AI AP Study Plan</h3>
              <p className="text-gray-300 mb-4">
                Unlock personalized AP study sessions, focus areas, quick reviews, and challenges by creating your AI-powered AP study plan.
              </p>
              <button
                onClick={() => setShowPlanGenerator(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                title="Start Focus Timer"
              >
                <Brain className="w-5 h-5" />
                <span>Get Started</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI-Recommended AP Study Sessions */}
      {studyTasks.length > 0 && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>AI-Recommended AP Study Sessions</span>
              </h3>
              <span className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                Personalized for AP success
              </span>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {studyTasks.map((task) => {
              const isCompleted = completedTasks.has(task.id);
              return (
                <div
                  key={task.id}
                  className={`group rounded-lg p-6 border transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-slate-700/30 border-slate-600/50 hover:border-purple-500/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-purple-400" />
                          )}
                          <span className={`font-semibold ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                            {task.subject}
                          </span>
                        </div>
                        {task.aiRecommended && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                            <Brain className="w-3 h-3" />
                            <span>AI Pick</span>
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.difficulty === 'Beginner' ? 'text-green-400 bg-green-500/10' :
                          task.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-500/10' :
                          task.difficulty === 'Advanced' ? 'text-orange-400 bg-orange-500/10' :
                          'text-red-400 bg-red-500/10'
                        }`}>
                          {task.difficulty}
                        </span>
                        {isCompleted && (
                          <span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      
                      <h4 className={`text-lg font-bold mb-2 ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                        {task.topic}
                      </h4>
                      <p className={`mb-4 ${isCompleted ? 'text-green-200' : 'text-gray-300'}`}>
                        {task.description}
                      </p>
                      
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
                          <Target className="w-4 h-4" />
                          <span>{task.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    {!isCompleted && (
                      <button
                        onClick={() => handleTaskStart(task)}
                        className="ml-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 group-hover:shadow-lg"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Today's AP Focus</h3>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Study Time</span>
              <span className="text-white font-semibold">
                {Math.floor(dailyProgress.studyTime / 60)}h {dailyProgress.studyTime % 60}m / {Math.floor(dailyProgress.targetStudyTime / 60)}h
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((dailyProgress.studyTime / dailyProgress.targetStudyTime) * 100, 100)}%` }} 
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">AP Sessions</span>
              <span className="text-white font-semibold">
                {dailyProgress.lessonsCompleted} / {dailyProgress.targetLessons}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((dailyProgress.lessonsCompleted / dailyProgress.targetLessons) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">AP Streak</h3>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{profile.current_streak}</div>
            <div className="text-gray-400 text-sm">days in a row</div>
            <div className="mt-4 flex justify-center space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < profile.current_streak % 7 ? 'bg-purple-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Next AP Milestone</h3>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3">
            <div className="text-white font-medium">Level {profile.level + 1}</div>
            <div className="text-gray-400 text-sm">
              {100 - (profile.total_stars % 100)} more stars needed
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${(profile.total_stars % 100)}%` }} 
              />
            </div>
            <div className="text-yellow-400 text-sm">
              {profile.total_stars % 100} / 100 stars
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPlanGenerator && (
        <StudyPlanGenerator
          onClose={() => setShowPlanGenerator(false)}
          onPlanGenerated={(plan) => {
            setCurrentStudyPlan(plan);
            setShowPlanGenerator(false);
            // Refresh the page data
            fetchActiveStudyPlan();
          }}
        />
      )}

      {showStudySession && activeTask && (
        <InteractiveStudySession
          task={activeTask}
          onClose={() => setShowStudySession(false)}
          onComplete={handleSessionComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;