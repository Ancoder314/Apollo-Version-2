import React, { useState } from 'react';
import { 
  Brain, 
  Upload, 
  FileText, 
  Target, 
  Clock, 
  Star, 
  X, 
  Plus,
  Trash2,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { aiEngine, StudyPlan } from '../utils/aiEngine';

interface StudyPlanGeneratorProps {
  onClose: () => void;
  onPlanGenerated: (plan: StudyPlan) => void;
}

const StudyPlanGenerator: React.FC<StudyPlanGeneratorProps> = ({ onClose, onPlanGenerated }) => {
  const { profile, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goals: [''],
    weakAreas: [''],
    strongAreas: [''],
    learningStyle: 'visual',
    timeAvailable: 60,
    preferredDifficulty: 'adaptive',
    additionalInfo: '',
    uploadedFiles: [] as File[]
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setFormData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...acceptedFiles]
      }));
    }
  });

  const addField = (field: 'goals' | 'weakAreas' | 'strongAreas') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'goals' | 'weakAreas' | 'strongAreas', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'goals' | 'weakAreas' | 'strongAreas', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };

  const processUploadedFiles = async (): Promise<string> => {
    if (formData.uploadedFiles.length === 0) return '';

    let extractedText = '';
    
    for (const file of formData.uploadedFiles) {
      try {
        if (file.type === 'text/plain') {
          const text = await file.text();
          extractedText += `\n\nFrom ${file.name}:\n${text}`;
        } else {
          // For other file types, we'll just note the filename
          extractedText += `\n\nUploaded file: ${file.name} (${file.type})`;
        }
      } catch (error) {
        console.error('Error processing file:', file.name, error);
      }
    }

    return extractedText;
  };

  const generateStudyPlan = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      // Process uploaded files
      const fileContent = await processUploadedFiles();
      
      // Combine all information
      const enhancedInfo = `
        ${formData.additionalInfo}
        ${fileContent}
        
        Additional Context:
        - Current Level: ${profile.level}
        - Total Stars: ${profile.total_stars}
        - Study Time: ${profile.study_time} minutes
        - Completed Lessons: ${profile.completed_lessons}
        - Current Streak: ${profile.current_streak} days
      `.trim();

      // Create enhanced user profile
      const enhancedProfile = {
        ...profile,
        weakAreas: formData.weakAreas.filter(area => area.trim()),
        strongAreas: formData.strongAreas.filter(area => area.trim()),
        learningStyle: formData.learningStyle as any,
        preferredDifficulty: formData.preferredDifficulty as any,
        studyGoals: formData.goals.filter(goal => goal.trim()),
        timeAvailable: formData.timeAvailable,
        recentPerformance: {
          accuracy: 75,
          speed: 1.2,
          consistency: 80,
          engagement: 85
        }
      };

      // Generate AI study plan
      const plan = aiEngine.generateStudyPlan(
        enhancedProfile,
        formData.goals.filter(goal => goal.trim())
      );

      // Save to database
      const { data, error } = await supabase
        .from('study_plans')
        .insert({
          user_id: profile.id,
          title: plan.title,
          description: plan.description,
          duration: plan.duration,
          daily_time_commitment: plan.dailyTimeCommitment,
          difficulty: plan.difficulty,
          subjects: plan.subjects,
          milestones: plan.milestones,
          adaptive_features: plan.adaptiveFeatures,
          personalized_recommendations: plan.personalizedRecommendations,
          estimated_outcome: plan.estimatedOutcome,
          confidence: plan.confidence,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Update user profile with new preferences
      await updateProfile({
        weak_areas: formData.weakAreas.filter(area => area.trim()),
        strong_areas: formData.strongAreas.filter(area => area.trim()),
        learning_style: formData.learningStyle,
        study_goals: formData.goals.filter(goal => goal.trim())
      });

      onPlanGenerated({ ...plan, id: data.id });
      onClose();
    } catch (error) {
      console.error('Error generating study plan:', error);
      alert('Failed to generate study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Learning Goals</h3>
        <p className="text-gray-400 mb-4">What do you want to achieve? Be specific about your learning objectives.</p>
        
        {formData.goals.map((goal, index) => (
          <div key={index} className="flex items-center space-x-2 mb-3">
            <input
              type="text"
              value={goal}
              onChange={(e) => updateField('goals', index, e.target.value)}
              placeholder="e.g., Master calculus for engineering applications"
              className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            />
            {formData.goals.length > 1 && (
              <button
                onClick={() => removeField('goals', index)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={() => addField('goals')}
          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add another goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Areas to Improve</h4>
          {formData.weakAreas.map((area, index) => (
            <div key={index} className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={area}
                onChange={(e) => updateField('weakAreas', index, e.target.value)}
                placeholder="e.g., Organic Chemistry"
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-red-500 focus:outline-none"
              />
              {formData.weakAreas.length > 1 && (
                <button
                  onClick={() => removeField('weakAreas', index)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addField('weakAreas')}
            className="flex items-center space-x-1 text-red-400 hover:text-red-300 text-sm"
          >
            <Plus className="w-3 h-3" />
            <span>Add weak area</span>
          </button>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Strong Areas</h4>
          {formData.strongAreas.map((area, index) => (
            <div key={index} className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={area}
                onChange={(e) => updateField('strongAreas', index, e.target.value)}
                placeholder="e.g., Physics"
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-green-500 focus:outline-none"
              />
              {formData.strongAreas.length > 1 && (
                <button
                  onClick={() => removeField('strongAreas', index)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addField('strongAreas')}
            className="flex items-center space-x-1 text-green-400 hover:text-green-300 text-sm"
          >
            <Plus className="w-3 h-3" />
            <span>Add strong area</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Learning Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Preferred Learning Style
            </label>
            <select
              value={formData.learningStyle}
              onChange={(e) => setFormData(prev => ({ ...prev, learningStyle: e.target.value }))}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            >
              <option value="visual">Visual (diagrams, charts, images)</option>
              <option value="auditory">Auditory (lectures, discussions)</option>
              <option value="kinesthetic">Kinesthetic (hands-on, interactive)</option>
              <option value="reading">Reading/Writing (text-based)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Preferred Difficulty
            </label>
            <select
              value={formData.preferredDifficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredDifficulty: e.target.value }))}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
            >
              <option value="adaptive">Adaptive (AI adjusts automatically)</option>
              <option value="easy">Easy (build confidence)</option>
              <option value="medium">Medium (balanced challenge)</option>
              <option value="hard">Hard (maximum challenge)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Daily Study Time Available (minutes)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="15"
              max="240"
              step="15"
              value={formData.timeAvailable}
              onChange={(e) => setFormData(prev => ({ ...prev, timeAvailable: parseInt(e.target.value) }))}
              className="flex-1"
            />
            <div className="bg-slate-700 px-4 py-2 rounded-lg border border-slate-600">
              <span className="text-white font-semibold">{formData.timeAvailable} min</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {formData.timeAvailable < 30 ? 'Quick sessions' : 
             formData.timeAvailable < 60 ? 'Standard sessions' :
             formData.timeAvailable < 120 ? 'Extended sessions' : 'Intensive sessions'}
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Additional Information</h3>
        
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Tell us more about your learning context
          </label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
            placeholder="e.g., I'm preparing for medical school entrance exams, struggling with time management, prefer evening study sessions..."
            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none h-32 resize-none"
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Upload Supporting Documents (Optional)</h4>
          <p className="text-gray-400 text-sm mb-4">
            Upload syllabi, course outlines, or any documents that can help us understand your learning needs better.
          </p>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-slate-600 hover:border-purple-500/50 bg-slate-700/30'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-purple-400">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-white mb-2">Drag & drop files here, or click to select</p>
                <p className="text-gray-400 text-sm">Supports: PDF, DOC, DOCX, TXT (max 5 files)</p>
              </div>
            )}
          </div>

          {formData.uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h5 className="text-white font-medium">Uploaded Files:</h5>
              {formData.uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white text-sm font-medium">{file.name}</p>
                      <p className="text-gray-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">AI Study Plan Generator</h2>
              <p className="text-gray-300">Create a personalized learning plan tailored to your goals</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-6">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNum 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-600 text-gray-400'
                }`}>
                  {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNum ? 'bg-purple-600' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-800/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Step {step} of 3
            </div>
            <div className="space-x-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={generateStudyPlan}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Generating Plan...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>Generate AI Study Plan</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanGenerator;