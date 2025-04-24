
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setSession } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          // Redirect based on onboarding status
          setTimeout(async () => {
            const { data } = await supabase
              .from('profiles')
              .select('onboarding_complete')
              .eq('id', session?.user.id)
              .single();
            
            navigate(data?.onboarding_complete ? '/dashboard' : '/onboarding');
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, navigate]);

  return <>{children}</>;
};
