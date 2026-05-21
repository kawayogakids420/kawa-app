// ─── TYPES ────────────────────────────────────────────────────────────────────

export type SensoryProfile = 'sensible' | 'buscador' | 'bajo_registro' | 'motor'

export interface ProfileAdaptation {
  icon: string
  name: string
  color: string
  bgColor: string
  tips: string[]
}

export interface Posture {
  id: string
  emoji: string
  name: string
  magicName: string
  storyNarration: string
  howTo: string
  duration: string
  sensoryBenefits: string[]
  profiles: Record<SensoryProfile, string>
}

export interface Song {
  name: string
  lyrics: string[]
  howToUse: string
  rhythm: string
}

export interface StoryAct {
  title: string
  text: string
}

export interface Story {
  inicio: StoryAct
  desequilibrio: StoryAct
  accion: StoryAct
  catarsis: StoryAct
  ensenanza: StoryAct
}

export interface SessionMoment {
  duration: string
  name: string
  description: string
}

export interface Breathing {
  name: string
  storyNarration: string
  howTo: string
  benefit: string
  whenToUse: string
}

export interface ArtActivity {
  name: string
  materials: string[]
  steps: string[]
  therapeuticNote: string
}

export interface PhysicalObject {
  name: string
  description: string
  howToBuild: string
  therapeuticUse: string
}

export interface MicroPractice {
  moment: string
  toCalm: string
  toActivate: string
}

export interface ISModule {
  title: string
  duration: string
  systemWorked: string
  keyQuestion: string
  content: string[]
  parentTakeaway: string
}

export interface Week {
  id: number
  element: string
  elementEmoji: string
  guardian: string
  guardianSpecies: string
  color: string
  colorLight: string
  colorName: string
  symbol: string
  tactileObject: string
  teaching: string
  story: Story
  song: Song
  sessionStructure: {
    duration: string
    space: string
    preparation: string
    moments: SessionMoment[]
  }
  posturas: Posture[]
  breathing: Breathing
  relaxationScript: string
  profileAdaptations: Record<SensoryProfile, ProfileAdaptation>
  artActivity: ArtActivity
  physicalObject: PhysicalObject
  microPractices: MicroPractice[]
  isModule: ISModule
}

export const PROFILES: Record<SensoryProfile, { name: string; icon: string; color: string; bg: string; description: string }> = {
  sensible: {
    name: 'Muy Sensible',
    icon: '🌸',
    color: '#AD1457',
    bg: '#FCE4EC',
    description: 'Percibe el mundo con gran intensidad. Necesita predictibilidad y suavidad.'
  },
  buscador: {
    name: 'Buscador/a',
    icon: '⚡',
    color: '#E65100',
    bg: '#FFF3E0',
    description: 'Busca estímulos activamente. Necesita movimiento con propósito y estructura.'
  },
  bajo_registro: {
    name: 'Bajo Registro',
    icon: '🌊',
    color: '#0277BD',
    bg: '#E1F5FE',
    description: 'Necesita estímulos intensos para registrar su cuerpo. Alta activación.'
  },
  motor: {
    name: 'Planif. Motora',
    icon: '🧩',
    color: '#6A1B9A',
    bg: '#EDE7F6',
    description: 'Planifica movimientos en etapas. Necesita repetición y aprendizaje gradual.'
  }
}

// ─── POSTURAS BASE (compartidas o similares entre semanas) ────────────────────

const posturasBase: Posture[] = [
  {
    id: 'montana',
    emoji: '🏔️',
    name: 'Montaña',
    magicName: 'El Cuerpo que No Tiembla',
    storyNarration: 'Kawa se para por primera vez y descubre que cuando pone los pies bien plantados, nada la puede derribar. La montaña no corre porque ya está en el mejor lugar del mundo.',
    howTo: 'De pie, pies paralelos al ancho de las caderas. Brazos pegados al cuerpo. Empujar suavemente los pies contra el suelo. Espalda larga. Cara relajada. Mantener 5 respiraciones.',
    duration: '30–45 segundos, repetir 2 veces',
    sensoryBenefits: [
      'Propiocepción de toda la cadena posterior — organiza el sistema nervioso',
      'Mejora conciencia corporal en niños con bajo tono muscular',
      'La quietud activa registra en niños con bajo registro sensorial',
      'Postura base ideal para planificación motora: solo dos instrucciones'
    ],
    profiles: {
      sensible: 'Postura de aterrizaje más segura. Voz muy suave al guiarla.',
      buscador: 'Desafío: ¿quién aguanta más sin moverse? Añadir conteo en voz alta.',
      bajo_registro: 'Empujar MUY fuerte los pies. Golpear talones suavemente antes.',
      motor: 'Una sola instrucción a la vez: primero pies, luego espalda.'
    }
  },
  {
    id: 'arbol',
    emoji: '🌲',
    name: 'Árbol',
    magicName: 'Las Raíces que Suben',
    storyNarration: 'Un árbol no cae porque sus raíces llegan muy adentro de la tierra. Aunque se balancee con el viento, sus raíces lo sostienen.',
    howTo: 'De pie, un pie firme en el suelo. El otro pie en el tobillo o pantorrilla. Brazos como ramas. Mantener. Cuando se caen: reírse y volver a intentar.',
    duration: '15–20 segundos por lado. 2–3 intentos.',
    sensoryBenefits: [
      'Equilibrio estático — activa sistema vestibular y propioceptivo',
      'El caerse es parte del aprendizaje: desmitifica el error',
      'Concentración activa requerida — entrena atención sostenida',
      'Para planificación motora: comenzar con pie apenas levantado'
    ],
    profiles: {
      sensible: 'Junto al adulto tomados de la mano al principio.',
      buscador: 'Añadir reto de ojos cerrados. ¿Cuántos segundos?',
      bajo_registro: 'Brazo apoyado en pared para mayor presión propioceptiva.',
      motor: 'Solo levantar el talón primero — NO el pie completo todavía.'
    }
  }
]

const perfilesBase: Record<SensoryProfile, ProfileAdaptation> = {
  sensible: {
    icon: '🌸', name: 'Muy Sensible', color: '#AD1457', bgColor: '#FCE4EC',
    tips: [
      'Mostrar cada postura ANTES de pedirla — nunca sorprender',
      'Voz muy suave en toda la sesión',
      'Nunca forzar si hay incomodidad',
      'Ofrecer siempre la opción de observar primero',
      'Transiciones lentas entre posturas',
      'Celebrar cada intento, sin importar el resultado'
    ]
  },
  buscador: {
    icon: '⚡', name: 'Buscador/a', color: '#E65100', bgColor: '#FFF3E0',
    tips: [
      'Añadir desafíos de tiempo o conteo a cada postura',
      'Permitir movimientos más amplios y expresivos',
      'Usar el sonido HA para descargar energía',
      'Transiciones activas entre posturas',
      'Competir consigo mismo — superar el propio récord',
      'Insistir en la relajación final — es el mayor desafío para ellos'
    ]
  },
  bajo_registro: {
    icon: '🌊', name: 'Bajo Registro', color: '#0277BD', bgColor: '#E1F5FE',
    tips: [
      'Presión intensa en todas las posturas',
      'Más repeticiones para registrar la sensación',
      'Agregar peso: mantas durante Shavasana',
      'Cantar fuerte, no suave',
      'Antes de relajación: presión profunda en hombros',
      'Priorizar posturas de máxima activación propioceptiva'
    ]
  },
  motor: {
    icon: '🧩', name: 'Planif. Motora', color: '#6A1B9A', bgColor: '#EDE7F6',
    tips: [
      'Una sola instrucción a la vez',
      'Repetir cada postura mínimo 5 veces',
      'Enseñar en etapas — nunca pedir la postura completa al inicio',
      'Celebrar CADA etapa lograda',
      'Nunca pedir dos cosas al mismo tiempo',
      'Usar tarjetas visuales como guía física'
    ]
  }
}

// ─── SEMANA 1 — TIERRA ────────────────────────────────────────────────────────
const week1: Week = {
  id: 1,
  element: 'Tierra',
  elementEmoji: '🌱',
  guardian: 'Oma',
  guardianSpecies: 'la Tortuga',
  color: '#2D6A4F',
  colorLight: '#E8F5E9',
  colorName: 'Verde musgo',
  symbol: 'Espiral que baja',
  tactileObject: 'Piedra suave y fría',
  teaching: 'Quedarte quieto/a es la forma más poderosa de moverse',
  story: {
    inicio: {
      title: 'Kawa cae',
      text: 'Kawa era una semilla pequeñísima que vivía en la rama más alta del Árbol del Universo. Un día el viento la arrancó y cayó... cayó... cayó. Aterrizó en un lugar que no conocía, con tierra oscura y húmeda bajo sus pies. Quería correr, quería escapar, quería moverse. Pero sus pies no la sostenían. Cada vez que intentaba dar un paso, se caía.'
    },
    desequilibrio: {
      title: 'Los pies que no saben quedarse',
      text: '¡Quiero irme de aquí! gritó Kawa. Pero la tierra debajo de ella empezó a moverse más. Mientras más corría, más se hundía. La tierra no era su enemiga: era su maestra. Solo que Kawa todavía no lo sabía.'
    },
    accion: {
      title: 'Oma aparece',
      text: 'Entonces apareció Oma, una tortuga muy anciana con el caparazón lleno de musgo y los ojos color miel. Pequeña semilla, le dijo con voz lenta como la tierra misma, prueba esto: pon tus pies bien plantados. Siente el suelo. Respira hacia abajo. Kawa lo intentó. Puso un pie, luego el otro. Sintió algo frío y suave. Respiró. Y por primera vez... no se cayó.'
    },
    catarsis: {
      title: 'La montaña que siempre estuvo ahí',
      text: 'Soy una montaña, dijo Kawa en voz baja, sorprendida. Y era verdad: en ese momento era la cosa más firme del mundo. Lloraron juntas un poco, Kawa y la tierra, porque la tierra también había esperado mucho que alguien quisiera quedarse sobre ella.'
    },
    ensenanza: {
      title: 'El regalo de la raíz',
      text: 'Oma le entregó a Kawa una piedra suave, verde y fría. Llévala contigo, le dijo. Cuando tengas miedo, sostenla. La tierra siempre estará bajo tus pies, aunque no la veas.'
    }
  },
  song: {
    name: 'Los Pies de Oma',
    lyrics: [
      'Mis pies, mis pies, tocan la tierra hoy,',
      'soy una semilla que aprendió a estar.',
      'Oma me enseña con voz de raíz:',
      '"quedarte quieto/a es empezar."',
      '',
      'Montaña, montaña, nada te mueve,',
      'yo también soy montaña aquí.',
      'Respiro hacia abajo, la tierra me bebe,',
      'y Kawa sonríe porque aprendí.'
    ],
    howToUse: 'Cantar en ronda sentados. Al llegar al verso "Montaña, montaña" todos se ponen de pie en Postura Montaña y la mantienen mientras cantan.',
    rhythm: 'Lento y pesado como pasos de tortuga. 4/4, un golpe suave en el suelo con el pie cada dos tiempos.'
  },
  sessionStructure: {
    duration: '40–50 minutos',
    space: 'En el piso, con colchonetas o mantas. Descalzos siempre.',
    preparation: 'Cada niño elige una piedra pequeña real. La sostiene durante la sesión. Música suave de bosque o silencio. Luz natural si es posible.',
    moments: [
      { duration: '5 min', name: 'Llegada de Kawa', description: 'Narrar el INICIO en voz baja. Mostrar el muñeco de Kawa. El niño sostiene su piedra.' },
      { duration: '5 min', name: 'Jalea de Tierra', description: 'Sacudir el cuerpo muy despacio. Los pies NO se levantan del suelo en ningún momento.' },
      { duration: '3 min', name: 'Canción de Oma', description: 'Cantar "Los Pies de Oma". Primera vez sentados, segunda vez de pie en Montaña.' },
      { duration: '8 min', name: 'Posturas de la Tierra', description: 'Montaña → Postura del Indio → Gato I y II. Repetir cada postura 3 veces.' },
      { duration: '5 min', name: 'Árbol de los sueños', description: 'Postura del Árbol. Imaginar raíces que bajan al centro de la tierra.' },
      { duration: '5 min', name: 'Respiración de raíz', description: 'Respiración de globo. Manos en la pancita. Raíces que salen con cada exhale.' },
      { duration: '5 min', name: 'Oma entrega la piedra', description: 'Narrar la ENSEÑANZA. El adulto entrega la piedra. El niño cierra los ojos 30 segundos.' },
      { duration: '7 min', name: 'Shavasana de Kawa', description: 'Relajación guiada completa.' },
      { duration: '3 min', name: 'Arte y mapa', description: 'Dibujar en el diario. Mover Kawa al Mundo de la Tierra en el mapa.' }
    ]
  },
  posturas: [
    {
      id: 'montana', emoji: '🏔️', name: 'Montaña', magicName: 'El Cuerpo que No Tiembla',
      storyNarration: 'Kawa se para por primera vez y descubre que cuando pone los pies bien plantados, nada la puede derribar.',
      howTo: 'De pie, pies paralelos. Brazos pegados al cuerpo. Empujar los pies contra el suelo. Espalda larga. 5 respiraciones.',
      duration: '30–45 segundos, 2 veces',
      sensoryBenefits: ['Propiocepción de toda la cadena posterior', 'Organiza el sistema nervioso', 'Ideal para todos los perfiles como postura base'],
      profiles: { sensible: 'Voz muy suave. Postura más segura para empezar.', buscador: '¿Quién aguanta más sin moverse? Contar en voz alta.', bajo_registro: 'Empujar MUY fuerte los pies contra el suelo.', motor: 'Primero solo pies, luego agregar espalda.' }
    },
    {
      id: 'indio', emoji: '🧘', name: 'Postura del Indio', magicName: 'El Trono de Oma',
      storyNarration: 'Oma siempre se sienta así: con la paciencia de quien sabe que el tiempo no tiene prisa.',
      howTo: 'Sentados con piernas cruzadas. Espalda larga. Manos en las rodillas. Cantar OM tres veces sintiendo la vibración en el pecho.',
      duration: '45–60 segundos + 3 OM',
      sensoryBenefits: ['Propiocepción de caderas y columna', 'El OM activa el nervio vago', 'Postura más segura para hipersensibles'],
      profiles: { sensible: 'El OM puede ser muy suave, casi imperceptible.', buscador: 'OM fuerte y prolongado. Sentir la vibración.', bajo_registro: 'OM fuerte. Sentir vibración en el pecho con las manos.', motor: 'Sentar en manta doblada si las caderas están tensas.' }
    },
    {
      id: 'tortuga', emoji: '🐢', name: 'Tortuga', magicName: 'La Casa que Siempre Llevas',
      storyNarration: 'Oma le enseña a Kawa: cuando el mundo se vuelve demasiado grande, la tortuga se recoge dentro de sí misma.',
      howTo: 'Sentados, piernas en V. Doblar el cuerpo hacia adelante. Brazos por debajo de las rodillas. Cabeza inclinada. Respirar suave.',
      duration: '30–60 segundos. Sin presión de llegar al suelo.',
      sensoryBenefits: ['Flexión anterior activa el parasimpático', 'Postura de regulación de emergencia', 'Para ADHD: el recogimiento reduce la dispersión'],
      profiles: { sensible: 'Postura de refugio ideal. Usar en momentos difíciles.', buscador: '¿Cuántas respiraciones aguanta la tortuga?', bajo_registro: 'Manta suave encima para más input táctil.', motor: 'Solo inclinar el tronco primero, sin llegar al suelo.' }
    },
    {
      id: 'gato', emoji: '🐱', name: 'Gato I y II', magicName: 'La Espalda que Respira',
      storyNarration: 'Los gatos de la tierra mueven la espalda como olas de barro. Kawa aprende que el suelo puede bailar.',
      howTo: 'Cuatro apoyos. Gato I: exhalar y arquear la espalda hacia arriba. Gato II: inhalar y hundir la espalda. 5 ciclos lentos.',
      duration: '5 ciclos lentos (40–50 segundos)',
      sensoryBenefits: ['Propiocepción bilateral intensa', 'Conectar movimiento con respiración regula el SNA', 'El ritmo predecible organiza a neurodivergentes'],
      profiles: { sensible: 'Movimiento predecible y seguro. Ritmo lento.', buscador: 'Exagerar el movimiento. Gato dramático.', bajo_registro: 'Presionar activamente manos contra el suelo.', motor: 'Separar Gato I y II antes de combinarlos.' }
    },
    {
      id: 'arbol', emoji: '🌲', name: 'Árbol', magicName: 'Las Raíces que Suben',
      storyNarration: 'Un árbol no cae porque sus raíces llegan muy adentro. Aunque se balancee con el viento, sus raíces lo sostienen.',
      howTo: 'De pie, un pie en el suelo. El otro en el tobillo. Brazos como ramas. Cuando se caen: reírse y volver.',
      duration: '15–20 segundos por lado. 2–3 intentos.',
      sensoryBenefits: ['Equilibrio estático vestibular y propioceptivo', 'El caerse desmitifica el error', 'Entrena atención sostenida'],
      profiles: { sensible: 'Junto al adulto tomados de la mano.', buscador: 'Ojos cerrados. ¿Cuántos segundos?', bajo_registro: 'Brazo en pared para mayor presión.', motor: 'Solo levantar el talón primero.' }
    }
  ],
  breathing: {
    name: 'Respiración de Raíz — El Globo de la Tierra',
    storyNarration: 'Oma le enseñó a Kawa que la tierra respira muy despacio. Si pones la mano en tu pancita, puedes sentir tu propio mundo.',
    howTo: 'Manos en la pancita. Inhalar: pancita crece como globo (4 tiempos). Exhalar: globo se desinfla (4 tiempos). 6 veces.',
    benefit: 'Respiración diafragmática activa el parasimpático. El movimiento visible hace el concepto concreto para niños de 3-5 años.',
    whenToUse: 'Antes de dormir, antes de situaciones difíciles, en momentos de desregulación.'
  },
  relaxationScript: `Cierra los ojos suavemente y pon las manos en tu pancita.

Siente que estás acostado sobre la tierra más suave del mundo, como si el suelo fuera una cama de musgo verde. Kawa también está acostada aquí, a tu lado.

Siente tus pies pesados, muy pesados, como si fueran piedras tibias. Siente tus piernas pesadas. Tu pancita sube y baja, sube y baja. Oma la Tortuga está muy cerca, caminando despacio por el musgo.

Kawa susurra: Aquí estás seguro. La tierra te sostiene. No te vas a caer porque la tierra siempre está aquí.

Respira una vez más. Siente la piedra en tu mano. Esa piedra es tuya. Es el regalo de Oma. Es tu raíz, aunque estés en cualquier lugar del mundo.

Cuando estés listo, mueve los dedos de los pies. Mueve los dedos de las manos. Abre los ojos despacio.`,
  profileAdaptations: perfilesBase,
  artActivity: {
    name: 'Mi Piedra de Oma — La Raíz que Llevo Conmigo',
    materials: ['1 piedra suave (la de la sesión)', 'Pinturas acrílicas', 'Pinceles finos', 'Barniz transparente (opcional)'],
    steps: ['Lavar y secar la piedra — sentir su textura con ojos cerrados.', 'Elegir un color que represente cómo se sintió Kawa al enraizarse.', 'Pintar la piedra con ese color base. Dejar secar.', 'Dibujar una espiral que baja (símbolo de la tierra).', 'Barnizar cuando esté seco.'],
    therapeuticNote: 'La piedra pintada se convierte en objeto transicional: el niño puede llevarla al colegio como regulador portátil.'
  },
  physicalObject: {
    name: 'Kawa de Fieltro — La Semilla con Ojos',
    description: 'El muñeco de Kawa: semilla ovalada de 12–15 cm con ojos bordados. Se construye esta semana y viaja por el mapa las 5 semanas.',
    howToBuild: 'Opción 1 (fieltro): dos óvalos verdes cosidos con relleno de algodón. Opción 2 (amigurumi): crochet con lana verde. Opción 3: plantilla imprimible en cartulina.',
    therapeuticUse: 'Objeto transicional que puede abrazar durante las relajaciones o llevar en momentos difíciles.'
  },
  microPractices: [
    { moment: 'Al despertar', toCalm: 'Postura del Indio + 3 respiraciones de globo', toActivate: 'Montaña fuerte mientras se lavan los dientes' },
    { moment: 'Antes del colegio', toCalm: 'Sostener la piedra de Oma 20 segundos con ojos cerrados', toActivate: 'Árbol 15 segundos mientras esperan' },
    { moment: 'Momento difícil', toCalm: 'Tortuga: recogerse y respirar', toActivate: 'Gato I y II: 3 ciclos en el suelo' },
    { moment: 'Antes de dormir', toCalm: 'Respiración de raíz: 6 ciclos con manos en la pancita', toActivate: 'Shavasana breve (2 min)' }
  ],
  isModule: {
    title: 'Semana 1: ¿Qué es la Propiocepción y por qué la tierra calma?',
    duration: '10–12 minutos',
    systemWorked: 'Sistema Propioceptivo',
    keyQuestion: '¿Por qué mi hijo se calma cuando empuja cosas, abraza fuerte o está en cuatro apoyos?',
    content: [
      'La propiocepción es el sentido que le dice a tu cuerpo dónde está en el espacio. Viene de los músculos, tendones y articulaciones.',
      'Cuando hay desregulación, el sistema propioceptivo actúa como el "reset" del sistema nervioso. Por eso los abrazos fuertes y el cuatro apoyos calman.',
      'Las posturas de tierra (Montaña, Gato, Postura del Indio) dan input propioceptivo intenso y predecible.',
      'El peso de estar en el suelo y la presión en los isquiones son los más reguladores.',
      'Para niños con ADHD, autismo o bajo registro: las actividades de "heavy work" son medicina preventiva.'
    ],
    parentTakeaway: 'Esta semana: 5 minutos de actividad propioceptiva ANTES del colegio. Observa si la transición es más suave.'
  }
}

// ─── SEMANA 2 — AGUA ──────────────────────────────────────────────────────────
const week2: Week = {
  id: 2,
  element: 'Agua',
  elementEmoji: '💧',
  guardian: 'Iris',
  guardianSpecies: 'el Pulpo',
  color: '#0277BD',
  colorLight: '#E1F5FE',
  colorName: 'Azul profundo',
  symbol: 'Ola que regresa',
  tactileObject: 'Tela azul suave',
  teaching: 'Fluir no es rendirse — es la forma más inteligente de moverse',
  story: {
    inicio: {
      title: 'El océano tormentoso',
      text: 'Con su piedra de tierra en la mano, Kawa llegó a la orilla de un océano enorme. El agua era de todos los azules que existen. Era bellísima. Pero de repente, una tormenta comenzó a crecer desde adentro del mar. Las olas se hacían cada vez más grandes. Kawa quería escapar.'
    },
    desequilibrio: {
      title: 'No se puede parar una ola',
      text: '¡Que pare! ¡Que se calme! gritó Kawa, empujando el agua con los brazos. Pero cuanto más empujaba, más grande se hacía la ola. El mar no era su enemigo: era un espejo. Le mostraba a Kawa que ella también tenía tormentas adentro.'
    },
    accion: {
      title: 'Iris cambia de color',
      text: 'Entonces salió del fondo del océano Iris, el Pulpo Arcoíris. Iris tenía ocho brazos y cambiaba de color según lo que sentía: azul cuando estaba tranquilo, rojo cuando tenía miedo, amarillo cuando estaba alegre. Las olas no paran, dijo Iris, pero tú puedes aprender a moverte con ellas. Mira: así. Iris empezó a ondular su cuerpo como las olas. No resistía. Solo fluía.'
    },
    catarsis: {
      title: 'Kawa llora en el agua',
      text: 'Kawa intentó fluir. Al principio se caía. Luego se reía. Y en algún momento entre una ola y la siguiente, Kawa lloró. Lloró las cosas que tenía guardadas que se habían vuelto tormentas adentro. El océano recibió sus lágrimas sin asustarse.'
    },
    ensenanza: {
      title: 'El regalo de Iris',
      text: 'Iris le entregó a Kawa una pequeña tela azul. Cuando sientas que algo dentro de ti es demasiado grande, le dijo, no lo empujes. Ondula con él. Las emociones son olas: llegan y se van. Ninguna dura para siempre.'
    }
  },
  song: {
    name: 'La Ola de Iris',
    lyrics: [
      'Soy una ola que va y que viene,',
      'nada me para, nada me detiene.',
      'Iris me enseña con ocho colores:',
      'las olas no asustan, son mis amores.',
      '',
      'Fluyo, fluyo, no me resisto,',
      'soy agua que baila por donde ha visto.',
      'Respiro shhh, respiro shhh,',
      'la calma más grande vive en mí.'
    ],
    howToUse: 'Durante la Jalea de Agua y la Respiración Estrella. En el "shhh" todos exhalan juntos. Agitar tela azul suavemente.',
    rhythm: 'Ondulado, 3/4 como una cuna. El cuerpo se balancea de lado a lado.'
  },
  sessionStructure: {
    duration: '40–50 minutos',
    space: 'En el piso. Un bol con agua en el centro si es posible.',
    preparation: 'Un bol pequeño de agua en el centro. Tela azul disponible. Sonidos de agua de fondo (opcional).',
    moments: [
      { duration: '5 min', name: 'El océano de Kawa', description: 'Narrar INICIO y DESEQUILIBRIO. Todos tocan el agua del bol.' },
      { duration: '3 min', name: 'Jalea de Agua', description: 'Jalea fluida: el cuerpo es agua. Lento, ondulado.' },
      { duration: '3 min', name: 'Canción de Iris', description: 'Cantar. En cada shhh todos exhalan juntos.' },
      { duration: '10 min', name: 'Posturas del Agua', description: 'Postura del Niño → Mariposa → Gato fluido → Cobra.' },
      { duration: '5 min', name: 'Puente y Ola', description: 'Puente: la ola más grande de Kawa. Subir y bajar 3 veces.' },
      { duration: '5 min', name: 'Respiración Estrella', description: 'Inhalar 4, exhalar 6 con shhh. Todos juntos.' },
      { duration: '5 min', name: 'Iris entrega la tela', description: 'Narrar CATARSIS y ENSEÑANZA. El adulto entrega la tela azul.' },
      { duration: '7 min', name: 'Shavasana del Océano', description: 'Relajación guiada.' },
      { duration: '3 min', name: 'Diario y mapa', description: 'Dibujar. Mover Kawa al Mundo del Agua.' }
    ]
  },
  posturas: [
    {
      id: 'postura_nino', emoji: '🧒', name: 'Postura del Niño', magicName: 'El Caracol del Fondo del Mar',
      storyNarration: 'En las profundidades del océano hay caracoles que se enrollan cuando las tormentas llegan. Adentro de su concha, todo está quieto.',
      howTo: 'Sentarse sobre los talones. Tronco hacia adelante. Frente al suelo. Brazos a los lados. Respirar suave 1–2 minutos.',
      duration: '60–90 segundos.',
      sensoryBenefits: ['Flexión anterior activa el parasimpático', 'Postura de regulación de emergencia', 'El adulto con mano en la espalda amplifica el efecto'],
      profiles: { sensible: 'Postura de refugio ideal. Usar libremente.', buscador: 'Contar respiraciones en voz alta.', bajo_registro: 'Manta encima para más input táctil.', motor: 'Frente en manta doblada si no llega al suelo.' }
    },
    {
      id: 'mariposa', emoji: '🦋', name: 'Mariposa', magicName: 'La Raya que Baila en el Agua',
      storyNarration: 'Las rayas del océano de Iris bailan con las corrientes: sus alas suben y bajan sin esfuerzo.',
      howTo: 'Sentados, plantas de pies unidas. Manos en los pies. Mover rodillas arriba y abajo como alas. 15 veces. Luego mantener quieto.',
      duration: '15 aleteos + 30 segundos quieto',
      sensoryBenefits: ['Apertura de caderas — libera tensión', 'Movimiento rítmico regula el vestibular', 'Ideal para antes de dormir'],
      profiles: { sensible: 'Movimiento suave y predecible.', buscador: 'Contar los aleteos, competir consigo mismo.', bajo_registro: 'Aletear fuerte y dramático.', motor: 'Empezar solo con pies juntos, sin inclinarse.' }
    },
    {
      id: 'cobra', emoji: '🐍', name: 'Cobra', magicName: 'La Serpiente que Sale del Mar',
      storyNarration: 'Cuando las olas se calman, una cobra sube desde el fondo, abre el pecho y mira hacia la luz del sol.',
      howTo: 'Boca abajo. Manos bajo los hombros. Inhalar y levantar el pecho despacio. Hombros atrás. Mirar hacia arriba. Repetir 3 veces.',
      duration: '3 repeticiones, 20–30 segundos cada una',
      sensoryBenefits: ['Apertura de pecho contrarresta postura de cierre', 'Fortalece musculatura paravertebral', 'Activa energía después de posturas de calma'],
      profiles: { sensible: 'Solo levantar la cabeza y el pecho levemente.', buscador: 'Empujar fuerte con las manos, extensión máxima.', bajo_registro: 'Cobra con empuje máximo de manos.', motor: 'Primero solo cabeza, luego agregar el pecho.' }
    },
    {
      id: 'puente', emoji: '🌉', name: 'Puente', magicName: 'La Gran Ola de Kawa',
      storyNarration: 'Kawa aprendió a hacer la ola más grande: su propio cuerpo conecta el fondo del mar con la superficie.',
      howTo: 'Acostado boca arriba. Rodillas dobladas, pies planos. Inhalar y subir caderas hacia el cielo. Mantener 5 respiraciones. Bajar despacio.',
      duration: '3 repeticiones, 20–25 segundos cada una',
      sensoryBenefits: ['Apertura de pecho y caderas', 'Propiocepción intensa en pies y muslos', 'Para Bajo Registro: muy activante'],
      profiles: { sensible: 'Ritmo lento con música suave.', buscador: 'Contar hasta 10. Subir y bajar varias veces.', bajo_registro: '5–6 repeticiones para mayor activación.', motor: 'Primero solo doblar rodillas, luego subir caderas.' }
    }
  ],
  breathing: {
    name: 'Respiración Estrella — La Ola que Regresa',
    storyNarration: 'Iris le enseñó a Kawa que las estrellas de mar respiran distinto: inhalan 4 tiempos y exhalan 6 con un shhh suave.',
    howTo: 'Inhalar por la nariz 4 tiempos. Exhalar por la boca con shhh durante 6 tiempos. 5–6 ciclos. El adulto cuenta junto con el niño.',
    benefit: 'La exhalación prolongada activa el nervio vago directamente. El sonido shhh añade vibración que amplifica el efecto vagal.',
    whenToUse: 'Momento de crisis, antes de situaciones difíciles, como práctica diaria preventiva.'
  },
  relaxationScript: `Cierra los ojos. Pon la tela azul sobre tu pecho si tienes una.

Imagina que estás flotando en el océano más tranquilo del mundo. El agua es tibia y azul. No necesitas hacer nada. El océano te sostiene.

Kawa está flotando a tu lado. Sus ojos están cerrados y tiene una sonrisa pequeña. Ya no tiene miedo del océano. Aprendió que las olas llegan y se van.

Siente cómo tu cuerpo flota... tus pies flotan... tus manos flotan...

Iris nada muy cerca, brillando de un azul suave. Te cuida sin que tengas que pedirle nada.

Cada vez que exhalas, escuchas el shhh del mar. El mar dice shhh porque sabe que todo está bien.

Cuando estés listo, mueve los dedos. Abre los ojos despacio.`,
  profileAdaptations: {
    sensible: { icon: '🌸', name: 'Muy Sensible', color: '#AD1457', bgColor: '#FCE4EC', tips: ['Esta semana es perfecta — las posturas de calma son su especialidad', 'Tela azul: ofrecer, no imponer', 'Postura del Niño: postura de refugio', 'Shhh puede ser muy bajo, casi un susurro', 'Evitar cambios bruscos entre posturas', 'Bol de agua: si hay rechazo al tacto, respetar'] },
    buscador: { icon: '⚡', name: 'Buscador/a', color: '#E65100', bgColor: '#FFF3E0', tips: ['Puente: mantener más tiempo, contar hasta 10', 'Cobra: empujar fuerte con las manos', 'Jalea de Agua: movimiento exagerado', 'Shhh bien fuerte — catártico', 'Mariposa: contar aleteos', 'Agregar transiciones activas entre posturas'] },
    bajo_registro: { icon: '🌊', name: 'Bajo Registro', color: '#0277BD', bgColor: '#E1F5FE', tips: ['Puente y Cobra son sus posturas estelares', 'Cobra: empujar MUY fuerte, extensión máxima', 'Bol de agua: tocar, agitar, meter las manos', 'Shhh fuerte y dramático', 'Puente: 5–6 repeticiones', 'Tela: enrollarse en ella para más presión'] },
    motor: { icon: '🧩', name: 'Planif. Motora', color: '#6A1B9A', bgColor: '#EDE7F6', tips: ['Cobra: primero solo cabeza, luego pecho', 'Puente: primero doblar rodillas, luego subir', 'Mariposa: empezar sin inclinarse', 'Gato fluido: separar antes de combinar', 'Instrucción UNA a la vez', 'Repetir 5 veces mínimo antes de pasar'] }
  },
  artActivity: {
    name: 'El Mapa de Emociones de Iris',
    materials: ['Plato de papel circular', '8 tiras de papel (brazos)', 'Pinturas de 8 colores', 'Ojos de plástico o dibujados'],
    steps: ['Pintar el plato de azul — la cabeza de Iris.', 'A cada brazo: un color y una emoción.', 'Decorar cada brazo con la textura de esa emoción.', 'Pegar los brazos. Agregar los ojos.'],
    therapeuticNote: 'Nombrar emociones en colores desarrolla inteligencia emocional en niños que no pueden verbalizarlas.'
  },
  physicalObject: {
    name: 'Tela Azul de Iris — La Ola Portátil',
    description: 'Trozo de tela suave azul de aprox. 50×50 cm. Objeto táctil-sensorial de la semana.',
    howToBuild: 'Comprar tela azul semitransparente, cortar en cuadrado. Opcional: bordar una pequeña ola.',
    therapeuticUse: 'Agitar durante la canción, envolverse durante el Shavasana, sostener en momentos difíciles.'
  },
  microPractices: [
    { moment: 'Al despertar', toCalm: '3 respiraciones Shhh en la cama', toActivate: 'Cobra suave 2 veces' },
    { moment: 'Transición difícil', toCalm: 'Postura del Niño con tela encima', toActivate: 'Puente 3 veces' },
    { moment: 'Momento emocional', toCalm: 'Shhh largo hasta que la ola pase', toActivate: 'Mariposa: 20 aleteos contando' },
    { moment: 'Antes de dormir', toCalm: 'Mariposa + Postura del Niño + 5 Shhh', toActivate: 'Cobra 2 veces + Puente 2 veces' }
  ],
  isModule: {
    title: 'Semana 2: El Sistema Nervioso y la Ventana de Tolerancia',
    duration: '10–12 minutos',
    systemWorked: 'Sistema Nervioso Autónomo',
    keyQuestion: '¿Por qué mi hijo se desregula tan rápido y tan fuerte?',
    content: [
      'La ventana de tolerancia es el rango en que el sistema nervioso puede aprender. Fuera de ella, el niño no puede escuchar ni aprender.',
      'La desregulación no es manipulación — es neurología. El sistema recibió más de lo que puede procesar.',
      'Las posturas de agua actúan sobre: nervio vago (respiración larga), input propioceptivo calmante, y estimulación vestibular organizada.',
      'La Respiración Estrella (4:6) es la herramienta más eficiente de regulación rápida disponible.',
      'El color del pulpo Iris es una herramienta de identificación emocional: ¿de qué color estás hoy?'
    ],
    parentTakeaway: 'Esta semana: observa qué señales corporales preceden a la desregulación. Esas señales son tu ventana para intervenir antes.'
  }
}

// ─── SEMANA 3 — AIRE ──────────────────────────────────────────────────────────
const week3: Week = {
  id: 3,
  element: 'Aire',
  elementEmoji: '💨',
  guardian: 'Inti',
  guardianSpecies: 'el Cóndor',
  color: '#6A1B9A',
  colorLight: '#EDE7F6',
  colorName: 'Morado viento',
  symbol: 'Espiral que sube',
  tactileObject: 'Pluma de ave o papel liviano',
  teaching: 'Expandirse es la forma más valiente de existir',
  story: {
    inicio: {
      title: 'El viento que empuja',
      text: 'Con su piedra y su tela, Kawa llegó a las Montañas del Viento. El aire allí era distinto: se movía en espirales, cantaba entre las rocas, se metía en los oídos. Era el lugar más libre del mundo. Pero también el más asustador. El viento empujaba a Kawa. La hacía tambalearse. Y Kawa, que acababa de aprender a enraizarse, sentía que sus raíces no alcanzaban.'
    },
    desequilibrio: {
      title: 'Doblarse o expandirse',
      text: '¡Párate! le gritó Kawa al viento. Pero el viento no escucha órdenes. El viento no conoce el miedo porque el miedo no puede volar. Kawa se encogió, hizo bolita, intentó hacerse pequeña para que el viento no la encontrara. Y entonces el viento se hizo más grande todavía.'
    },
    accion: {
      title: 'Inti abre las alas',
      text: 'Desde lo más alto de la montaña, Inti el Cóndor la vio. Inti era enorme, con alas negras y blancas que podían cubrir el sol. Bajó en círculos lentos y aterrizó frente a ella. Pequeña semilla, dijo con voz que sonaba a viento entre piedras, el secreto del aire no es resistirlo. Es abrirte. Haz esto: abre los brazos tanto como puedas. Más. Más todavía. Hasta que sientas que eres más grande que el miedo.'
    },
    catarsis: {
      title: 'El grito de Kawa',
      text: 'Kawa abrió los brazos. Los abrió más. Y de su boca salió un sonido que no sabía que tenía adentro: ¡HA! Fuerte, desde el estómago. El viento se detuvo un momento, sorprendido. Y Kawa también se sorprendió. Porque ese sonido era su fuerza, y su fuerza era más grande de lo que pensaba.'
    },
    ensenanza: {
      title: 'El regalo de Inti',
      text: 'Inti le entregó una pluma. Esta pluma es liviana porque confía en el viento, le dijo. No pesa porque no lucha. Llévala y recuerda: cuando algo te quiera doblar, ábrete.'
    }
  },
  song: {
    name: 'El HA de Inti',
    lyrics: [
      'Inti vuela alto, yo también puedo volar,',
      'abro mis brazos hasta no poder más.',
      '¡HA! dice el cóndor al borde del cielo,',
      '¡HA! digo yo y pierdo el miedo.',
      '',
      'Soy guerrero/a, soy guerrero/a,',
      'de la luz y del viento soy hecho/a.',
      '¡HA! ¡HA! ¡HA!',
      'El viento me lleva pero no me dobla.'
    ],
    howToUse: 'Cantar durante el Guerrero II. En cada ¡HA! todos exhalan fuerte. Puede hacerse cada vez más fuerte.',
    rhythm: 'Rítmico y poderoso, 4/4. En los HA se puede golpear el suelo con los pies.'
  },
  sessionStructure: {
    duration: '40–50 minutos',
    space: 'En el piso, con espacio para abrir brazos completamente. Si es posible: afuera.',
    preparation: 'Una pluma en el centro. Todos soplan la pluma para que vuele al inicio.',
    moments: [
      { duration: '5 min', name: 'El viento llega', description: 'Narrar INICIO. Soplar la pluma juntos. ¿A dónde va el viento?' },
      { duration: '4 min', name: 'Jalea del Viento', description: 'Jalea expansiva: brazos se abren, el cuerpo ocupa TODO el espacio.' },
      { duration: '3 min', name: 'Canción de Inti', description: 'Cantar "El HA de Inti". Practicar el HA juntos.' },
      { duration: '10 min', name: 'Posturas del Aire', description: 'Guerrero II → Triángulo → Gaviota. HA al cambiar de lado.' },
      { duration: '5 min', name: 'Barco y Marioneta', description: 'Barco: contar en voz alta. Marioneta: JA dramático.' },
      { duration: '5 min', name: 'Respiración HA', description: 'Inhalar brazos arriba, exhalar HA con brazos al frente. x5.' },
      { duration: '5 min', name: 'Inti entrega la pluma', description: 'Narrar ENSEÑANZA. Entregar la pluma. El niño la sopla.' },
      { duration: '7 min', name: 'Shavasana del Viento', description: 'Relajación guiada. La pluma sobre el pecho.' },
      { duration: '3 min', name: 'Diario y mapa', description: 'Dibujar. Mover Kawa al Mundo del Aire.' }
    ]
  },
  posturas: [
    {
      id: 'guerrero2', emoji: '⚔️', name: 'Guerrero II', magicName: 'Kawa Abre las Alas',
      storyNarration: 'Inti enseñó a Kawa la postura de los que no le temen al viento: piernas plantadas, brazos abiertos como alas.',
      howTo: 'Gran paso hacia atrás. Pie trasero perpendicular. Doblar rodilla delantera. Brazos horizontales. Mirar la mano delantera. ¡HA! al entrar.',
      duration: '20–30 segundos por lado. 2 veces por lado.',
      sensoryBenefits: ['Propiocepción intensa en piernas con carga', 'Sistema vestibular activado por posición asimétrica', 'Fortalece piernas, espalda y hombros'],
      profiles: { sensible: 'Mostrar antes de pedir. HA puede ser suave.', buscador: '¡Esta semana es para ellos! HA muy fuerte.', bajo_registro: 'Máxima presión en pies. Empujar el suelo activamente.', motor: 'Primero piernas, luego agregar brazos.' }
    },
    {
      id: 'triangulo', emoji: '🔺', name: 'Triángulo', magicName: 'El Rayo del Cóndor',
      storyNarration: 'Cuando Inti vuela en el viento, sus alas forman un triángulo perfecto. Es la figura más fuerte que existe.',
      howTo: 'Desde Guerrero II estirar pierna delantera. Inclinar el cuerpo lateralmente. Tocar el tobillo. Brazo contrario al cielo. 4 respiraciones.',
      duration: '15–20 segundos por lado',
      sensoryBenefits: ['Flexión lateral activa músculos profundos', 'Estira cadena lateral completa', 'Alta activación combinado con Guerrero II'],
      profiles: { sensible: 'Inclinación suave, sin llegar al tobillo si no puede.', buscador: 'Buscar la extensión máxima.', bajo_registro: 'Triángulo con máxima inclinación.', motor: 'Solo inclinación lateral primero, luego brazo arriba.' }
    },
    {
      id: 'gaviota', emoji: '🦅', name: 'Gaviota', magicName: 'El Vuelo de Inti',
      storyNarration: 'Para volar de verdad hay que confiar en una sola pata. El equilibrio viene de saber dónde está el centro.',
      howTo: 'De pie, levantar un pie. Brazos extendidos como alas. Mantener. Cuando se domine: inclinar levemente el tronco.',
      duration: '15–20 segundos por lado. 2 intentos.',
      sensoryBenefits: ['Equilibrio dinámico: vestibular y propioceptivo', 'Alta concentración — entrena atención', 'El caerse es parte del aprendizaje'],
      profiles: { sensible: 'Junto al adulto con contacto de manos.', buscador: '¿Cuántos segundos? Superar el propio récord.', bajo_registro: 'El esfuerzo de equilibrio los activa mejor.', motor: 'Solo levantar un pie — sin estirar el tronco todavía.' }
    },
    {
      id: 'barco', emoji: '🚢', name: 'Barco', magicName: 'La Nave del Viento',
      storyNarration: 'En el Mundo del Aire hay naves que vuelan usando el viento. Kawa construye la suya con su propio cuerpo.',
      howTo: 'Sentados. Levantar piernas y tronco formando una V. Brazos paralelos al suelo. El adulto puede sostener los pies al inicio.',
      duration: '10–15 segundos. 2–3 intentos.',
      sensoryBenefits: ['Máxima activación propioceptiva — core y caderas', 'Desafío de equilibrio que produce logro intenso', 'Para Bajo Registro: muy activante'],
      profiles: { sensible: 'Sin presión. Intentar es suficiente.', buscador: 'Objetivo de tiempo — superar el propio récord.', bajo_registro: 'Objetivo principal de la semana. Varios intentos.', motor: 'Primero solo levantar los pies, luego agregar tronco.' }
    },
    {
      id: 'marioneta', emoji: '🧸', name: 'Marioneta', magicName: 'Los Hilos que se Sueltan',
      storyNarration: 'Antes de volar, Inti le enseñó a Kawa a soltar. Eres una marioneta, pero tus hilos son de viento.',
      howTo: 'De pie. Inhalar brazos arriba. Exhalar con JA y caer desde la cintura. Cabeza, brazos y tronco cuelgan. Subir muy despacio. 3 veces.',
      duration: '3 repeticiones completas',
      sensoryBenefits: ['Inversión parcial aumenta flujo al cerebro', 'El JA vacía pulmones completamente', 'Movimiento vestibular y organizador'],
      profiles: { sensible: 'Bajar despacio. Sin presión de llegar lejos.', buscador: 'JA dramático y exagerado — catarsis real.', bajo_registro: 'Ampliar al máximo, bajar casi hasta el suelo.', motor: 'Practicar el sonido solo, luego agregar el movimiento.' }
    }
  ],
  breathing: {
    name: 'Respiración HA — El Grito del Viento',
    storyNarration: 'Inti enseñó a Kawa que el viento cuando es libre hace un sonido: ¡HA! Es el sonido de la fuerza que no tiene miedo.',
    howTo: 'De pie. Inhalar llevando brazos al cielo (4 tiempos). Exhalar con ¡HA! fuerte llevando brazos al frente. 3–5 repeticiones. Luego Respiración Estrella para bajar.',
    benefit: 'Vacía los pulmones completamente. Activa el sistema nervioso simpático de manera controlada. Para buscadores: satisface necesidad de intensidad.',
    whenToUse: 'Al inicio de sesiones de alta energía, cuando el niño necesita descargar tensión. Siempre seguir con Respiración Estrella.'
  },
  relaxationScript: `Cierra los ojos. Imagina que estás en la cima de la montaña más alta del mundo. Hay viento, pero ya no te asusta. Lo sientes en tu cara como una caricia fresca.

Kawa está parada a tu lado, con los brazos abiertos. Tiene la pluma de Inti en la mano y la suelta. La pluma vuela... vuela... vuela.

Siente tus brazos pesados a los lados del cuerpo. Tu pecho sube y baja.

Inti vuela muy alto, tan alto que parece una estrella. Te dice desde el viento: Hiciste bien. Abriste las alas cuando tenías miedo. Eso es valentía.

Siente la pluma en tu mano. Liviana. Sin esfuerzo. Así de liviano puede ser tu cuerpo cuando confía.

Respira suave. Cuando quieras, mueve los dedos. Abre los ojos despacio.`,
  profileAdaptations: {
    sensible: { icon: '🌸', name: 'Muy Sensible', color: '#AD1457', bgColor: '#FCE4EC', tips: ['Guerrero: mostrar antes, luego invitar', 'HA puede ser muy suave al principio', 'La activación puede generar ansiedad: ir más despacio', 'Gaviota: junto al adulto con contacto', 'Cerrar con Postura del Niño después de activas', 'Pluma: puede ser estimulante — ofrecer sin imponer'] },
    buscador: { icon: '⚡', name: 'Buscador/a', color: '#E65100', bgColor: '#FFF3E0', tips: ['¡Esta semana es la favorita del Buscador!', 'Guerrero + Triángulo en circuito continuo', 'HA: MUY fuerte. Es la descarga que necesitan', 'Barco: objetivo de tiempo', 'Marioneta: JA dramático', 'Insistir en la relajación completa'] },
    bajo_registro: { icon: '🌊', name: 'Bajo Registro', color: '#0277BD', bgColor: '#E1F5FE', tips: ['Guerrero II: máxima presión en pies', 'HA fuerte con todo el cuerpo', 'Barco: objetivo principal de la semana', 'Gaviota: el equilibrio es el input más intenso', 'Agregar saltos entre posturas', 'Marioneta: ampliar al máximo'] },
    motor: { icon: '🧩', name: 'Planif. Motora', color: '#6A1B9A', bgColor: '#EDE7F6', tips: ['Guerrero: primero piernas, luego brazos', 'Triángulo: solo inclinación primero', 'Gaviota: solo levantar un pie', 'Barco: primero solo pies, luego V completa', 'HA: practicar sonido solo, luego movimiento', '5 repeticiones mínimo por postura'] }
  },
  artActivity: {
    name: 'El Escudo de Kawa — Mi Fuerza en una Imagen',
    materials: ['Cartón resistente A3', 'Témperas o acrílicas', 'Marcadores gruesos', 'Brillantina dorada', 'Pluma pequeña real'],
    steps: ['Recortar el cartón en forma de escudo.', 'Dividir en 4 cuadrantes: ANIMAL / ELEMENTO / SUPERPODER / NOMBRE MÁGICO.', 'Pintar cada cuadrante.', 'Decorar con brillantina y pegar la pluma de Inti en el centro.'],
    therapeuticNote: 'El escudo es un objeto transicional que puede acompañar al niño a situaciones de estrés.'
  },
  physicalObject: {
    name: 'Pluma de Inti — La Ligereza que Se Lleva',
    description: 'Una pluma real de ave o decorativa de 15–20 cm.',
    howToBuild: 'Buscar en la naturaleza o comprar. Opcional: teñir la punta con acuarela morada. Atar un hilo para colgarla del mapa.',
    therapeuticUse: 'Soplar la pluma (input oral-motor). Hacer cosquillas suaves en brazos (input táctil-discriminativo).'
  },
  microPractices: [
    { moment: 'Al despertar', toCalm: '3 Estrellas (shhh) antes de levantarse', toActivate: 'Marioneta 3 veces en el cuarto' },
    { moment: 'Transición difícil', toCalm: 'Pluma: soplarla suave — activa el nervio vago', toActivate: 'HA: 3 veces fuerte seguido de 3 Estrellas' },
    { moment: 'Momento de enojo', toCalm: 'Marioneta suave: soltar el cuerpo y respirar', toActivate: 'HA fuerte para descargar' },
    { moment: 'Antes de dormir', toCalm: 'Gaviota 10 seg + Guerrero 15 seg + Estrella x5', toActivate: 'Shavasana con pluma sobre el pecho' }
  ],
  isModule: {
    title: 'Semana 3: Dieta Sensorial y Activación Consciente',
    duration: '10–12 minutos',
    systemWorked: 'Sistema Vestibular + Propioceptivo',
    keyQuestion: '¿Por qué mi hijo no puede quedarse quieto y cómo canalizo esa energía?',
    content: [
      'La dieta sensorial es una combinación planificada de actividades físicas que mantiene el sistema nervioso organizado.',
      'Para el niño buscador o de bajo registro, la activación consciente es medicina preventiva.',
      'Las posturas de aire dan el input propioceptivo y vestibular intenso que estos niños buscan de forma disruptiva.',
      'El sonido HA es una herramienta de descarga controlada: vacía CO2 y activa el nervio vago.',
      'La secuencia: activación (HA, Guerrero) → integración (Puente) → calma (Postura del Niño) es la dieta sensorial en miniatura.'
    ],
    parentTakeaway: 'Esta semana: identifica los momentos del día en que tu hijo más busca movimiento. Programa ahí una dosis de yoga de 5 minutos.'
  }
}

// ─── SEMANA 4 — FUEGO ─────────────────────────────────────────────────────────
const week4: Week = {
  id: 4,
  element: 'Fuego',
  elementEmoji: '🔥',
  guardian: 'Lumi',
  guardianSpecies: 'la Salamandra',
  color: '#BF360C',
  colorLight: '#FBE9E7',
  colorName: 'Naranja volcán',
  symbol: 'Espiral que transforma',
  tactileObject: 'Piedra naranja o cálida',
  teaching: 'El fuego no destruye — transforma',
  story: {
    inicio: {
      title: 'El volcán que tiembla',
      text: 'Con su piedra, su tela y su pluma, Kawa llegó al Mundo del Fuego exhausta. En este mundo todo era rojo y naranja. El suelo temblaba. Un volcán enorme brillaba a lo lejos. Y Kawa tuvo el miedo más grande de su vida. No era un miedo de caerse. Era un miedo de desaparecer.'
    },
    desequilibrio: {
      title: 'El fuego por dentro',
      text: 'No puedo seguir, dijo Kawa. Y se quedó quieta. No como la Montaña de Oma, que se queda quieta porque es fuerte. Kawa se quedó quieta porque ya no tenía energía. Y entonces algo extraño pasó: el volcán también se quedó quieto. Como si esperara.'
    },
    accion: {
      title: 'Lumi no teme al fuego',
      text: 'Lumi la Salamandra salió de entre las rocas calientes. Era pequeña, brillante, naranja y negra. Caminó directamente sobre la lava sin quemarse. ¿Cómo puedes hacerlo? preguntó Kawa. Porque soy fuego yo también, dijo Lumi. Kawa, pequeña semilla: tú también llevas fuego adentro. ¿Lo sientes en el pecho cuando algo te importa mucho? ¿Cuando amas a alguien? Eso es tu llama.'
    },
    catarsis: {
      title: 'La llama que no se apaga',
      text: 'Kawa puso la mano en el pecho. Y ahí estaba: calentita, pequeña, pero firme. Su llama. Había estado ahí todo el tiempo, aunque ella no la conocía. Lloró otra vez, pero diferente. No de miedo, sino de reconocerse.'
    },
    ensenanza: {
      title: 'El regalo de Lumi',
      text: 'Lumi le entregó una pequeña piedra naranja, cálida al tacto. Cuando sientas que se te apaga la llama, le dijo, pon esta piedra en el pecho. Recuerda que no necesitas que nadie te encienda. Tú ya eres fuego.'
    }
  },
  song: {
    name: 'Mi Llama Interior',
    lyrics: [
      'Tengo fuego en el pecho que no se apaga,',
      'es mi amor, es mi fuerza, es mi magia.',
      'Lumi me enseña con piel de volcán:',
      '"lo que te asusta también te da pan."',
      '',
      'Llama, llama, arde suavecito,',
      'no quemes a nadie — solo ilumina.',
      'Respiro el fuego, lo hago mío,',
      'y Kawa baila en el calor tibio.'
    ],
    howToUse: 'Cantar durante la Cobra y el Saludo al Sol. En "Llama, llama" poner las manos en el pecho.',
    rhythm: 'Suave y constante, 4/4. La canción del reconocimiento, no de la energía.'
  },
  sessionStructure: {
    duration: '45–55 minutos',
    space: 'En el piso. Luz cálida si es posible.',
    preparation: 'La piedra naranja de cada niño en el centro. Ambiente íntimo y silencioso.',
    moments: [
      { duration: '5 min', name: 'El volcán de Kawa', description: 'Narrar INICIO. Cada niño sostiene la piedra naranja.' },
      { duration: '3 min', name: 'Jalea del Fuego', description: 'Jalea lenta, ondulada como lava. No rápida.' },
      { duration: '3 min', name: 'Canción de Lumi', description: 'Cantar en voz suave. Todos con manos en el pecho.' },
      { duration: '10 min', name: 'Saludo al Sol', description: 'Montaña → brazos arriba → Marioneta → cuatro apoyos → Cobra → Postura del Niño → volver. 3 ciclos.' },
      { duration: '8 min', name: 'Posturas del Fuego', description: 'Cobra profunda → Guerrero I → Flor de Loto.' },
      { duration: '5 min', name: 'Respiración del Fuego', description: 'Técnica central. Luego Respiración Globo para bajar.' },
      { duration: '5 min', name: 'Lumi entrega la piedra', description: 'Narrar ENSEÑANZA. Piedra naranja sobre el pecho. 30 segundos de silencio.' },
      { duration: '8 min', name: 'Shavasana del Volcán', description: 'La más larga del curso. Con piedra en el pecho.' },
      { duration: '4 min', name: 'Diario y mapa', description: 'Dibujar la llama propia. Kawa avanza al último mundo.' }
    ]
  },
  posturas: [
    {
      id: 'cobra_profunda', emoji: '🐍', name: 'Cobra Profunda', magicName: 'La Llama que Sube',
      storyNarration: 'Lumi enseñó que el fuego siempre sube. La cobra del volcán sube desde el suelo buscando la luz del sol.',
      howTo: 'Boca abajo. Manos bajo los hombros. Inhalar profundo y subir el pecho lo más alto posible. Hombros atrás. Mirar al cielo. 3 respiraciones. Repetir 3 veces.',
      duration: '3 veces, 25–35 segundos cada una',
      sensoryBenefits: ['Máxima apertura torácica', 'Estimula el plexo solar', 'Alta activación propioceptiva en columna posterior'],
      profiles: { sensible: 'Cobra suave — solo levantar la cabeza levemente.', buscador: 'Extensión máxima con actitud de desafío.', bajo_registro: 'Empujar MUY fuerte con las manos.', motor: 'Primero solo cabeza, luego agregar pecho.' }
    },
    {
      id: 'guerrero1', emoji: '⚔️', name: 'Guerrero I', magicName: 'La Llama Conquistadora',
      storyNarration: 'El Guerrero I mira hacia arriba porque el guerrero del fuego no pelea con otros — pelea con sus propios miedos.',
      howTo: 'Un pie adelante doblado, otro atrás estirado. Caderas al frente. Brazos al cielo. Mirar hacia arriba. ¡HA! al entrar. Mantener 5 respiraciones.',
      duration: '20–25 segundos por lado, 2 veces',
      sensoryBenefits: ['Apertura de cadera y flexores', 'La extensión con brazos arriba abre la cavidad torácica', 'Mirar arriba estimula el vestibular en extensión'],
      profiles: { sensible: 'Ir despacio. HA suave.', buscador: 'HA fuerte. Contar los segundos.', bajo_registro: 'Énfasis en empujar el suelo con el pie adelante.', motor: 'Primero solo piernas, luego brazos al cielo.' }
    },
    {
      id: 'saludo_sol', emoji: '☀️', name: 'Saludo al Sol Simplificado', magicName: 'La Danza del Volcán',
      storyNarration: 'El volcán saluda al sol cada mañana con 5 movimientos que juntan todo lo que Kawa aprendió. Es el ritual más poderoso.',
      howTo: 'Montaña → brazos al cielo → Marioneta → cuatro apoyos → Cobra → Postura del Niño → volver a Montaña. 3 ciclos. Inhalar al subir, exhalar al bajar.',
      duration: '3 ciclos completos, ~3–4 minutos',
      sensoryBenefits: ['Integra todos los sistemas sensoriales', 'Coordinado con respiración entrena integración bilateral', 'Para planificación motora: logro motor más importante del curso'],
      profiles: { sensible: 'A su ritmo. Priorizar experiencia sobre forma.', buscador: 'Primer ciclo rápido, tercero lento.', bajo_registro: '5 ciclos en vez de 3.', motor: 'Enseñar un movimiento por vez. 5 repeticiones mínimo.' }
    },
    {
      id: 'flor_loto', emoji: '🌸', name: 'Flor de Loto', magicName: 'La Rosa que Nace del Fuego',
      storyNarration: 'En los volcanes más calientes crece la flor más hermosa. Nace del fuego porque no le teme.',
      howTo: 'Sentados con piernas cruzadas. Espalda muy larga. Manos en Namaste al corazón. Ojos cerrados si el niño puede. Respirar suave.',
      duration: '60–90 segundos de quietud',
      sensoryBenefits: ['Integración sensorial post-activación', 'Momento de introspección — desarrolla el self', 'Namaste al corazón activa conciencia interoceptiva'],
      profiles: { sensible: 'Postura más importante para ellos esta semana.', buscador: 'El mayor desafío — celebrar el logro.', bajo_registro: 'Antes: presión profunda en hombros (abrazo de oso).', motor: 'Postura más accesible de la semana.' }
    }
  ],
  breathing: {
    name: 'Respiración de Fuego Suave — La Llama que No Apaga',
    storyNarration: 'Lumi enseñó que el fuego no se alimenta de gritos: se alimenta de atención. Cuando le prestas atención a tu llama, crece suavemente.',
    howTo: 'Manos en el pecho. Inhalar por la nariz 4 tiempos (el fuego crece). Exhalar por la nariz 4 tiempos. 6 ciclos. En el último: retener 2 segundos al final de la inhalación.',
    benefit: 'La retención breve activa levemente el simpático de forma controlada, creando energía y presencia. La mano en el pecho activa la conciencia interoceptiva.',
    whenToUse: 'Cuando el niño se siente sin energía. Antes de actividades que requieren esfuerzo. Como ritual de reconocimiento al inicio o final del día.'
  },
  relaxationScript: `Cierra los ojos. Pon las dos manos en tu pecho, una encima de la otra. Siente si hay algo tibio ahí.

Hay algo tibio ahí. Siempre estuvo. Es tu llama.

Kawa está acostada también, con sus manos en su pecho de semilla. Lumi la Salamandra está cerca, brillando suavemente. El volcán ya no tiembla.

Siente la piedra naranja. Cálida. Como si guardara el sol adentro.

Tu pecho sube al inhalar. Baja al exhalar. Como una pequeña llama que danza.

Lumi dice: Eres fuego que piensa. Eres fuego que siente. Eres fuego que ama. Ningún viento puede apagarte porque eres tú quien decide arder.

Respira. Siente tu calor. Cuando estés listo, acaricia suavemente tu propio pecho. Luego abre los ojos despacio.`,
  profileAdaptations: {
    sensible: { icon: '🌸', name: 'Muy Sensible', color: '#AD1457', bgColor: '#FCE4EC', tips: ['Esta es la semana más emocional — puede haber llanto y está bien', 'Flor de Loto: postura más importante para ellos', 'Saludo al Sol: ir muy despacio', 'La piedra cálida es ideal para este perfil', 'El adulto puede cantar muy suavemente cerca del oído', 'Nunca apresurar el Shavasana'] },
    buscador: { icon: '⚡', name: 'Buscador/a', color: '#E65100', bgColor: '#FFF3E0', tips: ['Saludo al Sol: rápido en el 1er ciclo, lento en el 3ero', 'Guerrero I: contar los segundos', 'Cobra profunda: búsqueda de extensión máxima', 'HA del Guerrero I bien fuerte', 'La Flor de Loto es su mayor desafío — celebrarlo', 'Shavasana con piedra en el pecho: el peso ayuda'] },
    bajo_registro: { icon: '🌊', name: 'Bajo Registro', color: '#0277BD', bgColor: '#E1F5FE', tips: ['Cobra profunda: objetivo principal', 'La piedra naranja cálida es el objeto más activante', 'Saludo al Sol: 5 ciclos en vez de 3', 'Guerrero I: énfasis en empujar el suelo', 'Antes de relajación: abrazo de oso', 'Shavasana con manta pesada si se tiene'] },
    motor: { icon: '🧩', name: 'Planif. Motora', color: '#6A1B9A', bgColor: '#EDE7F6', tips: ['Saludo al Sol: un movimiento por vez', 'Guerrero I: primero piernas, luego brazos al cielo', 'Cobra: no combinar con Saludo al Sol todavía', 'Flor de Loto: postura más accesible de la semana', 'Celebrar MUY activamente el Saludo al Sol completo', 'Repetir secuencia 5 veces mínimo'] }
  },
  artActivity: {
    name: 'Mi Mandala de Kawa — El Mapa de los 4 Mundos',
    materials: ['Plato de papel grande', 'Pinturas de los 4 colores del curso', 'Brillantina dorada', 'Los 4 objetos del curso'],
    steps: ['Trazar 4 círculos concéntricos.', 'Círculo interior: Kawa como semilla.', 'Segundo: 4 cuartos con el color de cada elemento.', 'Tercero: los 4 guardianes.', 'Exterior: símbolos del curso y brillantina.'],
    therapeuticNote: 'La organización circular tiene efecto meditativo. Es el ritual de integración de los 4 mundos.'
  },
  physicalObject: {
    name: 'Piedra de Lumi — El Calor que Se Lleva',
    description: 'Una piedra de color naranja o rojizo, suave, tamaño de la palma.',
    howToBuild: 'Buscar jaspe naranja en tienda de minerales. O pintar piedra con acrílico naranja y barnizar.',
    therapeuticUse: 'Para niños que buscan estimulación propioceptiva: apretar y soltar la piedra es un regulador portable.'
  },
  microPractices: [
    { moment: 'Al despertar', toCalm: 'Manos en el pecho, 3 respiraciones de fuego suave', toActivate: 'Saludo al Sol: 1 ciclo completo' },
    { moment: 'Momento de no puedo', toCalm: 'Flor de Loto 30 segundos + yo soy fuego en voz baja', toActivate: 'Guerrero I con HA fuerte: 2 veces por lado' },
    { moment: 'Después del colegio', toCalm: 'Respiración de fuego 6 ciclos + Postura del Niño', toActivate: 'Saludo al Sol 2 ciclos + Cobra profunda' },
    { moment: 'Antes de dormir', toCalm: 'Manos en pecho + canción susurrada + Shavasana', toActivate: 'Cobra suave 2 veces + Flor de Loto 30 seg' }
  ],
  isModule: {
    title: 'Semana 4: Interoceptividad — El Sentido que Nadie Enseña',
    duration: '12 minutos',
    systemWorked: 'Sistema Interoceptivo',
    keyQuestion: '¿Por qué mi hijo no siente hambre, no siente frío o no reconoce sus propias emociones?',
    content: [
      'La interoceptividad es el sentido que percibe el estado interno del cuerpo: hambre, calor, latido, emociones físicas.',
      'Muchos niños neurodivergentes tienen interoceptividad reducida — no leen las señales de su propio cuerpo.',
      'Las posturas de fuego (manos en el pecho, Cobra, Flor de Loto) entrenan la conciencia del estado interno.',
      'El ejercicio ¿qué sientes en el pecho? antes y después de cada postura es entrenamiento interoceptivo directo.',
      'La piedra cálida en el cuerpo durante el Shavasana activa la conciencia táctil interna.'
    ],
    parentTakeaway: 'Esta semana: varias veces al día pregunta ¿Cómo está tu cuerpo ahora? sin evaluar la respuesta. Solo escuchar y validar.'
  }
}

// ─── SEMANA 5 — ESPACIO ───────────────────────────────────────────────────────
const week5: Week = {
  id: 5,
  element: 'Espacio',
  elementEmoji: '✨',
  guardian: 'la Ballena Cósmica',
  guardianSpecies: '',
  color: '#1A237E',
  colorLight: '#E8EAF6',
  colorName: 'Índigo estrella',
  symbol: 'Círculo completo',
  tactileObject: 'Tela oscura con estrellas',
  teaching: 'El universo entero cabe en una semilla',
  story: {
    inicio: {
      title: 'El último viaje',
      text: 'Con sus cuatro objetos — la piedra de Oma, la tela de Iris, la pluma de Inti y la piedra naranja de Lumi — Kawa llegó al borde del Mundo del Fuego y se encontró con algo que no esperaba: el espacio. Oscuro, silencioso, lleno de estrellas. No había tierra donde pararse. No había agua que fluir. No había viento. Solo silencio y luz.'
    },
    desequilibrio: {
      title: 'El miedo al vacío',
      text: '¿Cómo voy a caminar si no hay suelo? preguntó Kawa. ¿Cómo voy a respirar si no hay aire? El espacio no respondió. Solo brilló un poco más.'
    },
    accion: {
      title: 'La Ballena que canta sin sonido',
      text: 'Desde la oscuridad más profunda, apareció algo enorme: una ballena de luz. Tan grande que Kawa solo veía una parte de ella a la vez. La Ballena no habló. No tenía nombre. Pero emitió una vibración que Kawa sintió en todos los objetos que llevaba: la piedra vibró, la tela se movió sola, la pluma giró, la piedra naranja brilló. Todo lo que llevas, entendió Kawa sin palabras, ya estaba en el espacio. El espacio es el origen de todo.'
    },
    catarsis: {
      title: 'Kawa planta la semilla',
      text: 'Kawa se quedó quieta en el espacio. No como antes, que se quedaba quieta porque no podía más. Esta vez se quedó quieta porque era perfectamente suficiente estar ahí, en ese momento, siendo ella misma. Y entonces, sin saber por qué, plantó su semilla — ella misma — en el espacio. Y del espacio brotó un árbol. El Árbol del Universo. El mismo del que había caído.'
    },
    ensenanza: {
      title: 'El regreso que no es regreso',
      text: 'La Ballena vibró una vez más, y Kawa entendió: No necesitabas encontrar el camino de regreso a casa. Eras el camino. Eras la casa.'
    }
  },
  song: {
    name: 'Kawa Llega a Casa',
    lyrics: [
      'Viajé por la tierra, el agua y el viento,',
      'el fuego me hizo, el espacio es mi centro.',
      'Llevo una piedra, una tela, una pluma,',
      'y una llama adentro que todo lo suma.',
      '',
      'OM... el universo soy yo.',
      'OM... y estaba en mi corazón.',
      'OM... no hay lugar a donde ir,',
      'porque yo ya soy el inicio y el fin.'
    ],
    howToUse: 'Sentados en Flor de Loto con los 4 objetos del curso. Los OM se cantan largo, sintiendo la vibración.',
    rhythm: 'Muy lento, contemplativo. Los OM pueden durar todo lo que el niño necesite.'
  },
  sessionStructure: {
    duration: '50–60 minutos',
    space: 'En el piso. Oscurecer levemente y poner tela oscura con estrellas. Silencio antes de empezar.',
    preparation: 'Los 4 objetos del curso frente a cada niño. 1 minuto de silencio total antes de comenzar.',
    moments: [
      { duration: '2 min', name: 'El silencio del espacio', description: '1 minuto de silencio total. Mostrar los 4 objetos reunidos.' },
      { duration: '5 min', name: 'La historia completa', description: 'Narrar el viaje de Kawa por los 5 mundos en 5 minutos.' },
      { duration: '3 min', name: 'Jalea Cósmica', description: 'Jalea muy lenta. Como flotando sin gravedad. Cada uno a su tiempo.' },
      { duration: '3 min', name: 'Canción de regreso', description: 'Cantar "Kawa Llega a Casa". Los OM largos.' },
      { duration: '12 min', name: 'Secuencia Completa de Kawa', description: 'Montaña → Árbol → Postura del Niño → Mariposa → Cobra → Guerrero II → Barco → Saludo al Sol → Flor de Loto.' },
      { duration: '5 min', name: 'Respiración Cósmica', description: 'Las 4 respiraciones del curso unidas.' },
      { duration: '5 min', name: 'La Ballena y el OM', description: 'Narrar ACCIÓN. Cantar OM largo juntos.' },
      { duration: '12 min', name: 'Shavasana del Universo', description: 'La más larga. Con los 4 objetos sobre el cuerpo.' },
      { duration: '5 min', name: 'Ceremonia de cierre', description: 'Mostrar el diario. Entregar el Diploma de Guardián/a del Equilibrio.' }
    ]
  },
  posturas: [
    {
      id: 'secuencia_completa', emoji: '🌌', name: 'Secuencia Completa de Kawa', magicName: 'El Viaje Completo',
      storyNarration: 'En el Mundo del Espacio no hay posturas nuevas. Hay el recuerdo de todo lo aprendido, unido en un solo movimiento continuo.',
      howTo: 'Montaña → Árbol → Postura del Niño → Mariposa → Cobra → Guerrero II → Barco → Saludo al Sol → Flor de Loto. Hacer dos veces con narración.',
      duration: '2 ciclos completos, ~8–10 minutos',
      sensoryBenefits: ['Integra todos los sistemas sensoriales trabajados', 'El mayor logro de integración sensorial del curso', 'Para planificación motora: el hito más importante'],
      profiles: { sensible: 'Esta semana es su cierre más poderoso.', buscador: 'Hacerla 3 veces: rápido, lento, rápido.', bajo_registro: 'Hacer 3 ciclos con posturas activantes ampliadas.', motor: 'Usar tarjetas visuales en el suelo como guía.' }
    },
    {
      id: 'om_ballena', emoji: '🫀', name: 'OM de la Ballena', magicName: 'La Vibración del Origen',
      storyNarration: 'La Ballena Cósmica no habla. Vibra. Y su vibración dice todo lo que el lenguaje no puede decir.',
      howTo: 'Flor de Loto. Manos en Namaste al corazón. Ojos cerrados. Inhalar profundo. Exhalar con OM largo. Sentir la vibración en el pecho, garganta y frente. 3 OM juntos.',
      duration: '3 OM largos, sin prisa',
      sensoryBenefits: ['El OM estimula el nervio vago directamente', 'Genera cohesión — sincroniza sistemas nerviosos', 'Activa conciencia interoceptiva profunda'],
      profiles: { sensible: 'OM comenzar muy suave. Puede ser casi imperceptible.', buscador: 'OM fuerte — dejar que lo hagan bien fuerte el primero.', bajo_registro: 'OM fuerte y prolongado — sentir vibración.', motor: 'La vibración es el input más accesible esta semana.' }
    }
  ],
  breathing: {
    name: 'Respiración Cósmica — Las 4 Respiraciones Unidas',
    storyNarration: 'La Ballena le enseñó a Kawa que todas las respiraciones que aprendió son una sola: la respiración del universo.',
    howTo: 'Ciclo 1: Globo de Tierra (4/4, manos en pancita). Ciclo 2: Shhh del Océano (4/6). Ciclo 3: HA suave (inhalar arriba, HA al bajar). Ciclo 4: OM largo. Repetir 2 veces.',
    benefit: 'Activa progresivamente el parasimpático y finaliza con la integración vibracional del OM. La práctica de autorregulación más completa del programa.',
    whenToUse: 'Como práctica diaria de 5 minutos después de completar el curso. Puede mantenerse como ritual matutino o nocturno de por vida.'
  },
  relaxationScript: `Cierra los ojos. Pon la piedra verde en una mano, la tela azul en la otra. La pluma sobre tu corazón. La piedra naranja en tu pancita.

Sientes el peso de cada objeto. Cuatro mundos que recorriste.

Kawa está contigo. No a tu lado — dentro de ti. Porque tú eres Kawa. Siempre lo fuiste.

El espacio alrededor de tu cuerpo es infinito. No necesitas llenarlo. Solo estar.

La Ballena Cósmica nada muy lejos, tan lejos que se confunde con las estrellas. Pero su vibración llega hasta ti. La sientes en el pecho.

Toodo... está... bien. No hay lugar a donde ir. Ya llegaste.

Eres tierra. Eres agua. Eres aire. Eres fuego. Eres espacio.

Eres una semilla que contiene el universo entero.

Cuando estés listo, mueve suavemente los dedos. Siente los objetos. Luego los pies. Estira el cuerpo completo. Abre los ojos. Bienvenido/a a casa.`,
  profileAdaptations: {
    sensible: { icon: '🌸', name: 'Muy Sensible', color: '#AD1457', bgColor: '#FCE4EC', tips: ['Esta semana es su cierre más poderoso', 'El silencio inicial: contar con dedos para saber cuándo termina', 'Los 4 objetos sobre el cuerpo son profundamente reguladores', 'OM: comenzar muy suave', 'El diploma tiene máxima ceremonia para ellos', 'Tela oscura puede abrumar: ofrecer luz como alternativa'] },
    buscador: { icon: '⚡', name: 'Buscador/a', color: '#E65100', bgColor: '#FFF3E0', tips: ['La Secuencia Completa satisface necesidad de movimiento', 'Hacerla 3 veces: lento, rápido, lento', 'OM fuerte les encanta', 'Shavasana largo: los 4 objetos ayudan a quedarse', 'Diploma y ceremonia: importante el reconocimiento activo', 'Proponer que enseñen la Secuencia a alguien'] },
    bajo_registro: { icon: '🌊', name: 'Bajo Registro', color: '#0277BD', bgColor: '#E1F5FE', tips: ['Secuencia completa: 3 ciclos con posturas activantes', 'Los 4 objetos son el mayor input propioceptivo del programa', 'OM fuerte y prolongado', 'Antes del Shavasana: presión profunda en hombros y pies', 'Tela sobre el cuerpo como peso adicional', 'Celebrar el diploma con movimiento: saltando, aplaudiendo'] },
    motor: { icon: '🧩', name: 'Planif. Motora', color: '#6A1B9A', bgColor: '#EDE7F6', tips: ['La Secuencia Completa es el mayor hito del programa', 'Si no la dominan completa: celebrar igual', 'Hacer la secuencia con tarjetas visuales en el suelo', 'OM: la vibración es el input más accesible', 'El diploma debe ser real, impreso, con su nombre', 'Proponer que enseñen UNA postura favorita'] }
  },
  artActivity: {
    name: 'El Diario Completo de Kawa — El Libro del Viaje',
    materials: ['Las 5 páginas del diario', 'Los 4 objetos del curso para fotografiar', 'Pegamento y tijeras', 'Una portada especial'],
    steps: ['Reunir todas las páginas del diario de las 5 semanas.', 'Crear una portada: los 5 mundos y Kawa en el centro.', 'Añadir página final: Lo que aprendí en cada mundo.', 'El adulto escribe una dedicatoria personal.', 'Encuadernar con hilo o broche.'],
    therapeuticNote: 'El libro terminado es la narrativa personal del niño materializada. Para niños con dificultades de comunicación: este libro habla por ellos.'
  },
  physicalObject: {
    name: 'Diploma de Guardián/a del Equilibrio',
    description: 'Un diploma real con el nombre del niño y los 5 símbolos del curso.',
    howToBuild: 'Opción 1: plantilla imprimible. Opción 2: papel de acuarela con letra bonita, los 5 mundos y el nombre. El adulto lo firma.',
    therapeuticUse: 'La ceremonia de entrega es el ritual de cierre. El diploma puede colgarse en el cuarto del niño.'
  },
  microPractices: [
    { moment: 'Cada mañana', toCalm: 'Respiración Cósmica (2 min): las 4 respiraciones', toActivate: 'Saludo al Sol 1 ciclo + OM para empezar el día' },
    { moment: 'Cuando algo es difícil', toCalm: '¿Qué guardián necesito? (Oma=calma, Iris=fluir, Inti=fuerza, Lumi=valentía)', toActivate: 'Respiración del guardián que más necesitan' },
    { moment: 'Con la familia', toCalm: 'Secuencia Completa de Kawa en familia 1 vez/semana', toActivate: 'Cada miembro elige su postura favorita y la enseña' },
    { moment: 'Antes de dormir', toCalm: '3 OM en Flor de Loto + Shavasana 5 minutos', toActivate: 'Poner los 4 objetos en la mesita como ancla visual' }
  ],
  isModule: {
    title: 'Semana 5: Integración Sensorial — El Sistema Completo',
    duration: '12–15 minutos',
    systemWorked: 'Integración multisensorial',
    keyQuestion: '¿Cómo sé si el yoga sensorial está funcionando en mi hijo?',
    content: [
      'La integración sensorial es el proceso por el cual el cerebro organiza la información de todos los sentidos para producir una respuesta apropiada.',
      'Después de 5 semanas, los indicadores incluyen: el niño pide yoga espontáneamente, usa respiraciones para regularse solo, enseña posturas a otros.',
      'La práctica no termina aquí — el cuerpo consolidó una biblioteca de herramientas.',
      'Para mantener: anclar a una rutina existente. La consistencia importa más que la duración.',
      'La secuencia completa de Kawa es la práctica de mantenimiento más completa.'
    ],
    parentTakeaway: 'De ahora en adelante: 5 minutos de Secuencia Completa de Kawa + 3 OM antes de dormir. Eso es suficiente para mantener todo lo que construyeron.'
  }
}

// ─── EXPORTS ──────────────────────────────────────────────────────────────────

export const COURSE_WEEKS: Week[] = [week1, week2, week3, week4, week5]

export const WEEK_COLORS = {
  1: { main: '#2D6A4F', light: '#E8F5E9', name: 'tierra' },
  2: { main: '#0277BD', light: '#E1F5FE', name: 'agua' },
  3: { main: '#6A1B9A', light: '#EDE7F6', name: 'aire' },
  4: { main: '#BF360C', light: '#FBE9E7', name: 'fuego' },
  5: { main: '#1A237E', light: '#E8EAF6', name: 'espacio' },
}
