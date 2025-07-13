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
  isGuest?: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    
    // Check if user is in guest mode
    const guestMode = localStorage.getItem('apollo_guest_mode');
    if (guestMode === 'true') {
      setIsGuestMode(true);
      const guestProfile = getGuestProfile();
      setProfile(guestProfile);
      setLoading(false);
      return;
    }
    
    const initializeAuth = async () => {
      try {
        setError(null);
        setIsRetrying(false);
        
        // Set a more reasonable timeout
        timeoutId = setTimeout(() => {
          if (mounted && loading) {
            console.warn('Auth initialization timeout');
            setError('Connection timeout. Please check your internet connection and try again.');
            setLoading(false);
          }
        }, 8000); // Reduced to 8 seconds

        // Get initial session with retry logic
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Session error:', error);
          if (retryCount < 2) {
            setRetryCount(prev => prev + 1);
            setIsRetrying(true);
            setTimeout(() => {
              if (mounted) initializeAuth();
            }, 2000);
            return;
          }
          setError('Failed to connect to authentication service. Please refresh the page.');
          setLoading(false);
          return;
        }
        
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Auth initialization error:', err);
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1);
          setIsRetrying(true);
          setTimeout(() => {
            if (mounted) initializeAuth();
          }, 2000);
        } else {
          setError('Failed to initialize authentication. Please refresh the page.');
          setLoading(false);
        }
      }
    };

    // Start initialization
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event);
        
        // Reset retry count on successful auth change
        setRetryCount(0);
        setError(null);
        
        setUser(session?.user ?? null);
        
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
  }, [retryCount]); // Add retryCount as dependency

  const getGuestProfile = (): UserProfile => {
    const savedProfile = localStorage.getItem('apollo_guest_profile');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    
    const defaultProfile: UserProfile = {
      id: 'guest-user',
      email: 'guest@apollo.local',
      name: 'Guest User',
      level: 1,
      total_stars: 0,
      current_streak: 0,
      study_time: 0,
      completed_lessons: 0,
      weak_areas: [],
      strong_areas: [],
      learning_style: 'visual',
      study_goals: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isGuest: true
    };
    
    localStorage.setItem('apollo_guest_profile', JSON.stringify(defaultProfile));
    return defaultProfile;
  };

  const saveGuestProfile = (profile: UserProfile) => {
    localStorage.setItem('apollo_guest_profile', JSON.stringify(profile));
  };
  const fetchProfile = async (userId: string) => {
    if (!userId) {
      console.error('No userId provided to fetchProfile');
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      
      // Add timeout for profile fetch
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 30000)
      );
      
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.message?.includes('timeout')) {
          setError('Profile loading timeout. Please refresh the page.');
        } else {
          setError('Failed to load profile. Please try again.');
        }
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
    if (!profile) return;
    
    // Handle guest mode updates
    if (isGuestMode || profile.isGuest) {
      const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
      setProfile(updatedProfile);
      saveGuestProfile(updatedProfile);
      return updatedProfile;
    }
    
    if (!user) return;

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

  const signInAsGuest = () => {
    setIsGuestMode(true);
    localStorage.setItem('apollo_guest_mode', 'true');
    const guestProfile = getGuestProfile();
    setProfile(guestProfile);
    setLoading(false);
    setError(null);
  };
  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    
    try {
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in timeout')), 15000)
      );
      
      const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any;
      
      if (error) {
        if (error.message?.includes('timeout')) {
          setError('Sign in is taking too long. Please check your connection and try again.');
        } else {
          setError(error.message);
        }
        setLoading(false);
      }
      return { data, error };
    } catch (error: any) {
      setError(error.message || 'Sign in failed. Please try again.');
      setLoading(false);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setError(null);
    setLoading(true);
    
    try {
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign up timeout')), 15000)
      );
      
      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]) as any;
      
      if (error) {
        if (error.message?.includes('timeout')) {
          setError('Sign up is taking too long. Please check your connection and try again.');
        } else {
          setError(error.message);
        }
        setLoading(false);
      }
      return { data, error };
    } catch (error: any) {
      setError(error.message || 'Sign up failed. Please try again.');
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    setError(null);
    
    // Handle guest mode sign out
    if (isGuestMode) {
      setIsGuestMode(false);
      setProfile(null);
      localStorage.removeItem('apollo_guest_mode');
      localStorage.removeItem('apollo_guest_profile');
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    }
    return { error };
  };

  const retry = () => {
    setRetryCount(0);
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  return {
    user,
    profile,
    loading,
    error,
    isRetrying,
    isGuestMode,
    retry,
    signIn,
    signUp,
    signOut,
    signInAsGuest,
    updateProfile,
    fetchProfile
  };
};