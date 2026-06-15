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

export interface ChallengeState {
  challengeId: number
  month: number
  year: number
  daysCompleted: string[]
  rewardChosen: 'plant' | 'audio' | null
}

export interface PosturaItem {
  id: string
  nombre: string
  emoji: string
  categoria: string
  minutos: number
}

export interface RutinaPersonalizada {
  id: string
  nombre: string
  posturas: PosturaItem[]
  creadaEn: string
  vecesUsada: number
}

const CHALLENGES = [
  { id: 1, title: '7 días de respiración',  desc: 'Respiración Estrella antes de dormir', emoji: '⭐' },
  { id: 2, title: '7 días de raíces',       desc: 'Postura Montaña cada mañana',          emoji: '🏔️' },
  { id: 3, title: '7 días de calma',        desc: 'Postura del Niño después del jardín',  emoji: '🧒' },
  { id: 4, title: '7 días de energía',      desc: 'Guerrero II al despertar',              emoji: '⚔️' },
]

function getCurrentChallenge() {
  const now   = new Date()
  const month = now.getMonth()
  const id    = (month % 4) + 1
  return { ...CHALLENGES.find(c => c.id === id)!, month, year: now.getFullYear() }
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

// ─── ESTADO ───────────────────────────────────────────────────────────────────

interface AppState {
  onboardingComplete: boolean
  children: ChildProfile[]
  activeChildId: string | null
  userType: 'familia' | 'profesional' | null
  currentWeek: number
  completedWeeks: number[]
  sessionLogs: SessionLog[]
  challenge: ChallengeState
  rutinas: RutinaPersonalizada[]
  audioPlaying: boolean
  activeTab: 'clase' | 'padres' | 'materiales' | 'progreso'

  activeChild: () => ChildProfile | null
  getChallengeInfo: () => typeof CHALLENGES[0] & { month: number; year: number }
  isTodayCompleted: () => boolean

  completeOnboarding: (name: string, age: number, profile: SensoryProfile) => void
  addChild: (child: ChildProfile) => void
  setActiveChild: (id: string) => void
  updateChildProfile: (id: string, profile: SensoryProfile, pcts: Record<SensoryProfile, number>) => void
  setUserType: (type: 'familia' | 'profesional') => void
  setCurrentWeek: (week: number) => void
  completeWeek: (weekId: number) => void
  logSession: (log: Omit<SessionLog, 'date'>) => void
  markChallengeDay: () => void
  chooseReward: (reward: 'plant' | 'audio') => void
  saveRutina: (rutina: Omit<RutinaPersonalizada, 'id' | 'creadaEn' | 'vecesUsada'>) => void
  deleteRutina: (id: string) => void
  useRutina: (id: string) => void
  setActiveTab: (tab: AppState['activeTab']) => void
  toggleAudio: () => void
  reset: () => void
}

const now = new Date()
const initialChallenge: ChallengeState = {
  challengeId: (now.getMonth() % 4) + 1,
  month: now.getMonth(),
  year: now.getFullYear(),
  daysCompleted: [],
  rewardChosen: null,
}

const initialState = {
  onboardingComplete: false,
  children: [] as ChildProfile[],
  activeChildId: null as string | null,
  userType: null as 'familia' | 'profesional' | null,
  currentWeek: 1,
  completedWeeks: [] as number[],
  sessionLogs: [] as SessionLog[],
  challenge: initialChallenge,
  rutinas: [] as RutinaPersonalizada[],
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

      getChallengeInfo: () => getCurrentChallenge(),

      isTodayCompleted: () => {
        const { challenge } = get()
        return challenge.daysCompleted.includes(todayStr())
      },

      completeOnboarding: (name, age, profile) => {
        const child: ChildProfile = {
          id: Date.now().toString(),
          name, age, gender: 'male',
          profile, profilePcts: null,
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
          ),
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
          sessionLogs: [...s.sessionLogs, { ...log, date: new Date().toISOString() }],
        })),

      markChallengeDay: () => {
        const { challenge } = get()
        const today        = todayStr()
        const nowDate      = new Date()
        const currentMonth = nowDate.getMonth()
        const currentYear  = nowDate.getFullYear()

        if (challenge.month !== currentMonth || challenge.year !== currentYear) {
          set({
            challenge: {
              challengeId: (currentMonth % 4) + 1,
              month: currentMonth,
              year: currentYear,
              daysCompleted: [today],
              rewardChosen: null,
            },
          })
          return
        }

        if (challenge.daysCompleted.includes(today)) return

        set(s => ({
          challenge: {
            ...s.challenge,
            daysCompleted: [...s.challenge.daysCompleted, today],
          },
        }))
      },

      chooseReward: (reward) =>
        set(s => ({
          challenge: { ...s.challenge, rewardChosen: reward },
        })),

      saveRutina: (rutina) =>
        set(s => ({
          rutinas: [
            ...s.rutinas,
            {
              ...rutina,
              id: Date.now().toString(),
              creadaEn: new Date().toISOString(),
              vecesUsada: 0,
            },
          ],
        })),

      deleteRutina: (id) =>
        set(s => ({ rutinas: s.rutinas.filter(r => r.id !== id) })),

      useRutina: (id) =>
        set(s => ({
          rutinas: s.rutinas.map(r =>
            r.id === id ? { ...r, vecesUsada: r.vecesUsada + 1 } : r
          ),
        })),

      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleAudio:  () => set(s => ({ audioPlaying: !s.audioPlaying })),
      reset:        () => set(initialState),
    }),
    {
      name: 'kawa-app-storage',
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        children:           s.children,
        activeChildId:      s.activeChildId,
        userType:           s.userType,
        currentWeek:        s.currentWeek,
        completedWeeks:     s.completedWeeks,
        sessionLogs:        s.sessionLogs,
        challenge:          s.challenge,
        rutinas:            s.rutinas,
      }),
    }
  )
)

export { CHALLENGES, getCurrentChallenge, todayStr }
