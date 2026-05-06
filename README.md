# Kawa y los 5 Guardianes — App de Yoga Sensorial

PWA en Next.js 15 + TypeScript + Tailwind CSS + Zustand.
Funciona instalada en el celular, sin App Store. Funciona offline.

## Stack

| Capa | Tech |
|------|------|
| Framework | Next.js 15 (App Router) |
| Estado | Zustand + localStorage |
| Estilos | Tailwind CSS v4 |
| Audio futuro | ElevenLabs API |
| Auth futuro | Supabase Auth |
| Pagos | Systeme.io (ya lo tienes) |
| Deploy | Vercel (free tier) |

## Estructura

```
src/
├── app/
│   ├── page.tsx              # Entry: redirige a onboarding o home
│   ├── onboarding/page.tsx   # 4 pasos: welcome → niño → perfil → listo
│   ├── home/page.tsx         # Mapa de los 5 mundos + stats
│   ├── semana/[id]/
│   │   ├── page.tsx          # Tabs de la semana
│   │   ├── ClaseTab.tsx      # Historia + posturas + relajación
│   │   ├── PadresTab.tsx     # Módulo IS + micro-prácticas
│   │   └── MaterialesTab.tsx # Arte + objeto físico + PDFs
│   ├── progreso/page.tsx     # Historial de sesiones
│   ├── materiales/page.tsx   # Kit físico completo
│   └── perfil/page.tsx       # Perfil sensorial del niño
└── lib/
    ├── data/course.ts        # TODO el contenido tipado (5 semanas)
    ├── store.ts              # Estado global Zustand
    └── utils.ts              # Helpers
```

## Instalación

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
```

## Deploy en Vercel

```bash
npm i -g vercel
vercel --prod
```

## Integrar audio ElevenLabs

1. Crear cuenta en elevenlabs.io
2. Crear voz "Kawa" (cálida, suave, como cuento)
3. Generar MP3s por semana: historia / posturas / respiración / relajación
4. Guardar en `public/audio/semana-1/historia.mp3` etc.
5. Conectar en ClaseTab con <audio> element

## Conectar Systeme.io

Webhook en Systeme → `https://tu-app.vercel.app/api/webhook-systeme`
El webhook crea el usuario en Supabase con el plan comprado.

## Próximo paso

- [ ] Añadir iconos PWA en `public/icons/`
- [ ] Instalar next-pwa para service worker offline
- [ ] Generar primeros audios con ElevenLabs
- [ ] Configurar Supabase Auth
- [ ] Conectar Systeme.io webhook
