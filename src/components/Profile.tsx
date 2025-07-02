import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Palette, 
  Clock, 
  Target,
  Star,
  Award,
  Edit3,
  Save,
  X
} from 'lucide-react';

interface ProfileProps {
  userData: any;
  setUserData: (data: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ userData, setUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);

  const studyPreferences = [
    { label: 'Visual Learning', enabled: true },
    { label: 'Practice Problems', enabled: true },
    { label: 'Video Content', enabled: true },
    { label: 'Interactive Simulations', enabled: false },
    { label: 'Group Study Sessions', enabled: false }
  ];

  const notifications = [
    { label: 'Daily Study Reminders', enabled: true },
    { label: 'Achievement Notifications', enabled: true },
    { label: 'Weekly Progress Reports', enabled: true },
    { label: 'New Content Alerts', enabled: false }
  ];

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-purple-400">Level {userData.level}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{userData.currentStreak} day streak</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
            <div className="p-6 border-b border-slate-700/50">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-white">{userData.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Learning Goals</label>
                {isEditing ? (
                  <textarea
                    value={editedData.goals || "Master advanced mathematics and physics concepts"}
                    onChange={(e) => setEditedData({...editedData, goals: e.target.value})}
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-white">{userData.goals || "Master advanced mathematics and physics concepts"}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Study Preferences */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
            <div className="p-6 border-b border-slate-700/50">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Study Preferences</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {studyPreferences.map((pref, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-white">{pref.label}</span>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      pref.enabled ? 'bg-purple-600' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        pref.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50">
            <div className="p-6 border-b border-slate-700/50">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {notifications.map((notif, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-white">{notif.label}</span>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notif.enabled ? 'bg-green-600' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notif.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats & Achievements */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Total Study Time</span>
                </div>
                <span className="text-white font-semibold">{Math.floor(userData.studyTime / 60)}h</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Lessons Completed</span>
                </div>
                <span className="text-white font-semibold">{userData.completedLessons}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">Stars Collected</span>
                </div>
                <span className="text-white font-semibold">{userData.totalStars}</span>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Recent Achievements</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <Award className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-medium">Study Streak Master</p>
                  <p className="text-green-400 text-xs">15 day streak achieved</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white text-sm font-medium">Star Collector</p>
                  <p className="text-yellow-400 text-xs">200+ stars collected</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Target className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white text-sm font-medium">Subject Master</p>
                  <p className="text-purple-400 text-xs">Physics excellence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Path */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Learning Path</h3>
            <div className="space-y-3">
              {(userData.weakAreas || []).map((area: string, index: number) => (
                <div key={index} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-white text-sm font-medium">{area}</p>
                  <p className="text-red-400 text-xs">Focus area - needs improvement</p>
                </div>
              ))}
              
              {(userData.strongAreas || []).map((area: string, index: number) => (
                <div key={index} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-white text-sm font-medium">{area}</p>
                  <p className="text-green-400 text-xs">Strength - maintain proficiency</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;