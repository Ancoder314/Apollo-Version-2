import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Clock, Coffee } from 'lucide-react';

interface PomodoroTimerProps {
  onClose: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onClose }) => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (isBreak) {
        setIsBreak(false);
        setTime(25 * 60); // Start new focus session
      } else {
        setSessions(prev => prev + 1);
        setIsBreak(true);
        setTime(5 * 60); // 5 minute break
      }
    }

    return () => clearInterval(interval);
  }, [isActive, time, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(isBreak ? 5 * 60 : 25 * 60);
  };

  const skipSession = () => {
    setIsActive(false);
    if (isBreak) {
      setIsBreak(false);
      setTime(25 * 60);
    } else {
      setSessions(prev => prev + 1);
      setIsBreak(true);
      setTime(5 * 60);
    }
  };

  const progress = isBreak 
    ? ((5 * 60 - time) / (5 * 60)) * 100
    : ((25 * 60 - time) / (25 * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            {isBreak ? <Coffee className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            <span>{isBreak ? 'Break Time' : 'Focus Session'}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="relative w-48 h-48 mx-auto mb-6">
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-slate-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={`transition-all duration-1000 ${
                  isBreak ? 'text-green-400' : 'text-purple-400'
                }`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {formatTime(time)}
                </div>
                <div className={`text-sm font-medium ${
                  isBreak ? 'text-green-400' : 'text-purple-400'
                }`}>
                  {isBreak ? 'Take a break!' : 'Stay focused!'}
                </div>
              </div>
            </div>
          </div>

          {/* Session Counter */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-gray-400">Sessions completed:</span>
            <span className="text-white font-bold">{sessions}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={toggleTimer}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-2">
          <button
            onClick={skipSession}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Skip {isBreak ? 'break' : 'session'}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-gray-300 text-center">
            {isBreak 
              ? "💡 Take a walk, stretch, or grab some water to recharge!"
              : "💡 Minimize distractions and focus on one task at a time."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;