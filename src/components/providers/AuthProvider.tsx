
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setSession } = useAuthStore();
  const { checkOnboardingStatus } = useOnboardingStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          // Redirect based on onboarding status
          setTimeout(async () => {
            try {
              const onboardingComplete = await checkOnboardingStatus();
              
              if (onboardingComplete) {
                navigate('/dashboard');
              } else {
                navigate('/onboarding');
              }
            } catch (error) {
              console.error('Error checking onboarding status:', error);
              // Default to onboarding if there's an error
              navigate('/onboarding');
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is logged in but on the auth page, check onboarding status and redirect
      if (session?.user && window.location.pathname === '/') {
        const onboardingComplete = await checkOnboardingStatus();
        
        if (onboardingComplete) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, navigate, checkOnboardingStatus]);

  return <>{children}</>;
};
