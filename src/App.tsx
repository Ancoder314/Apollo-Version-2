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
  LogOut
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Progress from './components/Progress';
import Constellations from './components/Constellations';
import Profile from './components/Profile';
import PomodoroTimer from './components/PomodoroTimer';
import Auth from './components/Auth';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTimer, setShowTimer] = useState(false);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Apollo AP Prep</h1>
          <p className="text-gray-300">Loading your AP preparation journey...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!user || !profile) {
    return <Auth />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Star },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setShowTimer={setShowTimer} />;
      case 'progress':
        return <Progress userData={profile} />;
      case 'achievements':
        return <Constellations userData={profile} />;
      case 'profile':
        return <Profile userData={profile} setUserData={() => {}} />;
      default:
        return <Dashboard setShowTimer={setShowTimer} />;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Apollo AP Prep</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Target className="w-4 h-4" />
                  <span>{profile.current_streak} day streak</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{profile.total_stars} stars</span>
                </div>
                <button
                  onClick={() => setShowTimer(!showTimer)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                >
                  <Timer className="w-4 h-4" />
                  <span>Focus</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar Navigation */}
          <nav className="w-64 bg-slate-800/60 backdrop-blur-sm h-screen sticky top-0 border-r border-slate-700/50">
            <div className="p-6">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                        activeTab === item.id
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 transform transition-all duration-200 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Level</span>
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">{profile.level}</p>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 transform transition-all duration-200 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Stars Collected</span>
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">{profile.total_stars}</p>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-4 transform transition-all duration-200 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Study Time</span>
                    <Timer className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">{Math.floor(profile.study_time / 60)}h</p>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="transition-all duration-300 ease-in-out">
              {renderContent()}
            </div>
          </main>
        </div>

        {/* Pomodoro Timer Modal */}
        {showTimer && (
          <PomodoroTimer onClose={() => setShowTimer(false)} />
        )}
      </div>
    </div>
  );
}

export default App;