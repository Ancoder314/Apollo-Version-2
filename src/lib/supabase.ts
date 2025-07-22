import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcmykxjshsblhmazuubt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbXlreGpzaHNibGhtYXp1dWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTQ1NjcsImV4cCI6MjA2ODY3MDU2N30.sqURiu6pgiCJP7Lf74rGx8CIamG-Ux4bMuXwWZPK65A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'apollo-study-app'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          level: number;
          total_stars: number;
          current_streak: number;
          study_time: number;
          completed_lessons: number;
          weak_areas: string[];
          strong_areas: string[];
          learning_style: string;
          study_goals: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          level?: number;
          total_stars?: number;
          current_streak?: number;
          study_time?: number;
          completed_lessons?: number;
          weak_areas?: string[];
          strong_areas?: string[];
          learning_style?: string;
          study_goals?: string[];
        };
        Update: {
          name?: string;
          level?: number;
          total_stars?: number;
          current_streak?: number;
          study_time?: number;
          completed_lessons?: number;
          weak_areas?: string[];
          strong_areas?: string[];
          learning_style?: string;
          study_goals?: string[];
          updated_at?: string;
        };
      };
      study_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          duration: number;
          daily_time_commitment: number;
          difficulty: string;
          subjects: any;
          milestones: any;
          adaptive_features: any;
          personalized_recommendations: string[];
          estimated_outcome: string;
          confidence: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description: string;
          duration: number;
          daily_time_commitment: number;
          difficulty: string;
          subjects: any;
          milestones: any;
          adaptive_features: any;
          personalized_recommendations: string[];
          estimated_outcome: string;
          confidence: number;
          is_active?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          subjects?: any;
          milestones?: any;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string;
          duration: number;
          stars_earned: number;
          accuracy: number;
          completed_at: string;
          session_data: any;
        };
        Insert: {
          user_id: string;
          subject: string;
          topic: string;
          duration: number;
          stars_earned: number;
          accuracy: number;
          session_data?: any;
        };
        Update: {
          duration?: number;
          stars_earned?: number;
          accuracy?: number;
          session_data?: any;
        };
      };
      daily_progress: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          study_time: number;
          lessons_completed: number;
          stars_earned: number;
          subjects_studied: string[];
        };
        Insert: {
          user_id: string;
          date: string;
          study_time: number;
          lessons_completed: number;
          stars_earned: number;
          subjects_studied: string[];
        };
        Update: {
          study_time?: number;
          lessons_completed?: number;
          stars_earned?: number;
          subjects_studied?: string[];
        };
      };
    };
  };
};