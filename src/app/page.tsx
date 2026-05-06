'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'

export default function RootPage() {
  const router = useRouter()
  const onboardingComplete = useAppStore((s) => s.onboardingComplete)
  useEffect(() => {
    if (onboardingComplete) router.replace('/home')
    else router.replace('/onboarding')
  }, [onboardingComplete, router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2D6A4F]">
      <div className="text-white text-center">
        <div className="text-6xl mb-4">🌱</div>
        <p className="text-lg opacity-80">Cargando el universo de Kawa...</p>
      </div>
    </div>
  )
}
