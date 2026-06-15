'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'

export default function NavBottom() {
  const router   = useRouter()
  const pathname = usePathname()
  const { userType } = useAppStore()

  const items = [
    { href: '/home',      icon: '🏠', label: 'Inicio'    },
    { href: '/historia',  icon: '🌱', label: 'Historia'  },
    { href: '/practica',  icon: '🧘', label: 'Práctica'  },
    { href: '/explorar',  icon: '🔍', label: 'Explorar'  },
  ]

  // Historia no muestra nav encima — se oculta allí
  if (pathname === '/historia') return null

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'white', borderTop: '0.5px solid #F0E8E0',
      display: 'flex', maxWidth: 430, margin: '0 auto',
      zIndex: 40, paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {items.map(({ href, icon, label }) => {
        const isActive = pathname === href
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            style={{
              flex: 1, padding: '10px 0 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{
              fontSize: 10, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#1a3d30' : '#C4A090',
              fontFamily: "'Nunito', sans-serif",
            }}>
              {label}
            </span>
            {isActive && (
              <div style={{
                width: 4, height: 4, borderRadius: '50%',
                background: '#7bbfab', marginTop: 1,
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
