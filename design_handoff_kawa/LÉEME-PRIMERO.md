# 📌 LÉEME PRIMERO — Instrucción maestra para Claude Code

> **Para la persona:** abre VS Code, instala la extensión **Claude Code**, abre la carpeta
> `design_handoff_kawa` y **pega el bloque de abajo** (entre las líneas) en el chat de Claude Code.
> Eso es todo. Está escrito para que la IA construya la app sola, paso a paso.

---

## ✂️ COPIA DESDE AQUÍ ───────────────────────────────────

Hola. Vas a recrear una app móvil llamada **Kawa** (yoga y regulación emocional para niños/as)
como un proyecto **Next.js + TypeScript + Tailwind** listo para desplegar en **Vercel**.
Soy principiante: ve paso a paso, explícame en español qué haces y no asumas conocimientos.

**FUENTE DE LA VERDAD — léela antes de escribir nada:**
1. `prototipo-ejecutable/Kawa - Prototipo.dc.html` — el prototipo COMPLETO. Contiene TODO el diseño
   real: markup, estilos (inline) y la lógica (al final, dentro de `<script type="text/x-dc">`,
   en la clase `Component`). **Trátalo como la especificación exacta a copiar pixel-perfect.**
   - Ese archivo usa un runtime propio de prototipado (`support.js`, `<x-dc>`, `<sc-if>`,
     `<sc-for>`, `{{ }}`, clase `DCLogic`). **NO portes ese runtime.** Es solo el formato del
     prototipo. Tú reescribes el mismo resultado con React/Next + Tailwind normales.
   - Para VER cómo se ve: abre ese .html con la extensión Live Server (ya incluí `support.js`,
     `ios-frame.jsx` y la carpeta `img/` para que renderice).
2. `README.md` — design tokens (colores exactos, tipografía, sombras, radios), lista de pantallas,
   interacciones y comportamiento. Úsalo como referencia rápida.
3. `content/` — los DATOS ya tipados (semanas, posturas, perfiles, historia, recursos). Cópialos
   tal cual a `/content` del proyecto y conéctalos a la UI (no hardcodees textos en los componentes).
4. `hooks/useAudioPlayer.ts` — reproductor de audio ya hecho. Cópialo a `/hooks`.
5. `assets-personaje/` — los PNG del personaje Kawa. Cópialos a `/public/characters/`.

**STACK Y REGLAS:**
- Next.js (App Router) + TypeScript + Tailwind CSS.
- Fuentes con `next/font/google`: **Fredoka** (títulos/números) y **Nunito** (texto/botones).
- La app es **mobile-first**: encájala dentro de un marco tipo teléfono centrado (max-width ~402px,
  alto ~874px, esquinas redondeadas), igual que el prototipo. No hace falta el bezel de iOS real.
- El **tema de color depende del elemento activo** (Tierra/Agua/Fuego/Aire/Espacio). Toma los
  valores de `content/elements.ts`. El elemento por defecto es **Tierra**.
- Reescribe los estilos inline del prototipo a clases Tailwind o `style={{}}`, conservando los
  MISMOS colores, tamaños, radios y sombras. La fidelidad visual es lo más importante.

**CONSTRUYE EN ESTE ORDEN (y muéstrame cada parte funcionando antes de seguir):**
1. Proyecto base corriendo en `localhost:3000` + marco de teléfono + fuentes + tema por elemento.
2. **Navegación inferior** (barra flotante) con sus dos modos: niño (Hoy · Practicar · Calma · Adultos)
   y adulto (Perfil · Recursos · Niño). Botón "Adultos"/"Niño" cambia de modo.
3. **Hoy** (modo niño): saludo "Hola, {nombre}", pregunta, Kawa flotando sobre colinas, y el
   **anillo del desafío** arriba a la derecha (ver comportamiento abajo) + las 3 tarjetas de ánimo.
4. **Practicar**: tarjeta héroe "La historia de Kawa" (abre el reproductor de historia), grilla de
   6 posturas (abre hoja de detalle), respiraciones, relajación.
5. **Calma**: animación de respiración + 3 accesos.
6. **Perfil** (modo adulto): banner del niño, "¿Cómo usas la app?", nota del perfil predominante,
   mosaico 2×2 de los 4 perfiles (el predominante resaltado con "Tu perfil"), botón del test.
7. **Recursos** (modo adulto): landing editorial con 5 cajones (imagen grande a la izquierda):
   Antes de empezar, Tips por perfil, Materiales, Protocolos, Biblioteca. Cada cajón abre una
   vista de detalle con un botón "‹ Recursos" para volver.
8. **Overlays**: reproductor de Historia, reproductor de Respiración, hoja de detalle de Postura,
   hoja del Sendero de 7 piedras (Desafío).

**COMPORTAMIENTO CLAVE (cópialo del prototipo, está en la clase `Component`):**
- **Anillo del desafío:** muestra el progreso como anillo (conic-gradient salvia/beige) con texto
  "3/7". A los ~6s de estar en Hoy, CRECE (`transform: scale(1.36)`, easing
  `cubic-bezier(.34,1.56,.64,1)`), aparece un halo verde y la palabra "DESAFÍO" curvada en media
  luna (SVG textPath). Dura ~2.9s y vuelve; se repite cada ~9s. Al tocarlo abre la hoja del sendero.
- **Sendero de 7 piedras:** completados = verde con ✓; hoy = nodo grande con cara de Kawa y aro
  dorado; futuros = blanco con borde. "Marcar día de hoy" sube el día (tope 7).
- **Reproductor de historia:** cronómetro que corre con play/pausa. Conéctalo a `useAudioPlayer`
  y a `content/story.ts` (botón de capítulo completo + lista de partes con su propio audio).

**ESTADO GLOBAL (usa React state o Zustand):**
`mode` (kid/adult), `screen`, `overlay`, `resourceTab`, `day` (0–7), `element`, `childName`.

**AL TERMINAR cada pantalla, compárala con el prototipo abierto en Live Server y ajústala hasta
que se vea igual.** Cuando todo esté, deja el proyecto listo para subir a GitHub y Vercel y dame
las instrucciones para hacerlo.

Empieza por el paso 1 y dime cuándo lo tienes corriendo.

## ───────────────────────────────────── HASTA AQUÍ ✂️
