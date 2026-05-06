import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SensoryProfile } from '@/lib/data/course'

interface SessionLog {
  weekId: number
  date: string           // ISO string
  completed: boolean
  mood: 'great' | 'good' | 'okay' | 'hard'
  notes: string
  posturesCompleted: string[]
}

interface AppState {
  // Onboarding
  onboardingComplete: boolean
  childName: string
  childAge: number | null
  activeProfile: SensoryProfile | null

  // Progress
  currentWeek: number
  completedWeeks: number[]
  sessionLogs: SessionLog[]

  // Session in progress
  sessionActive: boolean
  sessionWeekId: number | null
  sessionStep: number           // which moment in the session
  sessionPostureIndex: number   // which posture within step
  audioPlaying: boolean
  storyComplete: boolean

  // UI
  sidebarOpen: boolean
  activeTab: 'clase' | 'padres' | 'materiales' | 'progreso'

  // Actions — onboarding
  completeOnboarding: (name: string, age: number, profile: SensoryProfile) => void

  // Actions — progress
  setCurrentWeek: (week: number) => void
  completeWeek: (weekId: number) => void
  logSession: (log: Omit<SessionLog, 'date'>) => void

  // Actions — session
  startSession: (weekId: number) => void
  endSession: () => void
  nextStep: () => void
  prevStep: () => void
  nextPosture: () => void
  toggleAudio: () => void
  completeStory: () => void

  // Actions — UI
  setActiveTab: (tab: AppState['activeTab']) => void
  toggleSidebar: () => void
  reset: () => void
}

const initialState = {
  onboardingComplete: false,
  childName: '',
  childAge: null,
  activeProfile: null,
  currentWeek: 1,
  completedWeeks: [],
  sessionLogs: [],
  sessionActive: false,
  sessionWeekId: null,
  sessionStep: 0,
  sessionPostureIndex: 0,
  audioPlaying: false,
  storyComplete: false,
  sidebarOpen: false,
  activeTab: 'clase' as const,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeOnboarding: (name, age, profile) =>
        set({ onboardingComplete: true, childName: name, childAge: age, activeProfile: profile }),

      setCurrentWeek: (week) => set({ currentWeek: week }),

      completeWeek: (weekId) =>
        set((s) => ({
          completedWeeks: s.completedWeeks.includes(weekId)
            ? s.completedWeeks
            : [...s.completedWeeks, weekId],
          currentWeek: Math.min(5, weekId + 1),
        })),

      logSession: (log) =>
        set((s) => ({
          sessionLogs: [...s.sessionLogs, { ...log, date: new Date().toISOString() }],
        })),

      startSession: (weekId) =>
        set({ sessionActive: true, sessionWeekId: weekId, sessionStep: 0, sessionPostureIndex: 0, storyComplete: false }),

      endSession: () =>
        set({ sessionActive: false, sessionWeekId: null, sessionStep: 0, sessionPostureIndex: 0, audioPlaying: false }),

      nextStep: () => set((s) => ({ sessionStep: s.sessionStep + 1, sessionPostureIndex: 0 })),
      prevStep: () => set((s) => ({ sessionStep: Math.max(0, s.sessionStep - 1) })),
      nextPosture: () => set((s) => ({ sessionPostureIndex: s.sessionPostureIndex + 1 })),
      toggleAudio: () => set((s) => ({ audioPlaying: !s.audioPlaying })),
      completeStory: () => set({ storyComplete: true }),

      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      reset: () => set(initialState),
    }),
    {
      name: 'kawa-app-storage',
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        childName: state.childName,
        childAge: state.childAge,
        activeProfile: state.activeProfile,
        currentWeek: state.currentWeek,
        completedWeeks: state.completedWeeks,
        sessionLogs: state.sessionLogs,
      }),
    }
  )
)
