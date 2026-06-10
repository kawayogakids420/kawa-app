'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'

export default function NavBottom() {
  const router   = useRouter()
  const pathname = usePathname()
  const { currentWeek } = useAppStore()

  const items = [
    { href:'/home',                  icon:'🗺️', label:'Inicio'    },
    { href:`/semana/${currentWeek}`, icon:'🧘', label:'Practica'  },
    { href:'/progreso',              icon:'📖', label:'Mi diario' },
  ]

  return (
    <nav style={{
      position:'fixed', bottom:0, left:0, right:0,
      background:'white', borderTop:'0.5px solid #F0E8E0',
      display:'flex', maxWidth:430, margin:'0 auto',
      zIndex:40
    }}>
      {items.map(({ href, icon, label }) => {
        const isActive = pathname === href || pathname.startsWith(href.replace(`/${currentWeek}`,''))
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            style={{
              flex:1, padding:'12px 0',
              display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              background:'none', border:'none', cursor:'pointer'
            }}
          >
            <span style={{ fontSize:20 }}>{icon}</span>
            <span style={{
              fontSize:10, fontWeight: isActive ? 600 : 500,
              color: isActive ? '#C4735A' : '#C4A090'
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
