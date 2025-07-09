import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
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
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout - forcing completion');
        setLoading(false);
        setError('Authentication timeout. Please refresh the page.');
      }
    }, 10000); // 10 second timeout

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Session error:', error);
        setError('Failed to get session. Please try again.');
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      if (!mounted) return;
      console.error('Session fetch error:', err);
      setError('Failed to initialize authentication.');
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        setError(null); // Clear any previous errors
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!userId) {
      console.error('No userId provided to fetchProfile');
      setLoading(false);
      return;
    }
    
    try {
      setError(null); // Clear any previous errors
      
      // Use maybeSingle() to handle cases where no profile exists without throwing an error
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again.');
        setLoading(false);
        return;
      }

      if (!data) {
        console.log('No profile found, creating new profile...');
        // Profile doesn't exist, create one
        const newProfile = {
          id: userId,
          email: user?.email || '',
          name: user?.user_metadata?.name || 'Student',
          level: 1,
          total_stars: 0,
          current_streak: 0,
          study_time: 0,
          completed_lessons: 0,
          weak_areas: [],
          strong_areas: [],
          learning_style: 'visual',
          study_goals: []
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          // Handle race condition where profile was created by another request
          if (createError.code === '23505') {
            // Unique constraint violation - profile already exists, fetch it
            console.log('Profile already exists, fetching existing profile...');
            const { data: existingProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (fetchError) {
              console.error('Error fetching existing profile:', fetchError);
              setError('Failed to load existing profile.');
            } else {
              setProfile(existingProfile);
            }
          } else {
            console.error('Error creating profile:', createError);
            setError('Failed to create profile. Please try again.');
          }
        } else {
          console.log('Profile created successfully');
          setProfile(createdProfile);
        }
      } else {
        console.log('Profile loaded successfully');
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setError('An unexpected error occurred while loading your profile.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile.');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    return { data, error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    return { data, error };
  };

  const signOut = async () => {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    }
    return { error };
  };

  return {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    fetchProfile
  };
};