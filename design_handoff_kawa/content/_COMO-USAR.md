# Cómo usar estos archivos

Estos archivos son los **datos** de tu app (separados del diseño visual). Editarlos NO rompe la
interfaz: solo cambia el contenido.

## Dónde van en tu proyecto Next.js
Copia las carpetas a la raíz de tu proyecto `kawa-app`:

```
kawa-app/
  content/
    elements.ts
    poses.ts
    profiles.ts
    breaths.ts
    resources.ts
    story.ts
    weeks.ts        <-- el que más vas a editar
  hooks/
    useAudioPlayer.ts
  public/
    characters/     <-- aquí van los PNG de Kawa (carpeta assets-personaje)
    audio/          <-- aquí van los .mp3 de la historia
    poses/          <-- ilustraciones de posturas (por diseñar)
    profiles/       <-- ilustraciones de perfiles (por diseñar)
```

> Atajo: pega esta carpeta `content/` y dile a Claude Code:
> *"Usa estos archivos de /content como fuente de datos de la app y conéctalos a las pantallas."*

## Para editar la información de una semana
Abre `content/weeks.ts` y cambia los valores (título del desafío, posturas, nota del adulto…).
Para una semana nueva, copia un bloque `{ ... }` y cámbialo. Guarda → la app se actualiza.

## Para agregar los audios de la historia
1. Sube los `.mp3` a `public/audio/`.
2. Abre `content/story.ts` y escribe la ruta en `fullAudioSrc` (capítulo completo) y en cada
   `parts[].audioSrc` (cada parte por separado). Ejemplo: `/audio/cap1-parte1.mp3`.
3. El reproductor usa `hooks/useAudioPlayer.ts`: un botón para el capítulo completo y un botón
   por cada parte. La barra de progreso se mueve sola con el audio.

Mientras no tengas un audio, deja `audioSrc: ''` y ese botón aparecerá deshabilitado.
