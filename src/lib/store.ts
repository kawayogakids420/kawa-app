import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SensoryProfile } from '@/lib/data/course'

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface ChildProfile {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  profile: SensoryProfile | null
  profilePcts: Record<SensoryProfile, number> | null
}

interface SessionLog {
  weekId: number
  childId: string
  date: string
  completed: boolean
  mood: 'great' | 'good' | 'okay' | 'hard'
  notes: string
  posturesCompleted: string[]
}

interface AppState {
  // Multi-niño
  onboardingComplete: boolean
  children: ChildProfile[]
  activeChildId: string | null

  // Tipo de usuario
  userType: 'familia' | 'profesional' | null

  // Progreso (por niño)
  currentWeek: number
  completedWeeks: number[]
  sessionLogs: SessionLog[]

  // UI
  audioPlaying: boolean
  activeTab: 'clase' | 'padres' | 'materiales' | 'progreso'

  // Getters helper
  activeChild: () => ChildProfile | null

  // Actions — onboarding
  completeOnboarding: (name: string, age: number, profile: SensoryProfile) => void
  addChild: (child: ChildProfile) => void
  setActiveChild: (id: string) => void
  updateChildProfile: (id: string, profile: SensoryProfile, pcts: Record<SensoryProfile, number>) => void

  // Actions — tipo de usuario
  setUserType: (type: 'familia' | 'profesional') => void

  // Actions — progreso
  setCurrentWeek: (week: number) => void
  completeWeek: (weekId: number) => void
  logSession: (log: Omit<SessionLog, 'date'>) => void

  // Actions — UI
  setActiveTab: (tab: AppState['activeTab']) => void
  toggleAudio: () => void
  reset: () => void
}

const initialState = {
  onboardingComplete: false,
  children: [] as ChildProfile[],
  activeChildId: null as string | null,
  userType: null as 'familia' | 'profesional' | null,
  currentWeek: 1,
  completedWeeks: [] as number[],
  sessionLogs: [] as SessionLog[],
  audioPlaying: false,
  activeTab: 'clase' as const,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      activeChild: () => {
        const { children, activeChildId } = get()
        return children.find(c => c.id === activeChildId) ?? children[0] ?? null
      },

      completeOnboarding: (name, age, profile) => {
        const child: ChildProfile = {
          id: Date.now().toString(),
          name, age, gender: 'male',
          profile, profilePcts: null
        }
        set(s => ({
          onboardingComplete: true,
          children: s.children.length === 0 ? [child] : s.children,
          activeChildId: s.activeChildId ?? child.id,
        }))
      },

      addChild: (child) =>
        set(s => ({
          children: [...s.children, child],
          activeChildId: s.activeChildId ?? child.id,
          onboardingComplete: true,
        })),

      setActiveChild: (id) => set({ activeChildId: id }),

      updateChildProfile: (id, profile, pcts) =>
        set(s => ({
          children: s.children.map(c =>
            c.id === id ? { ...c, profile, profilePcts: pcts } : c
          )
        })),

      setUserType: (type) => set({ userType: type }),

      setCurrentWeek: (week) => set({ currentWeek: week }),

      completeWeek: (weekId) =>
        set(s => ({
          completedWeeks: s.completedWeeks.includes(weekId)
            ? s.completedWeeks
            : [...s.completedWeeks, weekId],
          currentWeek: Math.min(5, weekId + 1),
        })),

      logSession: (log) =>
        set(s => ({
          sessionLogs: [...s.sessionLogs, { ...log, date: new Date().toISOString() }]
        })),

      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleAudio: () => set(s => ({ audioPlaying: !s.audioPlaying })),
      reset: () => set(initialState),
    }),
    {
      name: 'kawa-app-storage',
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        children: s.children,
        activeChildId: s.activeChildId,
        userType: s.userType,
        currentWeek: s.currentWeek,
        completedWeeks: s.completedWeeks,
        sessionLogs: s.sessionLogs,
      }),
    }
  )
)