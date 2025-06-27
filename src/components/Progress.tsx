import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  Star, 
  Award,
  BarChart3,
  Activity
} from 'lucide-react';

interface ProgressProps {
  userData: any;
}

const Progress: React.FC<ProgressProps> = ({ userData }) => {
  const weeklyData = [
    { day: 'Mon', hours: 2.5, stars: 18 },
    { day: 'Tue', hours: 3.2, stars: 24 },
    { day: 'Wed', hours: 1.8, stars: 15 },
    { day: 'Thu', hours: 4.1, stars: 32 },
    { day: 'Fri', hours: 2.9, stars: 21 },
    { day: 'Sat', hours: 3.7, stars: 28 },
    { day: 'Sun', hours: 2.3, stars: 19 }
  ];

  const subjectProgress = [
    { subject: 'Mathematics', progress: 78, change: +12, color: 'from-blue-500 to-blue-600' },
    { subject: 'Physics', progress: 89, change: +5, color: 'from-green-500 to-green-600' },
    { subject: 'Chemistry', progress: 65, change: +18, color: 'from-purple-500 to-purple-600' },
    { subject: 'Literature', progress: 92, change: +3, color: 'from-pink-500 to-pink-600' },
    { subject: 'History', progress: 71, change: +8, color: 'from-yellow-500 to-yellow-600' }
  ];

  const achievements = [
    { title: 'Study Streak Master', description: '15 day streak', icon: TrendingUp, color: 'text-green-400' },
    { title: 'Night Owl', description: 'Studied past midnight 5 times', icon: Clock, color: 'text-purple-400' },
    { title: 'Star Collector', description: 'Earned 200+ stars', icon: Star, color: 'text-yellow-400' },
    { title: 'Subject Explorer', description: 'Completed lessons in 5 subjects', icon: Award, color: 'text-blue-400' }
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));
  const maxStars = Math.max(...weeklyData.map(d => d.stars));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">Progress Analytics</h2>
        <p className="text-gray-300">Track your learning journey and celebrate your achievements</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Study Time</h3>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{Math.floor(userData.studyTime / 60)}<span className="text-lg text-gray-400">h</span></p>
          <p className="text-blue-400 text-sm">+12h this week</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Stars Collected</h3>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">{userData.totalStars}</p>
          <p className="text-yellow-400 text-sm">+45 this week</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Lessons Completed</h3>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{userData.completedLessons}</p>
          <p className="text-green-400 text-sm">+8 this week</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Current Streak</h3>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{userData.currentStreak}<span className="text-lg text-gray-400">d</span></p>
          <p className="text-purple-400 text-sm">Personal best!</p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Weekly Activity</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="mb-2">
                  <div className="h-32 flex flex-col justify-end">
                    <div 
                      className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t mb-1"
                      style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: '4px' }}
                    />
                    <div 
                      className="bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t"
                      style={{ height: `${(day.stars / maxStars) * 60}%`, minHeight: '4px' }}
                    />
                  </div>
                </div>
                <p className="text-gray-400 text-sm font-medium">{day.day}</p>
                <p className="text-white text-sm">{day.hours}h</p>
                <p className="text-yellow-400 text-xs">{day.stars}★</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-gray-400">Study Hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-400">Stars Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Subject Progress</span>
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {subjectProgress.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{subject.subject}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold">{subject.progress}%</span>
                  <span className={`text-sm ${subject.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {subject.change > 0 ? '+' : ''}{subject.change}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r ${subject.color} h-3 rounded-full transition-all duration-1000`}
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Recent Achievements</span>
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className={`w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center ${achievement.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{achievement.title}</h4>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Progress;