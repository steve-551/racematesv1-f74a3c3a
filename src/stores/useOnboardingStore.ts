
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingStep {
  id: string;
  title: string;
  completed: boolean;
}

interface OnboardingState {
  steps: OnboardingStep[];
  currentStepIndex: number;
  isComplete: boolean;
  setCurrentStep: (index: number) => void;
  completeStep: (id: string) => void;
  completeOnboarding: () => Promise<void>;
  checkOnboardingStatus: () => Promise<boolean>;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      steps: [
        { id: 'personal', title: 'Personal Information', completed: false },
        { id: 'platforms', title: 'Racing Platforms', completed: false },
        { id: 'iRacing', title: 'iRacing Stats', completed: false },
        { id: 'preferences', title: 'Racing Preferences', completed: false },
        { id: 'finalSetup', title: 'Complete Profile', completed: false },
      ],
      currentStepIndex: 0,
      isComplete: false,

      setCurrentStep: (index) => {
        set({ currentStepIndex: index });
      },

      completeStep: (id) => {
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === id ? { ...step, completed: true } : step
          ),
        }));
      },

      completeOnboarding: async () => {
        try {
          // Mark all steps as completed
          set((state) => ({
            steps: state.steps.map((step) => ({ ...step, completed: true })),
            isComplete: true,
          }));

          // In a real app, we would update the Supabase profile
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // We'd update the user profile in Supabase here
            console.log('Onboarding completed for user', user.id);
          }
        } catch (error) {
          console.error('Error completing onboarding:', error);
        }
      },

      checkOnboardingStatus: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            return false;
          }
          
          // In a real app, we'd fetch the user's profile from Supabase
          // and check if onboarding is complete
          // For now, we'll just return the local state
          return get().isComplete;
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          return false;
        }
      },

      resetOnboarding: () => {
        set({
          steps: [
            { id: 'personal', title: 'Personal Information', completed: false },
            { id: 'platforms', title: 'Racing Platforms', completed: false },
            { id: 'iRacing', title: 'iRacing Stats', completed: false },
            { id: 'preferences', title: 'Racing Preferences', completed: false },
            { id: 'finalSetup', title: 'Complete Profile', completed: false },
          ],
          currentStepIndex: 0,
          isComplete: false,
        });
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
);
