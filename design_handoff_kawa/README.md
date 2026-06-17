# Handoff: Kawa — App de yoga infantil

## Resumen
Kawa es una app de yoga y regulación emocional para niños/as (3–4 años) acompañados por un adulto.
Tiene **dos modos**: modo niño/a (Hoy, Practicar, Calma) y modo adulto (Perfil, Recursos).
El contenido se organiza por **semanas**, cada una asociada a un **mundo/elemento** (Tierra, Agua, Fuego, Aire, Espacio),
e incluye una **historia narrada por capítulos** que se quiere reproducir como audio.

## 👉 Empieza por `LÉEME-PRIMERO.md`
Ese archivo trae la **instrucción maestra** para pegar en Claude Code. Este README es la referencia
técnica de apoyo (colores, pantallas, comportamiento).

## Sobre los archivos de este paquete
- `LÉEME-PRIMERO.md` — instrucción maestra para Claude Code (empieza aquí).
- `prototipo-ejecutable/` — el prototipo COMPLETO y **ejecutable**: ábrelo con Live Server en VS Code
  y verás la app real (incluye `support.js`, `ios-frame.jsx` e `img/`). Es la **fuente de la verdad**:
  su markup, estilos inline y la lógica (clase `Component` al final del .html) son la especificación
  exacta a copiar. El runtime de prototipado (`support.js`, `<x-dc>`, `DCLogic`) **NO se porta** — solo
  se recrea el mismo resultado con React/Next + Tailwind.
- `content/` — los datos tipados de la app (cópialos a `/content`).
- `hooks/useAudioPlayer.ts` — reproductor de audio (cópialo a `/hooks`).
- `assets-personaje/` — PNG del personaje Kawa, se reutilizan en producción (van a `/public/characters/`).

## Fidelidad
**Alta fidelidad (hi-fi).** Colores, tipografía, espaciados e interacciones son finales.
Recrear la UI pixel-perfect con la librería de estilos que elijas (recomendado Tailwind o CSS Modules).

---

## Stack recomendado (VS Code + Vercel)
- **Next.js (App Router) + TypeScript** — encaja perfecto con Vercel.
- **Tailwind CSS** para estilos (o CSS Modules; el prototipo usa estilos inline que mapean 1:1).
- **next/font/google** para las fuentes **Fredoka** (display) y **Nunito** (texto).
- **Contenido como datos** (archivos `.ts` tipados en `/content`) para poder editar las semanas sin tocar UI.
- **Audio** con `HTMLAudioElement` envuelto en un hook (`useAudioPlayer`).
- Deploy continuo desde **GitHub → Vercel**.

### Estructura de carpetas sugerida
```
kawa/
  app/
    (kid)/
      page.tsx                # Hoy
      practicar/page.tsx
      calma/page.tsx
    (adult)/
      perfil/page.tsx
      recursos/page.tsx
      recursos/[seccion]/page.tsx
    layout.tsx                # fuentes + tema por elemento
  components/
    MoodCard.tsx  ChallengeRing.tsx  ChallengePath.tsx
    ResourceCard.tsx  ProfileTile.tsx  BottomNav.tsx
    players/StoryPlayer.tsx  BreathPlayer.tsx  PoseSheet.tsx
  content/
    weeks.ts                  # info de cada semana (ver abajo)
    story.ts                  # capítulos + audio
    profiles.ts  poses.ts  elements.ts
  hooks/
    useAudioPlayer.ts
  public/
    characters/kawa-*.png     # desde assets-personaje/
    audio/...                 # mp3 de la historia
```

---

## Design tokens

### Tipografía
- **Display:** `Fredoka`, peso 500/600 (títulos, nombres de postura, números).
- **Texto:** `Nunito`, peso 700/800 (cuerpo, botones, etiquetas).
- Escala usada: kicker 10.5–12px (uppercase, letter-spacing 1.5px, weight 800);
  cuerpo 12.5–14px; títulos sección 17–19px; títulos pantalla 25–27px.

### Color — base
| Token | Hex | Uso |
|---|---|---|
| Texto principal | `#3D3A34` | Cuerpo |
| Texto cálido | `#5A4032` | Títulos modo niño |
| Texto tenue | `#8A857B` | Subtítulos |
| Superficie crema | `#FBF8F2` | Hoja de tarjetas en Hoy |
| Fondo adulto | `#F3EFE9` | Pantallas modo adulto |
| Verde profundo | `#2C4631` / `#34503A` | Headers adulto, botones |
| Verde salvia | `#9DB89A` / `#7E9A7A` | Progreso, colinas |
| Dorado | `#E4B05C` | Acentos del desafío |

### Color — los 5 mundos (elemento → tema del modo niño)
Cada elemento define `accent`, `sky` (gradiente de fondo) y dos tonos de colina:
| Elemento | accent | hill | hill2 | sky (gradiente 180°) |
|---|---|---|---|---|
| Tierra | `#C8825D` | `#7E9A7A` | `#9DB89A` | `#FBE3CF → #F7E7D6 → #F3EFE4` |
| Agua | `#3E83A0` | `#6FA8B0` | `#9AC6CB` | `#CFE6F0 → #DEEBEF → #EFF4F3` |
| Fuego | `#D2693F` | `#C98A5A` | `#E0AD7E` | `#FBD7C4 → #F8DCC8 → #F3ECE2` |
| Aire | `#8A6FA8` | `#A98FB0` | `#C6B4CE` | `#EAE3F0 → #EFEAF0 → #F3F0F2` |
| **Espacio** | `#4B54C6` | `#7B80CE` | `#A6A9DD` | `#D9DAF3 → #E4E3F1 → #EFEEF6` |

### Color — perfiles sensoriales
| Perfil | accent | tint |
|---|---|---|
| Muy Sensible | `#C07BA0` | `#F7E9F1` |
| Buscador/a | `#CE9226` | `#FBF1D6` |
| Bajo Registro | `#5F97BA` | `#E6F0F6` |
| Planif. Motora | `#7E9A7A` | `#EAF0E7` |

### Radios, sombras, espaciado
- Radios: tarjetas 18–24px, hojas inferiores 30px, píldoras 999px, iconos 14–18px.
- Sombra tarjeta: `0 1px 6px rgba(120,90,60,.07)`; elevada: `0 8px 24px rgba(52,80,58,.28)`.
- Padding pantalla: 22px horizontal; gap entre tarjetas 10–13px.
- Nav inferior flotante: `position:absolute; left/right:14px; bottom:22px; height:64px; radius:24px; blur(16px)`.

---

## Pantallas

### Modo niño/a
1. **Hoy** — saludo (`Hola, {nombre}`), pregunta "¿Cómo se siente tu cuerpo hoy?", ilustración de Kawa sobre colinas, y **3 tarjetas de ánimo**: *Necesito calma* (verde), *Quiero moverme* (ámbar), *Día difícil* (rosa). En la cabecera, arriba a la derecha, el **anillo del desafío** (ver Interacciones).
2. **Practicar** — tarjeta héroe "La historia de Kawa" (abre StoryPlayer), grilla de **6 posturas**, lista de **respiraciones** y de **relajación/música**.
3. **Calma** — modo S.O.S.: animación de respiración + accesos a respiración, sonidos y un cuento corto.

### Modo adulto
4. **Perfil** — banner del niño/a con foto, "¿Cómo usas la app?" (Familia/Profesional), nota del perfil predominante, **mosaico 2×2** de los 4 perfiles sensoriales (el predominante resaltado), botón "Hacer el test sensorial".
5. **Recursos** — landing **editorial** con cajones (imagen grande a la izquierda): *Antes de empezar, Tips por perfil, Materiales, Protocolos, Biblioteca*. Cada cajón abre una vista de detalle con botón "‹ Recursos".

### Reproductores / overlays
- **StoryPlayer** (pantalla completa, verde): tiempo, ilustración flotante, título de capítulo, barra de progreso, controles play/pausa.
- **BreathPlayer** (verde claro): círculos que "respiran" (escala), "Inhala 4 · Exhala 4".
- **PoseSheet** (hoja inferior): imagen, etiqueta, nombre, descripción, botón "Practicar postura".
- **ChallengeSheet** (hoja inferior): el **sendero de 7 piedras** + "Marcar día de hoy".

---

## Interacciones & comportamiento

### Anillo del desafío (cabecera de Hoy) — importante
- Muestra el progreso como **anillo cónico** (`conic-gradient` salvia/beige) con el texto `3/7` al centro. Tamaño base 46px.
- **Animación de atención:** a los ~6s de estar en Hoy, el anillo **crece** (`transform: scale(1.36)`, transición 0.55s `cubic-bezier(.34,1.56,.64,1)`), aparece un halo verde y el texto **"DESAFÍO" curvado en media luna** (SVG `textPath` sobre arco cuadrático). Se mantiene ~2.9s y vuelve. Se repite en bucle cada ~9s.
- Al **tocarlo** abre el **ChallengeSheet** (sendero de 7 piedras).
- Se usa `transform`, no cambio de tamaño real, para no desplazar la cabecera.

### Sendero de 7 piedras (ChallengeSheet)
- 7 nodos sobre una línea punteada. Completados = salvia con ✓; **hoy** = nodo mayor con la cara de Kawa y aro dorado; futuros = blanco con borde. Etiquetas L M X J V S D.
- "Marcar día de hoy" incrementa el día (tope 7).

### Navegación / transiciones
- Tarjetas con `style-hover: translateY(-2px)`.
- Respiración/breathe: keyframe escala 0.82↔1.1, 8s, infinito.
- Kawa flotando: keyframe translateY 0↔-7px, 6s.

---

## Estado (state)
- `mode`: 'kid' | 'adult'
- `screen`: 'home' | 'practice' | 'calm' | 'profile' | 'resources'
- `overlay`: null | 'story' | 'breath' | 'pose' | 'challenge'
- `resourceTab`: 'home' | 'antes' | 'tips' | 'materials' | 'protocols' | 'library'
- `day`: 0–7 (progreso del desafío)
- `element`: 'Tierra' | 'Agua' | 'Fuego' | 'Aire' | 'Espacio' (define el tema de color)
- `childName`: string
- Reproductor: `elapsed` (segundos), `playing` (bool)

---

## Contenido por semana (a iterar)
Modela cada semana como dato. Ejemplo de forma sugerida:
```ts
// content/weeks.ts
export type Week = {
  id: number;
  element: 'Tierra'|'Agua'|'Fuego'|'Aire'|'Espacio';
  title: string;          // "7 días de raíces"
  focus: string;          // "Postura Montaña cada mañana"
  poses: PoseId[];        // ids hacia content/poses.ts
  breaths: BreathId[];
  materials: Material[];
  adultNote: string;
  chapter: ChapterId;     // hacia content/story.ts
};
```

## Historia + audios (objetivo principal de la siguiente fase)
Quieres **un audio para la historia completa** y **un audio por cada parte/capítulo**. Modela así:
```ts
// content/story.ts
export type StoryPart = {
  id: string;
  title: string;          // "La semilla que encontró sus raíces"
  duration: number;       // segundos
  audioSrc: string;       // "/audio/cap1-parte1.mp3"
  suggestedPose?: PoseId; // "Montaña"
};
export type Chapter = {
  id: string;
  title: string;          // "Cap. 1"
  fullAudioSrc: string;   // "/audio/cap1-completo.mp3"  (historia entera)
  parts: StoryPart[];     // cada parte con su propio audio
};
```
- Coloca los `.mp3` en `/public/audio/`.
- `StoryPlayer` recibe un `Chapter`: botón "Reproducir capítulo completo" (`fullAudioSrc`) y una lista de partes, cada una reproducible por separado (`parts[i].audioSrc`).
- Hook `useAudioPlayer(src)` que exponga `{ playing, currentTime, duration, toggle, seek }` con un `HTMLAudioElement` y eventos `timeupdate`/`ended`. La barra de progreso del player se ata a `currentTime/duration`.
- Persistir la posición en `localStorage` por `partId` para retomar.

---

## Assets
- `assets-personaje/kawa-base.png` — Kawa neutro (anillo, respiración, sendero).
- `kawa-inicio.png` — Kawa saludando (Hoy).
- `kawa-catarsis.png`, `kawa-desequilibrio.png` — íconos de ánimo.
- `kawa-guardian.png` — tarjeta historia.
- `kawa-ensenanza.png` — nota del adulto.
- Faltan por diseñar: ilustraciones reales para los cajones de Recursos y las tiles de perfiles (en el prototipo son placeholders rayados con etiqueta "imagen").

## Archivos de referencia
- `prototipo-ejecutable/Kawa - Prototipo.dc.html` — prototipo completo (todas las pantallas y overlays). Ábrelo con Live Server.
