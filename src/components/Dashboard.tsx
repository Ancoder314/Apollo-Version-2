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
  MessageSquare,
  Plus
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
    }
  }, [profile]);

  useEffect(() => {
    if (currentStudyPlan) {
      generateAIRecommendedTasks();
    }
  }, [currentStudyPlan]);

  const fetchActiveStudyPlan = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching study plan:', error);
        return;
      }

      if (data && data.length > 0) {
        const planData = data[0];
        setCurrentStudyPlan({
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
        });
      }
    } catch (error) {
      console.error('Error fetching study plan:', error);
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
    }
  };

  const generateAIRecommendedTasks = () => {
    if (!currentStudyPlan || !profile) return;

    const tasks: any[] = [];
    
    // Generate tasks based on study plan subjects
    currentStudyPlan.subjects.forEach((subject, index) => {
      subject.topics.forEach((topic, topicIndex) => {
        if (tasks.length < 6) { // Limit to 6 tasks
          tasks.push({
            id: `${index}-${topicIndex}`,
            type: getTaskType(subject.name, topic.difficulty),
            subject: subject.name,
            topic: topic.name,
            difficulty: topic.difficulty,
            duration: topic.estimatedTime,
            stars: calculateStars(topic.difficulty),
            description: `Master ${topic.name} with ${getTaskType(subject.name, topic.difficulty).toLowerCase()}`,
            aiRecommended: subject.priority === 'high',
            learningStyle: profile.learning_style || 'visual',
            prerequisites: topic.prerequisites || [],
            learningObjectives: topic.learningObjectives || [],
            resources: topic.resources || [],
            assessments: topic.assessments || []
          });
        }
      });
    });

    setStudyTasks(tasks);
  };

  const getTaskType = (subject: string, difficulty: string) => {
    const types = {
      'Mathematics': ['Adaptive Practice', 'Problem Solving', 'Concept Mastery'],
      'Physics': ['Interactive Simulation', 'Lab Experiment', 'Theory Application'],
      'Chemistry': ['Visual Learning + 3D Modeling', 'Reaction Mechanisms', 'Lab Practice'],
      'Biology': ['Interactive Diagrams', 'Case Studies', 'Lab Analysis'],
      'Computer Science': ['Coding Practice', 'Algorithm Design', 'Project Building'],
      'default': ['Adaptive Practice', 'Interactive Learning', 'Concept Review']
    };
    
    const subjectTypes = types[subject as keyof typeof types] || types.default;
    return subjectTypes[Math.floor(Math.random() * subjectTypes.length)];
  };

  const calculateStars = (difficulty: string) => {
    const starMap = {
      'Beginner': 8,
      'Intermediate': 12,
      'Advanced': 18,
      'Expert': 25
    };
    return starMap[difficulty as keyof typeof starMap] || 10;
  };

  const handleTaskStart = (task: any) => {
    setActiveTask(task);
    setShowStudySession(true);
  };

  const handleSessionComplete = async (earnedStars: number, performance: any) => {
    if (!profile || !activeTask) return;

    try {
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

  const quickActions = [
    { 
      icon: Brain, 
      label: 'AI Study Plan', 
      color: 'from-purple-500 to-pink-500',
      action: () => setShowPlanGenerator(true),
      description: currentStudyPlan ? 'Update your study plan' : 'Get a personalized study plan powered by AI'
    },
    { 
      icon: Target, 
      label: 'Focus Areas', 
      color: 'from-blue-500 to-cyan-500',
      action: () => handleFocusAreas(),
      description: 'Work on your identified weak areas',
      disabled: !currentStudyPlan
    },
    { 
      icon: Zap, 
      label: 'Quick Review', 
      color: 'from-green-500 to-emerald-500',
      action: () => handleQuickReview(),
      description: 'Review recent topics and concepts',
      disabled: !currentStudyPlan
    },
    { 
      icon: Award, 
      label: 'Challenges', 
      color: 'from-orange-500 to-red-500',
      action: () => handleChallenges(),
      description: 'Take on advanced problem sets',
      disabled: !currentStudyPlan
    }
  ];

  const handleFocusAreas = () => {
    if (!currentStudyPlan) return;
    
    // Find high priority subjects (weak areas)
    const focusSubjects = currentStudyPlan.subjects.filter(s => s.priority === 'high');
    if (focusSubjects.length > 0) {
      const subject = focusSubjects[0];
      const topic = subject.topics[0];
      
      const focusTask = {
        id: 'focus-task',
        type: 'Focus Session',
        subject: subject.name,
        topic: topic?.name || 'Foundation Review',
        difficulty: 'Adaptive',
        duration: 45,
        stars: 20,
        description: `Targeted practice for your weak area: ${subject.name}`,
        aiRecommended: true,
        learningStyle: profile?.learning_style || 'visual',
        prerequisites: topic?.prerequisites || [],
        learningObjectives: topic?.learningObjectives || [`Master ${subject.name} fundamentals`],
        resources: topic?.resources || [],
        assessments: topic?.assessments || []
      };
      handleTaskStart(focusTask);
    }
  };

  const handleQuickReview = () => {
    if (!currentStudyPlan) return;
    
    // Get recently studied topics
    const allTopics = currentStudyPlan.subjects.flatMap(s => s.topics);
    const reviewTopics = allTopics.slice(0, 3); // Last 3 topics
    
    const reviewTask = {
      id: 'review-task',
      type: 'Quick Review',
      subject: 'Mixed Review',
      topic: 'Recent Concepts',
      difficulty: 'Intermediate',
      duration: 20,
      stars: 10,
      description: 'Quick review of recently studied concepts',
      aiRecommended: true,
      learningStyle: profile?.learning_style || 'visual',
      prerequisites: [],
      learningObjectives: ['Review and reinforce recent learning'],
      resources: [],
      assessments: [],
      reviewTopics: reviewTopics.map(t => t.name)
    };
    handleTaskStart(reviewTask);
  };

  const handleChallenges = () => {
    if (!currentStudyPlan) return;
    
    // Find advanced topics
    const challengeSubjects = currentStudyPlan.subjects.filter(s => 
      s.topics.some(t => t.difficulty === 'Advanced' || t.difficulty === 'Expert')
    );
    
    if (challengeSubjects.length > 0) {
      const subject = challengeSubjects[0];
      const advancedTopic = subject.topics.find(t => 
        t.difficulty === 'Advanced' || t.difficulty === 'Expert'
      );
      
      const challengeTask = {
        id: 'challenge-task',
        type: 'Challenge Mode',
        subject: subject.name,
        topic: advancedTopic?.name || 'Advanced Problems',
        difficulty: 'Expert',
        duration: 60,
        stars: 30,
        description: `Challenge yourself with advanced ${subject.name} problems`,
        aiRecommended: true,
        learningStyle: profile?.learning_style || 'visual',
        prerequisites: advancedTopic?.prerequisites || [],
        learningObjectives: advancedTopic?.learningObjectives || [`Master advanced ${subject.name}`],
        resources: advancedTopic?.resources || [],
        assessments: advancedTopic?.assessments || []
      };
      handleTaskStart(challengeTask);
    }
  };

  if (!profile) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {profile.name}! 🚀
            </h2>
            <p className="text-gray-300">
              {currentStudyPlan 
                ? `Continue with your "${currentStudyPlan.title}" study plan`
                : 'Ready to create your personalized AI study plan?'
              }
            </p>
            {currentStudyPlan && (
              <div className="mt-2 flex items-center space-x-4 text-sm">
                <span className="text-purple-400">
                  {currentStudyPlan.subjects.length} subjects • {currentStudyPlan.duration} days
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
              className={`group bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{action.label}</h3>
              <p className="text-gray-400 text-sm">{action.description}</p>
              {action.disabled && (
                <p className="text-yellow-400 text-xs mt-2">Create a study plan first</p>
              )}
            </button>
          );
        })}
      </div>

      {/* AI-Recommended Study Sessions */}
      {studyTasks.length > 0 && (
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
            {studyTasks.map((task) => (
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
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.difficulty === 'Beginner' ? 'text-green-400 bg-green-500/10' :
                        task.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-500/10' :
                        task.difficulty === 'Advanced' ? 'text-orange-400 bg-orange-500/10' :
                        'text-red-400 bg-red-500/10'
                      }`}>
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
                        <Target className="w-4 h-4" />
                        <span>{task.type}</span>
                      </div>
                    </div>
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
            ))}
          </div>
        </div>
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
              <span className="text-gray-300">Lessons</span>
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
            <h3 className="text-lg font-semibold text-white">Weekly Streak</h3>
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
            <h3 className="text-lg font-semibold text-white">Next Milestone</h3>
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