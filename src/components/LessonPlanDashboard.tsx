import React, { useState, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  Clock, 
  Star, 
  Target, 
  TrendingUp, 
  Brain,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Award,
  Calendar,
  Play,
  BookOpen,
  Eye,
  Activity,
  PieChart,
  Users,
  Timer,
  Lightbulb,
  Settings,
  Filter,
  Search,
  RefreshCw,
  Shuffle,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  MessageSquare,
  FileText,
  Video,
  Headphones,
  PenTool,
  Globe,
  Database,
  Cpu,
  Layers,
  GitBranch,
  Compass,
  Map,
  Route
} from 'lucide-react';

interface LessonPlanDashboardProps {
  plan: any[];
  userData: any;
  analysisData: any;
  performanceHistory?: any[];
  adaptiveInsights?: any;
  onClose: () => void;
  onStartSession: (task: any) => void;
}

const LessonPlanDashboard: React.FC<LessonPlanDashboardProps> = ({ 
  plan, 
  userData, 
  analysisData, 
  performanceHistory = [],
  adaptiveInsights,
  onClose, 
  onStartSession 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedStats, setAnimatedStats] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedStats(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const completedTasks = plan.filter(task => task.completed).length;
  const totalTasks = plan.length;
  const totalStars = plan.reduce((sum, task) => sum + task.stars, 0);
  const earnedStars = plan.filter(task => task.completed).reduce((sum, task) => sum + task.stars, 0);
  const totalDuration = plan.reduce((sum, task) => sum + task.duration, 0);
  const completedDuration = plan.filter(task => task.completed).reduce((sum, task) => sum + task.duration, 0);

  const subjectBreakdown = plan.reduce((acc, task) => {
    acc[task.subject] = (acc[task.subject] || 0) + 1;
    return acc;
  }, {} as {[key: string]: number});

  const difficultyBreakdown = plan.reduce((acc, task) => {
    acc[task.difficulty] = (acc[task.difficulty] || 0) + 1;
    return acc;
  }, {} as {[key: string]: number});

  const averageConfidence = plan.reduce((sum, task) => sum + task.confidence, 0) / plan.length;

  // Enhanced analytics calculations
  const learningVelocity = performanceHistory.length > 1 ? 
    (performanceHistory[performanceHistory.length - 1]?.confidence || 0) - 
    (performanceHistory[0]?.confidence || 0) : 0;

  const adaptationRate = adaptiveInsights?.learningEfficiency || 0;
  const retentionScore = analysisData?.retentionPatterns?.longTerm || 0;
  const engagementTrend = Math.random() * 20 + 75; // Mock data

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-green-600';
    if (progress >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ArrowUp className="w-4 h-4 text-green-400" />;
      case 'declining': return <ArrowDown className="w-4 h-4 text-red-400" />;
      case 'stable': return <Minus className="w-4 h-4 text-yellow-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
    { id: 'analytics', label: 'Deep Analytics', icon: Brain },
    { id: 'adaptive', label: 'AI Insights', icon: Cpu },
    { id: 'schedule', label: 'Smart Schedule', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: Activity }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Completion Rate', 
            value: `${Math.round((completedTasks / totalTasks) * 100)}%`, 
            icon: Target, 
            color: 'green',
            progress: (completedTasks / totalTasks) * 100,
            trend: '+12%',
            description: 'vs last week'
          },
          { 
            label: 'Learning Velocity', 
            value: `${learningVelocity > 0 ? '+' : ''}${learningVelocity.toFixed(1)}%`, 
            icon: TrendingUp, 
            color: learningVelocity > 0 ? 'green' : 'red',
            progress: Math.abs(learningVelocity),
            trend: 'accelerating',
            description: 'knowledge gain rate'
          },
          { 
            label: 'Retention Score', 
            value: `${retentionScore}%`, 
            icon: Brain, 
            color: 'purple',
            progress: retentionScore,
            trend: '+5%',
            description: 'long-term retention'
          },
          { 
            label: 'AI Adaptation', 
            value: `${adaptationRate}%`, 
            icon: Cpu, 
            color: 'blue',
            progress: adaptationRate,
            trend: 'optimizing',
            description: 'system efficiency'
          }
        ].map((metric, index) => (
          <div 
            key={index}
            className="bg-slate-700/50 rounded-lg p-4 transform transition-all duration-500 hover:scale-105 border border-slate-600/30 hover:border-purple-500/50"
            style={{ 
              animationDelay: `${index * 100}ms`,
              transform: animatedStats ? 'scale(1)' : 'scale(0.9)',
              opacity: animatedStats ? 1 : 0
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">{metric.label}</span>
              <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs text-${metric.color}-400`}>{metric.trend}</span>
              <span className="text-xs text-gray-500">{metric.description}</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${getProgressColor(metric.progress)} h-2 rounded-full transition-all duration-1000`}
                style={{ width: animatedStats ? `${metric.progress}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Learning Path Visualization */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Route className="w-5 h-5 text-blue-400" />
          <span>Adaptive Learning Path</span>
        </h3>
        <div className="relative">
          <div className="flex items-center space-x-4 overflow-x-auto pb-4">
            {plan.map((task, index) => (
              <div key={task.id} className="flex items-center space-x-2 min-w-max">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  task.completed 
                    ? 'bg-green-500 border-green-400 scale-110' 
                    : index === 0 
                      ? 'bg-purple-600 border-purple-400 animate-pulse' 
                      : 'bg-slate-600 border-slate-500'
                }`}>
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  )}
                </div>
                {index < plan.length - 1 && (
                  <div className={`w-8 h-1 rounded transition-all duration-500 ${
                    task.completed ? 'bg-green-400' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Completed ({completedTasks})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Current Focus</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
              <span className="text-gray-300">Upcoming ({totalTasks - completedTasks - 1})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Subject & Difficulty Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-blue-400" />
            <span>Subject Distribution & Performance</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(subjectBreakdown).map(([subject, count], index) => {
              const performance = Math.random() * 30 + 60; // Mock performance data
              return (
                <div key={subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{subject}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{count} tasks</span>
                      <span className={`text-sm ${performance > 75 ? 'text-green-400' : performance > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {Math.round(performance)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: animatedStats ? `${(count / totalTasks) * 100}%` : '0%',
                        transitionDelay: `${index * 200}ms`
                      }}
                    />
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-1000 ${
                        performance > 75 ? 'bg-green-400' : performance > 60 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ 
                        width: animatedStats ? `${performance}%` : '0%',
                        transitionDelay: `${index * 200 + 500}ms`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-red-400" />
            <span>Difficulty Analysis & Readiness</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(difficultyBreakdown).map(([difficulty, count], index) => {
              const colors = {
                Easy: 'from-green-500 to-green-600',
                Medium: 'from-yellow-500 to-yellow-600',
                Hard: 'from-red-500 to-red-600',
                'Very Hard': 'from-purple-500 to-purple-600'
              };
              const readiness = Math.random() * 40 + 60; // Mock readiness score
              return (
                <div key={difficulty} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{difficulty}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{count} tasks</span>
                      <span className={`text-sm ${readiness > 75 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {Math.round(readiness)}% ready
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${colors[difficulty as keyof typeof colors]} h-2 rounded-full transition-all duration-1000`}
                      style={{ 
                        width: animatedStats ? `${(count / totalTasks) * 100}%` : '0%',
                        transitionDelay: `${index * 200}ms`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Recommendations Panel */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <span>AI-Powered Recommendations</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Optimize Study Schedule',
              description: 'Your peak performance is 2-4 PM. Schedule difficult topics then.',
              impact: 'High',
              effort: 'Low',
              icon: Calendar,
              color: 'blue'
            },
            {
              title: 'Increase Visual Content',
              description: 'Add 20% more visual elements to boost comprehension by 15%.',
              impact: 'Medium',
              effort: 'Medium',
              icon: Eye,
              color: 'green'
            },
            {
              title: 'Practice Spaced Repetition',
              description: 'Review completed topics every 3 days to improve retention.',
              impact: 'High',
              effort: 'Low',
              icon: RefreshCw,
              color: 'purple'
            }
          ].map((rec, index) => (
            <div key={index} className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/30 hover:border-purple-500/50 transition-all duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <rec.icon className={`w-5 h-5 text-${rec.color}-400`} />
                <h4 className="text-white font-semibold text-sm">{rec.title}</h4>
              </div>
              <p className="text-gray-300 text-xs mb-3">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${
                  rec.impact === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {rec.impact} Impact
                </span>
                <span className="text-xs text-gray-400">{rec.effort} Effort</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Progress Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="very hard">Very Hard</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="priority">Sort by Priority</option>
            <option value="difficulty">Sort by Difficulty</option>
            <option value="confidence">Sort by Confidence</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600' : 'bg-slate-600'}`}
          >
            <BarChart3 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600' : 'bg-slate-600'}`}
          >
            <FileText className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Enhanced Progress Timeline */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-400" />
          <span>Detailed Learning Progress</span>
        </h3>
        <div className="space-y-4">
          {plan.map((task, index) => (
            <div key={task.id} className="relative">
              {/* Progress Line */}
              {index < plan.length - 1 && (
                <div className="absolute left-4 top-12 w-0.5 h-16 bg-slate-600"></div>
              )}
              
              <div className="flex items-start space-x-4 p-4 bg-slate-600/30 rounded-lg border border-slate-500/30 hover:border-purple-500/50 transition-all duration-200">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  task.completed ? 'bg-green-500' : index === 0 ? 'bg-purple-600 animate-pulse' : 'bg-slate-500'
                }`}>
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{task.subject}</h4>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon('improving')}
                      <span className="text-sm text-green-400">+12%</span>
                    </div>
                  </div>
                  <p className="text-purple-400 text-sm font-medium mb-1">{task.topic}</p>
                  <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-white font-semibold">{task.duration}min</div>
                      <div className="text-gray-400 text-xs">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${
                        task.confidence >= 80 ? 'text-green-400' : 
                        task.confidence >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{task.confidence}%</div>
                      <div className="text-gray-400 text-xs">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-semibold">{task.stars}</div>
                      <div className="text-gray-400 text-xs">Stars</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-semibold">{task.estimatedMastery}%</div>
                      <div className="text-gray-400 text-xs">Est. Mastery</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        task.completed ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: task.completed ? '100%' : '0%' }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {!task.completed && (
                      <button
                        onClick={() => onStartSession(task)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start</span>
                      </button>
                    )}
                    <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm transition-colors">
                      Details
                    </button>
                    {task.completed && (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Advanced Learning Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Cognitive Analysis</span>
          </h3>
          {analysisData?.cognitiveLoad && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Processing Speed</span>
                  <span className="text-white font-semibold">{analysisData.cognitiveLoad.processingSpeed}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: animatedStats ? `${analysisData.cognitiveLoad.processingSpeed}%` : '0%' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Memory Utilization</span>
                  <span className="text-white font-semibold">{analysisData.cognitiveLoad.memoryUtilization}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: animatedStats ? `${analysisData.cognitiveLoad.memoryUtilization}%` : '0%' }}
                  />
                </div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                <div className="text-purple-400 font-semibold text-sm">Cognitive Load</div>
                <div className="text-white text-lg font-bold">{analysisData.cognitiveLoad.currentLoad}%</div>
                <div className="text-purple-300 text-xs">Optimal: {analysisData.cognitiveLoad.optimalLoad}%</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>Performance Trends</span>
          </h3>
          <div className="space-y-4">
            {analysisData?.subjectPerformance?.slice(0, 3).map((subject: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{subject.subject}</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(subject.trend)}
                    <span className={`text-sm ${
                      subject.trend === 'improving' ? 'text-green-400' : 
                      subject.trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {subject.improvementRate > 0 ? '+' : ''}{subject.improvementRate}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      subject.trend === 'improving' ? 'bg-green-500' : 
                      subject.trend === 'declining' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: animatedStats ? `${subject.masteryLevel}%` : '0%' }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  Mastery: {subject.masteryLevel}% • Next: {subject.nextMilestone}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Timer className="w-5 h-5 text-blue-400" />
            <span>Time Analytics</span>
          </h3>
          {analysisData?.timePatterns && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <div className="text-blue-400 font-semibold text-sm">Peak Performance</div>
                <div className="text-white font-bold">{analysisData.timePatterns.peakHours[0]}</div>
                <div className="text-blue-300 text-xs">Productivity Score: {analysisData.timePatterns.productivityScore}%</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Session Consistency</span>
                  <span className="text-white font-semibold">{analysisData.timePatterns.consistency}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: animatedStats ? `${analysisData.timePatterns.consistency}%` : '0%' }}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Avg Session: {analysisData.timePatterns.averageSession}min • 
                Focus Decline: {analysisData.timePatterns.focusDecline}min
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Learning Style Effectiveness */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Eye className="w-5 h-5 text-purple-400" />
          <span>Learning Style Effectiveness Analysis</span>
        </h3>
        {analysisData?.learningStyle && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Style Performance</h4>
              <div className="space-y-3">
                {Object.entries(analysisData.learningStyle.scores).map(([style, score]) => (
                  <div key={style} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">{style}</span>
                      <span className="text-white font-semibold">{score}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          style === analysisData.learningStyle.primary ? 'bg-purple-500' : 'bg-gray-500'
                        }`}
                        style={{ width: animatedStats ? `${score}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Adaptation Metrics</h4>
              <div className="space-y-3">
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/20">
                  <div className="text-purple-400 font-semibold text-sm">Primary Style</div>
                  <div className="text-white text-lg font-bold">{analysisData.learningStyle.primary}</div>
                  <div className="text-purple-300 text-xs">Effectiveness: {analysisData.learningStyle.effectiveness}%</div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                  <div className="text-blue-400 font-semibold text-sm">Adaptation Rate</div>
                  <div className="text-white text-lg font-bold">{analysisData.learningStyle.adaptationRate}%</div>
                  <div className="text-blue-300 text-xs">System learning speed</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdaptive = () => (
    <div className="space-y-6">
      {/* AI Adaptation Status */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Cpu className="w-6 h-6 text-purple-400" />
          <span>AI Adaptation Engine Status</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">{adaptiveInsights?.learningEfficiency || 85}%</div>
            <div className="text-gray-300 text-sm">Learning Efficiency</div>
            <div className="text-purple-300 text-xs mt-1">+12% this week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{adaptiveInsights?.confidenceBoost || 15}%</div>
            <div className="text-gray-300 text-sm">Confidence Boost</div>
            <div className="text-blue-300 text-xs mt-1">Predicted gain</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {adaptiveInsights?.adaptationNeeded ? 'Active' : 'Stable'}
            </div>
            <div className="text-gray-300 text-sm">Adaptation Status</div>
            <div className="text-green-300 text-xs mt-1">Real-time optimization</div>
          </div>
        </div>
      </div>

      {/* Adaptive Adjustments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>Current Adaptations</span>
          </h3>
          <div className="space-y-3">
            {adaptiveInsights?.recommendedAdjustments?.map((adjustment: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm">{adjustment}</span>
              </div>
            )) || [
              'Increase visual content by 20%',
              'Add more interactive elements',
              'Reduce session length by 10 minutes'
            ].map((adjustment, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm">{adjustment}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>Optimization Targets</span>
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Retention Rate</span>
                <span className="text-green-400 font-semibold">Target: 90%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: '82%' }} />
              </div>
              <div className="text-xs text-gray-400">Current: 82% • Gap: 8%</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Engagement Score</span>
                <span className="text-yellow-400 font-semibold">Target: 95%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: '88%' }} />
              </div>
              <div className="text-xs text-gray-400">Current: 88% • Gap: 7%</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Mastery Speed</span>
                <span className="text-purple-400 font-semibold">Target: 85%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: '91%' }} />
              </div>
              <div className="text-xs text-gray-400">Current: 91% • Exceeded by 6%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Optimization */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Compass className="w-5 h-5 text-yellow-400" />
          <span>Next Optimization Phase</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-500/10 rounded border border-yellow-500/20">
            <h4 className="text-yellow-400 font-semibold mb-2">Focus Area</h4>
            <p className="text-white font-bold">{adaptiveInsights?.nextOptimization || 'Kinesthetic Learning'}</p>
            <p className="text-yellow-300 text-sm mt-1">Predicted 15% improvement</p>
          </div>
          <div className="p-4 bg-blue-500/10 rounded border border-blue-500/20">
            <h4 className="text-blue-400 font-semibold mb-2">Timeline</h4>
            <p className="text-white font-bold">2-3 Sessions</p>
            <p className="text-blue-300 text-sm mt-1">Implementation period</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded border border-green-500/20">
            <h4 className="text-green-400 font-semibold mb-2">Expected Impact</h4>
            <p className="text-white font-bold">High Confidence</p>
            <p className="text-green-300 text-sm mt-1">Based on your profile</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      {/* Smart Schedule Overview */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span>AI-Optimized Study Schedule</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="bg-slate-600/30 rounded-lg p-3 border border-slate-500/30">
              <h4 className="text-white font-semibold mb-2 text-center">{day}</h4>
              <div className="space-y-2">
                {plan.slice(index, index + 2).map((task, taskIndex) => (
                  <div key={task.id} className="bg-purple-500/20 rounded p-2 text-xs border border-purple-500/30">
                    <p className="text-white font-medium">{task.subject}</p>
                    <p className="text-purple-300">{task.duration}min</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`px-1 py-0.5 rounded text-xs ${
                        task.difficulty === 'Hard' ? 'bg-red-500/20 text-red-300' :
                        task.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {task.difficulty}
                      </span>
                      <span className="text-yellow-400">{task.stars}★</span>
                    </div>
                  </div>
                ))}
                {index === 0 && (
                  <div className="bg-blue-500/20 rounded p-2 text-xs border border-blue-500/30">
                    <p className="text-blue-300 font-medium">Peak Hours</p>
                    <p className="text-blue-200">2:00-4:00 PM</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Management Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Timer className="w-5 h-5 text-green-400" />
            <span>Optimal Timing</span>
          </h3>
          {analysisData?.timePatterns && (
            <div className="space-y-4">
              <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                <h4 className="text-green-400 font-semibold mb-2">Peak Performance Windows</h4>
                <div className="space-y-1">
                  {analysisData.timePatterns.peakHours.map((hour: string, index: number) => (
                    <div key={index} className="text-white text-sm">{hour}</div>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <h4 className="text-blue-400 font-semibold mb-2">Session Optimization</h4>
                <div className="text-white text-sm">
                  <div>Optimal Length: {analysisData.timePatterns.averageSession} min</div>
                  <div>Break Frequency: Every {analysisData.timePatterns.optimalBreaks} min</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span>Weekly Distribution</span>
          </h3>
          <div className="space-y-3">
            {['Mathematics', 'Physics', 'Chemistry'].map((subject, index) => (
              <div key={subject} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{subject}</span>
                  <span className="text-white text-sm">{3 + index}h/week</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(3 + index) * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span>Schedule Alerts</span>
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
              <div className="text-yellow-400 font-semibold text-sm">Overload Warning</div>
              <div className="text-yellow-300 text-xs">Thursday: 4.5h scheduled</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20">
              <div className="text-blue-400 font-semibold text-sm">Optimization Tip</div>
              <div className="text-blue-300 text-xs">Move hard topics to peak hours</div>
            </div>
            <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
              <div className="text-green-400 font-semibold text-sm">Perfect Balance</div>
              <div className="text-green-300 text-xs">Weekend schedule optimized</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Score', value: '87%', change: '+5%', color: 'green', icon: Award },
          { label: 'Learning Speed', value: '2.3x', change: '+0.4x', color: 'blue', icon: Zap },
          { label: 'Retention Rate', value: '89%', change: '+7%', color: 'purple', icon: Brain },
          { label: 'Consistency', value: '94%', change: '+2%', color: 'yellow', icon: Target }
        ].map((metric, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">{metric.label}</span>
              <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
            </div>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            <div className={`text-sm text-${metric.color}-400`}>{metric.change} this week</div>
          </div>
        ))}
      </div>

      {/* Performance History Chart */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>Performance History</span>
        </h3>
        <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Performance chart would be rendered here</span>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4">Subject Performance</h3>
          <div className="space-y-4">
            {plan.slice(0, 4).map((task, index) => (
              <div key={task.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{task.subject}</span>
                  <span className="text-white font-semibold">{task.confidence}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      task.confidence >= 80 ? 'bg-green-500' : 
                      task.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${task.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/30">
          <h3 className="text-lg font-bold text-white mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {[
              { title: 'Mastery Milestone', desc: 'Achieved 90% in Physics', icon: Award, color: 'yellow' },
              { title: 'Speed Improvement', desc: '25% faster problem solving', icon: Zap, color: 'blue' },
              { title: 'Consistency Streak', desc: '14 days of perfect attendance', icon: Target, color: 'green' },
              { title: 'Difficulty Upgrade', desc: 'Ready for advanced topics', icon: TrendingUp, color: 'purple' }
            ].map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-600/30 rounded border border-slate-500/30">
                <achievement.icon className={`w-5 h-5 text-${achievement.color}-400`} />
                <div>
                  <div className="text-white font-semibold text-sm">{achievement.title}</div>
                  <div className="text-gray-400 text-xs">{achievement.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'progress': return renderProgress();
      case 'analytics': return renderAnalytics();
      case 'adaptive': return renderAdaptive();
      case 'schedule': return renderSchedule();
      case 'performance': return renderPerformance();
      default: return renderOverview();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Advanced Study Plan Dashboard</h2>
              <p className="text-gray-300">Comprehensive AI-powered analysis and optimization</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="border-b border-slate-700/50 bg-slate-800/30">
          <nav className="flex space-x-1 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-slate-700/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LessonPlanDashboard;