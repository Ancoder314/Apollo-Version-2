import React, { useState, useEffect } from 'react';
import { Star, Award, Sparkles, Zap } from 'lucide-react';

interface ConstellationsProps {
  userData: any;
}

const Constellations: React.FC<ConstellationsProps> = ({ userData }) => {
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [animatedStars, setAnimatedStars] = useState(new Set());

  const constellations = [
    {
      id: 1,
      name: 'The Scholar',
      description: 'Complete 50 lessons across all subjects',
      stars: 50,
      unlocked: userData.completedLessons >= 50,
      progress: Math.min(userData.completedLessons, 50),
      reward: 'Exclusive "Scholar" badge',
      pattern: [
        { x: 20, y: 30, connected: true },
        { x: 40, y: 20, connected: true },
        { x: 60, y: 35, connected: true },
        { x: 45, y: 50, connected: true },
        { x: 25, y: 65, connected: true }
      ]
    },
    {
      id: 2,
      name: 'The Phoenix',
      description: 'Maintain a 30-day study streak',
      stars: 75,
      unlocked: userData.currentStreak >= 30,
      progress: Math.min(userData.currentStreak, 30),
      reward: 'Phoenix flame effect on profile',
      pattern: [
        { x: 30, y: 15, connected: true },
        { x: 50, y: 10, connected: true },
        { x: 70, y: 15, connected: true },
        { x: 60, y: 30, connected: true },
        { x: 40, y: 30, connected: true },
        { x: 50, y: 45, connected: true },
        { x: 35, y: 60, connected: true },
        { x: 65, y: 60, connected: true }
      ]
    },
    {
      id: 3,
      name: 'The Explorer',
      description: 'Study in 10 different subjects',
      stars: 100,
      unlocked: false,
      progress: 5,
      reward: 'Access to advanced AI tutor features',
      pattern: [
        { x: 25, y: 25, connected: true },
        { x: 75, y: 25, connected: true },
        { x: 50, y: 40, connected: true },
        { x: 30, y: 55, connected: true },
        { x: 70, y: 55, connected: true },
        { x: 50, y: 70, connected: true }
      ]
    },
    {
      id: 4,
      name: 'The Master',
      description: 'Achieve 95% mastery in any subject',
      stars: 150,
      unlocked: false,
      progress: 89,
      reward: 'Golden crown avatar decoration',
      pattern: [
        { x: 50, y: 15, connected: true },
        { x: 35, y: 30, connected: true },
        { x: 65, y: 30, connected: true },
        { x: 20, y: 45, connected: true },
        { x: 50, y: 45, connected: true },
        { x: 80, y: 45, connected: true },
        { x: 35, y: 60, connected: true },
        { x: 65, y: 60, connected: true },
        { x: 50, y: 75, connected: true }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStars(prev => {
        const newSet = new Set(prev);
        const randomStar = Math.floor(Math.random() * 20);
        if (newSet.has(randomStar)) {
          newSet.delete(randomStar);
        } else {
          newSet.add(randomStar);
        }
        return newSet;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const renderConstellation = (constellation: any) => {
    const isUnlocked = constellation.unlocked;
    const progressPercent = (constellation.progress / constellation.stars) * 100;
    
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Connecting lines */}
        {constellation.pattern.map((star: any, index: number) => {
          if (index < constellation.pattern.length - 1) {
            const nextStar = constellation.pattern[index + 1];
            return (
              <line
                key={`line-${index}`}
                x1={star.x}
                y1={star.y}
                x2={nextStar.x}
                y2={nextStar.y}
                stroke={isUnlocked ? '#F59E0B' : '#64748B'}
                strokeWidth="0.5"
                opacity={isUnlocked ? 0.8 : 0.3}
                className={isUnlocked ? 'animate-pulse' : ''}
              />
            );
          }
          return null;
        })}
        
        {/* Stars */}
        {constellation.pattern.map((star: any, index: number) => {
          const isStarUnlocked = index < (constellation.pattern.length * progressPercent / 100);
          return (
            <g key={`star-${index}`}>
              <circle
                cx={star.x}
                cy={star.y}
                r="2"
                fill={isStarUnlocked ? '#F59E0B' : '#64748B'}
                className={isStarUnlocked ? 'animate-pulse' : ''}
              />
              {isStarUnlocked && (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r="1"
                  fill="#FCD34D"
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-6 border border-yellow-500/20">
        <div className="flex items-center space-x-3 mb-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Constellation Rewards</h2>
        </div>
        <p className="text-gray-300 mb-4">
          Form beautiful constellations by earning stars through your learning journey. 
          Each constellation unlocks special rewards and recognition.
        </p>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-white">{userData.totalStars} stars collected</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-white">
              {constellations.filter(c => c.unlocked).length} constellations formed
            </span>
          </div>
        </div>
      </div>

      {/* Constellations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {constellations.map((constellation) => {
          const progressPercent = (constellation.progress / constellation.stars) * 100;
          const isUnlocked = constellation.unlocked;
          
          return (
            <div
              key={constellation.id}
              className={`relative bg-slate-800/60 backdrop-blur-sm rounded-lg border transition-all duration-300 overflow-hidden ${
                isUnlocked 
                  ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10' 
                  : 'border-slate-700/50 hover:border-purple-500/50'
              }`}
              onClick={() => setSelectedConstellation(constellation)}
            >
              {/* Unlocked Effect */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 pointer-events-none" />
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-xl font-bold mb-1 ${
                      isUnlocked ? 'text-yellow-300' : 'text-white'
                    }`}>
                      {constellation.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{constellation.description}</p>
                  </div>
                  {isUnlocked && (
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Zap className="w-5 h-5" />
                      <span className="text-sm font-semibold">Unlocked!</span>
                    </div>
                  )}
                </div>

                {/* Constellation Visualization */}
                <div className="relative h-32 mb-4 bg-slate-900/50 rounded-lg p-4">
                  {renderConstellation(constellation)}
                </div>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className={isUnlocked ? 'text-yellow-400' : 'text-purple-400'}>
                      {constellation.progress}/{constellation.stars}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        isUnlocked 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <Award className={`w-5 h-5 ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-white">Reward</p>
                    <p className="text-xs text-gray-400">{constellation.reward}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sky Map - Decorative constellation background */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span>Your Star Map</span>
        </h3>
        <div className="relative h-64 bg-gradient-to-b from-slate-900 to-purple-900/50 rounded-lg overflow-hidden">
          {/* Animated background stars */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-yellow-300 rounded-full transition-all duration-1000 ${
                animatedStars.has(i) ? 'animate-pulse scale-150' : ''
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
              <p className="text-white text-lg font-semibold">Keep learning to light up the sky!</p>
              <p className="text-gray-400 text-sm mt-1">
                {userData.totalStars} stars collected • Next constellation at {constellations.find(c => !c.unlocked)?.stars || 0} progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Constellations;