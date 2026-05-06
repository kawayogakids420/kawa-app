import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeekProgress(completedWeeks: number[]): number {
  return Math.round((completedWeeks.length / 5) * 100)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

export function getMoodEmoji(mood: string): string {
  const map: Record<string, string> = {
    great: '🌟', good: '😊', okay: '😐', hard: '😔'
  }
  return map[mood] ?? '😊'
}

export function getMoodLabel(mood: string): string {
  const map: Record<string, string> = {
    great: 'Increíble', good: 'Bien', okay: 'Regular', hard: 'Difícil'
  }
  return map[mood] ?? 'Bien'
}
