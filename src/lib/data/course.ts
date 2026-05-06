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
  storyNarration: string   // texto narrado por Kawa
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
  color: string          // hex principal
  colorLight: string     // hex claro
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
  isModule: ISModule       // módulo de integración sensorial para padres
}

// ─── PROFILE COLORS ────────────────────────────────────────────────────────────

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

// ─── WEEK 1 — TIERRA ──────────────────────────────────────────────────────────

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
    preparation: 'Antes de empezar, cada niño elige una piedra pequeña real (de la calle, del jardín). La sostiene durante la sesión. Poner música suave de bosque o silencio. Luz natural si es posible.',
    moments: [
      { duration: '5 min', name: 'Llegada de Kawa', description: 'El adulto narra el INICIO en voz baja. Mostrar o describir el muñeco de Kawa. Pregunta: ¿Alguna vez tuvieron miedo de caerse? El niño sostiene su piedra.' },
      { duration: '5 min', name: 'Jalea de Tierra', description: 'Sacudir el cuerpo como si fueran tierra que tiembla lentamente. Muy despacio. Los pies NO se levantan del suelo en ningún momento.' },
      { duration: '3 min', name: 'Canción de Oma', description: 'Escuchar o cantar "Los Pies de Oma". Primera vez sentados, segunda vez de pie en Montaña.' },
      { duration: '8 min', name: 'Posturas de la Tierra', description: 'Montaña → Postura del Indio → Gato I y II. Narrar: "Kawa hace esto para no caerse". Repetir cada postura 3 veces.' },
      { duration: '5 min', name: 'Árbol de los sueños', description: 'Postura del Árbol. Cada niño imagina que sus raíces bajan por el pie al centro de la tierra. ¿Qué hay en el centro? Que lo digan en voz alta.' },
      { duration: '5 min', name: 'Respiración de raíz', description: 'Sentados. Respiración de globo. Las manos en la pancita. Imaginar que con cada exhale, raíces salen de sus pies hacia la tierra.' },
      { duration: '5 min', name: 'Oma entrega la piedra', description: 'Narrar la ENSEÑANZA. El adulto entrega formalmente la piedra al niño. El niño la sostiene y cierra los ojos 30 segundos.' },
      { duration: '7 min', name: 'Shavasana de Kawa', description: 'Relajación guiada completa con la voz de Kawa narrada.' },
      { duration: '3 min', name: 'Arte y mapa', description: 'El niño dibuja en su diario qué sintió Kawa. Se coloca Kawa en el Mundo de la Tierra del mapa.' }
    ]
  },

  posturas: [
    {
      id: 'montana',
      emoji: '🏔️',
      name: 'Montaña',
      magicName: 'El Cuerpo que No Tiembla',
      storyNarration: 'Kawa se para por primera vez y descubre que cuando pone los pies bien plantados, nada la puede derribar. La montaña no corre porque ya está en el mejor lugar del mundo.',
      howTo: 'De pie, pies paralelos al ancho de las caderas. Brazos pegados al cuerpo. Empujar suavemente los pies contra el suelo. Espalda larga como si un hilo jalara la cabeza hacia arriba. Cara relajada. Mantener 5 respiraciones.',
      duration: '30–45 segundos, repetir 2 veces',
      sensoryBenefits: [
        'Propiocepción de toda la cadena posterior y plantar — organiza el sistema nervioso',
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
      id: 'indio',
      emoji: '🧘',
      name: 'Postura del Indio',
      magicName: 'El Trono de Oma',
      storyNarration: 'Oma siempre se sienta así: piernas cruzadas, espalda larga, con la paciencia de quien sabe que el tiempo no tiene prisa. Cuando Kawa se sienta igual, siente que la tierra la abraza.',
      howTo: 'Sentados con piernas cruzadas en el suelo. Espalda larga. Manos en las rodillas. Cantar OM tres veces juntos sintiendo la vibración en el pecho. El adulto puede sentarse detrás para dar apoyo suave en la espalda.',
      duration: '45–60 segundos + 3 OM',
      sensoryBenefits: [
        'Activación propioceptiva de caderas y columna — los isquiones sobre el suelo organizan el SN',
        'La vibración del OM activa el nervio vago y reduce la activación simpática',
        'Postura más segura para niños con hipersensibilidad',
        'El canto compartido fortalece el vínculo adulto-niño'
      ],
      profiles: {
        sensible: 'Postura de aterrizaje más segura. OM puede ser muy suave.',
        buscador: 'El OM es un momento de pausa regulada — mantenerlo como ritual.',
        bajo_registro: 'OM fuerte y prolongado. Sentir la vibración en el pecho.',
        motor: 'Sentar en una manta doblada si las caderas están tensas.'
      }
    },
    {
      id: 'tortuga',
      emoji: '🐢',
      name: 'Tortuga',
      magicName: 'La Casa que Siempre Llevas',
      storyNarration: 'Oma le enseña a Kawa su postura más preciada: cuando el mundo se vuelve demasiado grande, la tortuga se recoge dentro de sí misma. Su casa siempre está con ella.',
      howTo: 'Sentados, piernas estiradas en V. Doblar el cuerpo hacia adelante lentamente. Brazos por debajo de las rodillas. Cabeza inclinada hacia el suelo como escondiéndose en la concha. Mantener y respirar suave.',
      duration: '30–60 segundos. Sin presión de llegar al suelo.',
      sensoryBenefits: [
        'Plegamiento anterior activa el sistema nervioso parasimpático',
        'Presión leve en abdomen estimula baroreceptores que señalizan calma al cerebro',
        'Postura de regulación ante desbordes sensoriales',
        'Para ADHD: el recogimiento físico reduce la dispersión'
      ],
      profiles: {
        sensible: 'Postura de refugio ideal. Usar libremente en momentos difíciles.',
        buscador: 'Mantener más tiempo. ¿Cuántas respiraciones aguanta la tortuga?',
        bajo_registro: 'Adulto pone manta suave encima para aumentar el input táctil.',
        motor: 'Comenzar solo inclinando el tronco, sin llegar al suelo todavía.'
      }
    },
    {
      id: 'gato',
      emoji: '🐱',
      name: 'Gato I y II',
      magicName: 'La Espalda que Respira',
      storyNarration: 'Los gatos de la tierra mueven la espalda como olas de barro. Kawa aprende que el suelo puede bailar.',
      howTo: 'Cuatro apoyos: manos bajo hombros, rodillas bajo caderas. Gato I: exhalar y arquear la espalda hacia arriba. Gato II: inhalar y hundir la espalda. 5 ciclos lentos coordinados con la respiración.',
      duration: '5 ciclos lentos (40–50 segundos)',
      sensoryBenefits: [
        'Propiocepción bilateral intensa en manos y rodillas',
        'Conectar movimiento con respiración regula el SNA',
        'Moviliza columna vertebral — beneficio postural directo',
        'El ritmo predecible es altamente organizador para neurodivergentes'
      ],
      profiles: {
        sensible: 'Movimiento predecible y seguro. Ritmo lento y constante.',
        buscador: 'Exagerar el movimiento, ampliar el arco. Gato dramático.',
        bajo_registro: 'Presionar activamente manos contra el suelo en cada ciclo.',
        motor: 'Separar Gato I y Gato II en pasos distintos antes de combinar.'
      }
    },
    {
      id: 'arbol',
      emoji: '🌲',
      name: 'Árbol',
      magicName: 'Las Raíces que Suben',
      storyNarration: 'Kawa descubre que un árbol no cae porque sus raíces llegan muy adentro de la tierra. Aunque se balancee con el viento, sus raíces lo sostienen.',
      howTo: 'De pie, un pie firme en el suelo. El otro pie en el tobillo o pantorrilla (nunca en la rodilla). Brazos como ramas: abrir al lado o subir sobre la cabeza. Mantener. Cuando se caen: reírse y volver a intentar.',
      duration: '15–20 segundos por lado. 2–3 intentos por lado.',
      sensoryBenefits: [
        'Equilibrio estático — activa sistema vestibular y propioceptivo simultáneamente',
        'El caerse es parte del aprendizaje: desmitifica el error',
        'Concentración activa requerida — entrena atención sostenida',
        'Para planificación motora: comenzar con pie apenas levantado'
      ],
      profiles: {
        sensible: 'Junto al adulto tomados de la mano al principio.',
        buscador: 'Añadir reto de ojos cerrados. ¿Cuántos segundos?',
        bajo_registro: 'Árbol con brazo apoyado en pared para mayor presión propioceptiva.',
        motor: 'Solo levantar el talón primero — NO el pie completo todavía.'
      }
    }
  ],

  breathing: {
    name: 'Respiración de Raíz — El Globo de la Tierra',
    storyNarration: 'Oma le enseñó a Kawa que la tierra respira muy despacio, tan despacio que a veces no la escuchas. Pero si pones la mano en tu pancita, puedes sentir tu propio mundo.',
    howTo: 'Sentados o acostados. Manos en la pancita. Inhalar por la nariz: sentir cómo la pancita crece como un globo. Exhalar por la nariz: el globo se desinfla. 4 tiempos adentro, 4 afuera. Repetir 6 veces.',
    benefit: 'Respiración diafragmática profunda activa el sistema nervioso parasimpático. El movimiento visible del abdomen hace el concepto concreto y visual para niños de 3-5 años.',
    whenToUse: 'Antes de dormir, antes de situaciones que generan ansiedad, al inicio de cualquier sesión, en momentos de berrinche o desregulación.'
  },

  relaxationScript: `Cierra los ojos suavemente y pon las manos en tu pancita.

Siente que estás acostado sobre la tierra más suave del mundo, como si el suelo fuera una cama de musgo verde. Kawa también está acostada aquí, a tu lado.

Siente tus pies pesados, muy pesados, como si fueran piedras tibias. Siente tus piernas pesadas. Tu pancita sube y baja, sube y baja. Oma la Tortuga está muy cerca, caminando despacio por el musgo.

Kawa susurra: "Aquí estás seguro. La tierra te sostiene. No te vas a caer porque la tierra siempre está aquí."

Respira una vez más. Siente la piedra en tu mano. Esa piedra es tuya. Es el regalo de Oma. Es tu raíz, aunque estés en cualquier lugar del mundo.

Cuando estés listo, mueve los dedos de los pies. Mueve los dedos de las manos. Abre los ojos despacio.`,

  profileAdaptations: {
    sensible: {
      icon: '🌸', name: 'Muy Sensible', color: '#AD1457', bgColor: '#FCE4EC',
      tips: [
        'Mostrar cada postura ANTES de pedirla — nunca sorprender',
        'Árbol: junto al adulto tomados de la mano',
        'OM: puede taparse los oídos al principio, está bien',
        'La piedra táctil es ideal: textura predecible y calmante',
        'Voz muy suave en toda la sesión',
        'Nunca forzar la Postura del Indio si hay sensibilidad en caderas'
      ]
    },
    buscador: {
      icon: '⚡', name: 'Buscador/a', color: '#E65100', bgColor: '#FFF3E0',
      tips: [
        'Montaña: desafío — ¿quién aguanta más sin moverse?',
        'Gato: exagerar el movimiento, ampliar el arco',
        'Árbol: añadir reto de ojos cerrados',
        'Piedra: pueden apretar fuerte antes de soltarla',
        'Jalea de Tierra: movimiento exagerado con terremoto imaginario',
        'Canción: golpear el ritmo con los pies en el suelo'
      ]
    },
    bajo_registro: {
      icon: '🌊', name: 'Bajo Registro', color: '#0277BD', bgColor: '#E1F5FE',
      tips: [
        'Montaña: empujar MUY fuerte los pies contra el suelo',
        'Gato: presionar activamente manos contra el suelo',
        'Necesitan más tiempo en cada postura para registrar',
        'Agregar peso: manta encima durante Tortuga o Shavasana',
        'Golpear los talones suavemente en el suelo antes de Montaña',
        'Canción: cantar fuerte, no suave'
      ]
    },
    motor: {
      icon: '🧩', name: 'Planif. Motora', color: '#6A1B9A', bgColor: '#EDE7F6',
      tips: [
        'Montaña: una sola instrucción a la vez (primero pies, luego espalda)',
        'Árbol: comenzar solo levantando el talón — NO el pie completo',
        'Gato: separar I y II, no mezclar en ciclos todavía',
        'Repetir cada postura más veces — la repetición es aprendizaje motor',
        'Nunca pedir dos cosas al mismo tiempo',
        'Celebrar cada etapa lograda, no solo la postura completa'
      ]
    }
  },

  artActivity: {
    name: 'Mi Piedra de Oma — La Raíz que Llevo Conmigo',
    materials: ['1 piedra suave (la de la sesión)', 'Pinturas acrílicas o esmaltes', 'Pinceles finos', 'Barniz transparente (opcional)'],
    steps: [
      'Lavar y secar la piedra — sentir su textura con los ojos cerrados.',
      'Elegir un color que represente cómo se sintió Kawa al enraizarse.',
      'Pintar la piedra con ese color base. Dejar secar.',
      'Con pincel fino, dibujar una espiral que baja (el símbolo de la tierra).',
      'Opcional: escribir el nombre mágico de Kawa o el propio.',
      'Barnizar cuando esté seco. Esta piedra viaja con el niño.'
    ],
    therapeuticNote: 'El trabajo con textura es táctil-propioceptivo. La piedra pintada se convierte en objeto transicional: el niño puede llevarla al colegio o al médico como regulador portátil.'
  },

  physicalObject: {
    name: 'Kawa de Fieltro — La Semilla con Ojos',
    description: 'El muñeco de Kawa es el objeto central de todo el curso. Una semilla ovalada de 12–15 cm, con ojos bordados y sonrisa. Se construye esta semana y viaja por el mapa las 5 semanas.',
    howToBuild: 'Opción 1 (fieltro): Recortar dos óvalos de fieltro verde, coser bordes dejando hueco, rellenar con algodón, cerrar y bordar ojos. Opción 2 (amigurumi): patrón básico de crochet con lana verde. Opción 3 (imprimible): plantilla en cartulina.',
    therapeuticUse: 'El niño lleva a Kawa al mapa al final de cada sesión. Puede ser abrazada durante las relajaciones o llevada en momentos difíciles fuera de las sesiones.'
  },

  microPractices: [
    { moment: 'Al despertar', toCalm: 'Postura del Indio en la cama + 3 respiraciones de globo', toActivate: 'Montaña fuerte en el baño mientras se lavan los dientes' },
    { moment: 'Antes del colegio', toCalm: 'Sostener la piedra de Oma 20 segundos con ojos cerrados', toActivate: 'Árbol durante 15 segundos mientras esperan' },
    { moment: 'Momento difícil', toCalm: 'Tortuga: recogerse y respirar hasta que el mundo sea manejable', toActivate: 'Gato I y II: 3 ciclos en el suelo para bajar la intensidad' },
    { moment: 'Antes de dormir', toCalm: 'Respiración de raíz: 6 ciclos con manos en la pancita', toActivate: 'Shavasana breve (2 min) con texto de la relajación' }
  ],

  isModule: {
    title: 'Semana 1: ¿Qué es la Propiocepción y por qué la tierra calma?',
    duration: '10–12 minutos',
    systemWorked: 'Sistema Propioceptivo',
    keyQuestion: '¿Por qué mi hijo se calma cuando empuja cosas, abraza fuerte o está en cuatro apoyos?',
    content: [
      'La propiocepción es el sentido que le dice a tu cuerpo dónde está en el espacio. Viene de los músculos, tendones y articulaciones.',
      'Cuando hay desregulación sensorial, el sistema propioceptivo actúa como el "reset" del sistema nervioso. Por eso los abrazos fuertes, el cuatro apoyos y empujar contra el suelo calman.',
      'Las posturas de tierra (Montaña, Gato, Postura del Indio) dan input propioceptivo intenso y predecible — exactamente lo que el sistema nervioso necesita para organizarse.',
      'El "peso" de estar en el suelo y la presión en los isquiones (huesos de sentarse) son los más reguladores. Por eso Oma siempre está sentada.',
      'Para tu hijo con ADHD, autismo o bajo registro: las actividades de "heavy work" (empujar, jalar, cargar) son medicina preventiva si se hacen antes de situaciones difíciles.'
    ],
    parentTakeaway: 'Esta semana: 5 minutos de actividad propioceptiva ANTES del colegio (cargar la mochila pesada, empujar la silla, hacer la Montaña). Observa si la transición es más suave.'
  }
}

// ─── WEEK 2 — AGUA (summary — full data same pattern) ─────────────────────────

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
  tactileObject: 'Tela azul suave o bol con agua',
  teaching: 'Fluir no es rendirse — es la forma más inteligente de moverse',
  story: {
    inicio: { title: 'El océano tormentoso', text: 'Con su piedra de tierra en la mano, Kawa llegó a la orilla de un océano enorme. El agua era de todos los azules que existen. Era bellísima. Pero de repente, una tormenta comenzó a crecer desde adentro del mar. Las olas se hacían cada vez más grandes. Kawa quería escapar.' },
    desequilibrio: { title: 'No se puede parar una ola', text: '¡Que pare! ¡Que se calme! gritó Kawa, empujando el agua con los brazos. Pero cuanto más empujaba, más grande se hacía la ola. El mar no era su enemigo: era un espejo. Le mostraba a Kawa que ella también tenía tormentas adentro.' },
    accion: { title: 'Iris cambia de color', text: 'Entonces salió del fondo del océano Iris, el Pulpo Arcoíris. Iris tenía ocho brazos y cambiaba de color según lo que sentía: azul cuando estaba tranquilo, rojo cuando tenía miedo. "Las olas no paran," dijo Iris, "pero tú puedes aprender a moverte con ellas. Mira: así." Iris empezó a ondular su cuerpo como las olas. No resistía. Solo fluía.' },
    catarsis: { title: 'Kawa llora en el agua', text: 'Kawa intentó fluir. Al principio se caía. Luego se reía. Y en algún momento entre una ola y la siguiente, Kawa lloró. Lloró las cosas que tenía guardadas y que se habían vuelto tormentas adentro. El océano recibió sus lágrimas sin asustarse.' },
    ensenanza: { title: 'El regalo de Iris', text: 'Iris le entregó a Kawa una pequeña tela azul. "Cuando sientas que algo dentro de ti es demasiado grande," dijo, "no lo empujes. Ondula con él. Las emociones son olas: llegan y se van. Ninguna dura para siempre."' }
  },
  song: {
    name: 'La Ola de Iris',
    lyrics: ['Soy una ola que va y que viene,', 'nada me para, nada me detiene.', 'Iris me enseña con ocho colores:', 'las olas no asustan, son mis amores.', '', 'Fluyo, fluyo, no me resisto,', 'soy agua que baila por donde ha visto.', 'Respiro shhh, respiro shhh,', 'la calma más grande vive en mí.'],
    howToUse: 'Durante la Jalea de Agua y la Respiración Estrella. En el "shhh" todos exhalan juntos con ese sonido. Agitar la tela azul suavemente.',
    rhythm: 'Ondulado, 3/4 como una cuna. El cuerpo se balancea de lado a lado mientras se canta.'
  },
  sessionStructure: {
    duration: '40–50 minutos',
    space: 'En el piso. Si es posible, un bol con agua en el centro.',
    preparation: 'Un bol pequeño de agua en el centro del espacio. Tela azul disponible. Sonidos de agua de fondo (opcional). Todos tocan el agua antes de empezar.',
    moments: [
      { duration: '5 min', name: 'El océano de Kawa', description: 'Narrar INICIO y DESEQUILIBRIO. Todos tocan el agua del bol. ¿A qué se siente? ¿Cómo está el agua hoy — tranquila o con olas?' },
      { duration: '3 min', name: 'Jalea de Agua', description: 'Jalea fluida: el cuerpo es agua. Lento, ondulado. Los brazos como tentáculos de Iris.' },
      { duration: '3 min', name: 'Canción de Iris', description: 'Cantar. En cada "shhh" todos exhalan juntos. Balancear el cuerpo.' },
      { duration: '10 min', name: 'Posturas del Agua', description: 'Postura del Niño → Mariposa → Gato fluido → Cobra. Narrar: "Iris le enseña a Kawa a ondular".' },
      { duration: '5 min', name: 'Puente y Ola', description: '"El puente es la ola más grande de Kawa." Subir y bajar 3 veces, luego mantener.' },
      { duration: '5 min', name: 'Respiración Estrella', description: 'Técnica central. Inhalar 4, exhalar 6 con shhh. Todos juntos, contar en voz alta.' },
      { duration: '5 min', name: 'Iris entrega la tela', description: 'Narrar CATARSIS y ENSEÑANZA. El adulto entrega la tela azul.' },
      { duration: '7 min', name: 'Shavasana del Océano', description: 'Relajación guiada. Tela azul sobre el pecho si el niño quiere.' },
      { duration: '3 min', name: 'Diario y mapa', description: 'Dibujar en el diario. Mover Kawa al Mundo del Agua.' }
    ]
  },
  posturas: [
    { id: 'postura_nino', emoji: '🧒', name: 'Postura del Niño', magicName: 'El Caracol del Fondo del Mar', storyNarration: 'En las profundidades del océano hay caracoles que se enrollan cuando las tormentas llegan. Adentro de su concha, todo está quieto aunque afuera el mar ruja.', howTo: 'Sentarse sobre los talones. Llevar el tronco hacia adelante hasta que la frente toque el suelo. Brazos estirados adelante o a los lados. El adulto puede poner suavemente una mano en la espalda.', duration: '60–90 segundos.', sensoryBenefits: ['Flexión anterior activa el sistema nervioso parasimpático', 'Presión abdominal sobre muslos estimula baroreceptores de calma', 'Postura de regulación de emergencia aplicable en cualquier momento', 'El adulto con mano en la espalda amplifica el efecto regulador'], profiles: { sensible: 'Postura de refugio ideal esta semana. Usar libremente.', buscador: 'Contar respiraciones en voz alta mientras la mantiene.', bajo_registro: 'Adulto pone manta o almohada encima para más input táctil.', motor: 'Comenzar con frente en manta doblada si no llega al suelo.' } },
    { id: 'mariposa', emoji: '🦋', name: 'Mariposa', magicName: 'La Raya que Baila en el Agua', storyNarration: 'Las rayas del océano de Iris bailan con las corrientes: sus alas suben y bajan sin esfuerzo, como si el agua las meciera.', howTo: 'Sentados, plantas de pies unidas. Las manos toman los pies. Mover rodillas suavemente arriba y abajo como alas. 15 veces. Luego mantener quieto e inclinarse levemente.', duration: '15 aleteos + 30 segundos quieto', sensoryBenefits: ['Apertura de caderas — libera tensión acumulada', 'El movimiento rítmico predecible regula el sistema vestibular', 'Ideal para antes de dormir', 'Para ADHD: el aleteo satisface necesidad de movimiento con estructura'], profiles: { sensible: 'Movimiento suave y predecible. Ideal para esta semana.', buscador: 'Contar los aleteos en voz alta, competir consigo mismo.', bajo_registro: 'Aletear fuerte y dramático.', motor: 'Empezar solo con los pies juntos, sin inclinarse todavía.' } },
    { id: 'cobra', emoji: '🐍', name: 'Cobra', magicName: 'La Serpiente que Sale del Mar', storyNarration: 'Cuando las olas se calman, una cobra de agua sube desde el fondo, abre el pecho y mira hacia la luz del sol por primera vez.', howTo: 'Boca abajo. Manos bajo los hombros. Inhalar y levantar el pecho despacio. Codos ligeramente doblados. Hombros atrás y abajo. Mirar suavemente hacia arriba. Repetir 3 veces.', duration: '3 repeticiones, 20–30 segundos cada una', sensoryBenefits: ['Apertura de pecho contrarresta la postura de cierre habitual en hiperresponsivos', 'Fortalece musculatura paravertebral', 'Activa energía después de posturas de regulación', 'Para bajo registro: cobra con empuje activo de manos amplifica propiocepción'], profiles: { sensible: 'Cobra suave — solo levantar la cabeza y el pecho levemente.', buscador: 'Empujar fuerte con las manos, ampliar la extensión.', bajo_registro: 'Cobra con empuje máximo de manos, extensión completa.', motor: 'Primero solo levantar la cabeza. Luego agregar el pecho en intento 2.' } },
    { id: 'puente', emoji: '🌉', name: 'Puente', magicName: 'La Gran Ola de Kawa', storyNarration: 'Kawa aprendió a hacer la ola más grande: su propio cuerpo se convierte en un puente entre el fondo del mar y la superficie.', howTo: 'Acostado boca arriba. Rodillas dobladas, pies planos al ancho de las caderas. Brazos pegados al cuerpo. Inhalar y subir las caderas hacia el cielo empujando los pies. Mantener 5 respiraciones. Bajar despacio.', duration: '3 repeticiones, 20–25 segundos cada una', sensoryBenefits: ['Apertura de pecho y caderas — libera tensión diafragmática', 'Propiocepción intensa en pies y muslos — activante', 'Para Bajo Registro: una de las posturas más activantes', 'Fortalece glúteos y musculatura posterior — base del control postural'], profiles: { sensible: 'Ritmo lento, mantener con música suave.', buscador: 'Contar en voz alta hasta 10. Subir y bajar varias veces.', bajo_registro: 'Mantener más tiempo. 5–6 repeticiones para mayor activación.', motor: 'Practicar solo doblar rodillas primero, luego subir caderas.' } }
  ],
  breathing: {
    name: 'Respiración Estrella — La Ola que Regresa',
    storyNarration: 'Iris le enseñó a Kawa que las estrellas de mar del Océano respiran distinto: inhalan 4 tiempos y exhalan 6, con un sonido suave como el mar que susurra. Ese "shhh" le dice al cuerpo: todo está bien.',
    howTo: 'Sentados, espalda larga. Inhalar por la nariz 4 tiempos. Exhalar por la boca con sonido "shhh" durante 6 tiempos. La exhalación siempre más larga. 5–6 ciclos. El adulto cuenta junto con el niño.',
    benefit: 'La exhalación prolongada activa el nervio vago directamente. La proporción 4:6 reduce el cortisol. El sonido "shhh" añade vibración que amplifica el efecto vagal.',
    whenToUse: 'Momento de crisis o desregulación, antes de situaciones difíciles, como práctica diaria preventiva.'
  },
  relaxationScript: `Cierra los ojos. Pon la tela azul sobre tu pecho si tienes una.

Imagina que estás flotando en el océano más tranquilo del mundo. El agua es tibia y azul y huele a sal y a lluvia. No necesitas hacer nada. El océano te sostiene.

Kawa está flotando a tu lado. Sus ojos están cerrados y tiene una sonrisa pequeña. Ya no tiene miedo del océano. Aprendió que las olas llegan y se van.

Siente cómo tu cuerpo flota... tus pies flotan... tus manos flotan... tu cabeza está apoyada en el agua como en una almohada.

Iris nada muy cerca, brillando de un azul suave. Te cuida sin que tengas que pedirle nada.

Cada vez que exhalas, escuchas el "shhh" del mar. El mar dice "shhh" porque sabe que todo está bien.

Cuando sientas que estás listo, mueve los dedos del agua. Estira los brazos. Respira una vez más el aire del océano. Abre los ojos despacio.`,
  profileAdaptations: {
    sensible: { icon: '🌸', name: 'Muy Sensible', color: '#AD1457', bgColor: '#FCE4EC', tips: ['Esta semana es perfecta — las posturas de calma son su especialidad', 'Tela azul: ofrecer, no imponer', 'Bol de agua: si hay rechazo al tacto, respetar', 'Postura del Niño: postura de refugio, usar libremente', 'Shhh puede ser muy bajo, casi un susurro', 'Evitar cambios bruscos entre posturas activas y pasivas'] },
    buscador: { icon: '⚡', name: 'Buscador/a', color: '#E65100', bgColor: '#FFF3E0', tips: ['Puente: mantener más tiempo, contar en voz alta hasta 10', 'Cobra: empujar fuerte con las manos', 'Jalea de Agua: movimiento exagerado, como olas grandes', 'Shhh bien fuerte — es catártico y satisfactorio', 'Mariposa: contar los aleteos, competir consigo mismo', 'Agregar transiciones activas entre posturas'] },
    bajo_registro: { icon: '🌊', name: 'Bajo Registro', color: '#0277BD', bgColor: '#E1F5FE', tips: ['Puente y Cobra son sus posturas estelares esta semana', 'Cobra: empujar MUY fuerte, extensión máxima', 'Tela: usarla para presión: enrollarse en ella antes del Shavasana', 'Bol de agua: tocar, agitar, meter las manos — activa el sistema', 'Shhh fuerte y dramático', 'Puente: 5–6 repeticiones'] },
    motor: { icon: '🧩', name: 'Planif. Motora', color: '#6A1B9A', bgColor: '#EDE7F6', tips: ['Cobra: primero solo levantar la cabeza, luego agregar el pecho', 'Puente: primero practicar doblar rodillas, luego subir caderas', 'Mariposa: empezar sin inclinarse — solo pies juntos', 'Gato fluido: separar en dos posturas antes de combinarlas', 'Instrucción UNA a la vez', 'Repetir cada postura 5 veces mínimo'] }
  },
  artActivity: {
    name: 'El Mapa de Emociones de Iris — El Pulpo de los Colores',
    materials: ['Plato de papel o cartón circular', '8 tiras de papel (los brazos)', 'Pinturas o marcadores de 8 colores', 'Ojos de plástico o dibujados'],
    steps: ['Pintar el plato de azul — la cabeza de Iris.', 'A cada brazo asignarle un color y una emoción (azul=calma, rojo=enojo, amarillo=alegría...)', 'Decorar cada brazo con la textura de esa emoción.', 'Pegar los brazos al plato. Agregar los ojos.'],
    therapeuticNote: 'Nombrar emociones en colores y texturas desarrolla inteligencia emocional en niños que no pueden verbalizarlas.'
  },
  physicalObject: {
    name: 'Tela Azul de Iris — La Ola Portátil',
    description: 'Trozo de tela suave azul de aprox. 50×50 cm. Objeto táctil-sensorial de la semana.',
    howToBuild: 'Comprar tela azul semitransparente en mercería, cortar en cuadrado. Opcional: bordar una pequeña ola. Para hipersensibles al tacto: elegir la textura más suave disponible.',
    therapeuticUse: 'La tela puede agitarse durante la canción, envolverse durante el Shavasana, sostenerse en momentos difíciles.'
  },
  microPractices: [
    { moment: 'Al despertar', toCalm: '3 respiraciones Shhh en la cama antes de levantarse', toActivate: 'Cobra suave en la cama (2 repeticiones)' },
    { moment: 'Transición difícil', toCalm: 'Postura del Niño donde sea, con tela encima si la tiene', toActivate: 'Puente 3 veces en el suelo' },
    { moment: 'Momento emocional', toCalm: 'Shhh: exhalar largo hasta que la ola pase, sostener la tela', toActivate: 'Mariposa: aletear 20 veces contando en voz alta' },
    { moment: 'Antes de dormir', toCalm: 'Mariposa + Postura del Niño + 5 respiraciones Shhh', toActivate: 'Cobra suave 2 veces + Puente 2 veces + Shavasana' }
  ],
  isModule: {
    title: 'Semana 2: El Sistema Nervioso y la Ventana de Tolerancia',
    duration: '10–12 minutos',
    systemWorked: 'Sistema Nervioso Autónomo',
    keyQuestion: '¿Por qué mi hijo se desregula tan rápido y tan fuerte?',
    content: [
      'La ventana de tolerancia es el rango de activación en que el sistema nervioso puede aprender y relacionarse. Cuando el niño está fuera de ella (muy arriba o muy abajo), no puede "escuchar" ni aprender.',
      'La desregulación no es manipulación ni capricho — es neurología. El sistema nervioso recibió más de lo que puede procesar en ese momento.',
      'Las posturas de agua actúan sobre tres mecanismos: (1) activación del nervio vago con la respiración larga, (2) input propioceptivo calmante con la presión suave, (3) estimulación vestibular organizada con los movimientos rítmicos.',
      'La Respiración Estrella (4:6) es la herramienta más eficiente de regulación rápida disponible. Enseñarla cuando el niño está tranquilo para que la tenga cuando no lo esté.',
      'El color del pulpo Iris es una herramienta de identificación emocional: preguntar "¿de qué color estás hoy?" antes de cada sesión para leer el estado de activación.'
    ],
    parentTakeaway: 'Esta semana: observa qué señales corporales preceden a la desregulación de tu hijo (respiración, postura, tono de voz). Esas señales son tu ventana para intervenir antes.'
  }
}

// ─── WEEKS 3, 4, 5 — same structure, abbreviated here ─────────────────────────
// (In production, complete all 5 weeks with full data following week1 pattern)

const week3: Week = { ...week1, id: 3, element: 'Aire', elementEmoji: '💨', guardian: 'Inti', guardianSpecies: 'el Cóndor', color: '#6A1B9A', colorLight: '#EDE7F6', colorName: 'Morado viento', symbol: 'Espiral que sube', tactileObject: 'Pluma de ave o papel liviano', teaching: 'Expandirse es la forma más valiente de existir', story: week1.story, song: { name: 'El HA de Inti', lyrics: ['Inti vuela alto, yo también puedo volar,', 'abro mis brazos hasta no poder más.', '¡HA! dice el cóndor al borde del cielo,', '¡HA! digo yo y pierdo el miedo.', '', 'Soy guerrero/a, soy guerrero/a,', 'de la luz y del viento soy hecho/a.', '¡HA! ¡HA! ¡HA!', 'El viento me lleva pero no me dobla.'], howToUse: 'Cantar durante el Guerrero II. En cada ¡HA! todos exhalan fuerte.', rhythm: 'Rítmico y poderoso, 4/4.' }, sessionStructure: week1.sessionStructure, posturas: week1.posturas, breathing: week1.breathing, relaxationScript: week1.relaxationScript, profileAdaptations: week1.profileAdaptations, artActivity: { name: 'El Escudo de Kawa — Mi Fuerza en una Imagen', materials: ['Cartón resistente A3', 'Témperas', 'Marcadores gruesos', 'Brillantina dorada'], steps: ['Recortar el cartón en forma de escudo.', 'Dividir en 4 cuadrantes: ANIMAL FAVORITO / ELEMENTO / SUPERPODER / NOMBRE MÁGICO.', 'Pintar cada cuadrante.', 'Decorar con brillantina y pegar la pluma de Inti en el centro.'], therapeuticNote: 'El escudo es un objeto transicional que puede acompañar al niño a situaciones de estrés.' }, physicalObject: { name: 'Pluma de Inti — La Ligereza que Se Lleva', description: 'Una pluma real de ave o decorativa de 15–20 cm.', howToBuild: 'Buscar en la naturaleza o comprar. Opcional: teñir la punta con acuarela morada.', therapeuticUse: 'Soplar la pluma al inicio de la sesión (input oral-motor regulador).' }, microPractices: week1.microPractices, isModule: { title: 'Semana 3: Dieta Sensorial y Activación Consciente', duration: '10–12 minutos', systemWorked: 'Sistema Vestibular + Propioceptivo', keyQuestion: '¿Por qué mi hijo no puede quedarse quieto y cómo canalizar esa energía?', content: ['La dieta sensorial es una combinación planificada de actividades físicas que mantiene el sistema nervioso organizado.', 'Para el niño con bajo registro o buscador, la activación consciente es medicina preventiva.', 'Las posturas de aire (Guerrero, Triángulo, Barco) dan el input propioceptivo y vestibular intenso que estos niños buscan de forma más disruptiva.', 'El sonido HA es una herramienta de descarga controlada: vacía el CO2 acumulado y activa el nervio vago.', 'La secuencia: activación (HA, Guerrero) → integración (Puente) → calma (Postura del Niño) es el modelo de dieta sensorial en miniatura.'], parentTakeaway: 'Esta semana: identifica los momentos del día en que tu hijo más busca movimiento. Programa ahí una "dosis" de activación de yoga de 5 minutos para satisfacer el sistema antes de que busque hacerlo solo.' } }

const week4: Week = { ...week1, id: 4, element: 'Fuego', elementEmoji: '🔥', guardian: 'Lumi', guardianSpecies: 'la Salamandra', color: '#BF360C', colorLight: '#FBE9E7', colorName: 'Naranja volcán', symbol: 'Espiral que transforma', tactileObject: 'Piedra naranja o cálida', teaching: 'El fuego no destruye — transforma', story: week1.story, song: { name: 'Mi Llama Interior', lyrics: ['Tengo fuego en el pecho que no se apaga,', 'es mi amor, es mi fuerza, es mi magia.', 'Lumi me enseña con piel de volcán:', '"lo que te asusta también te da pan."', '', 'Llama, llama, arde suavecito,', 'no quemes a nadie — solo ilumina.', 'Respiro el fuego, lo hago mío,', 'y Kawa baila en el calor tibio.'], howToUse: 'Cantar durante la Cobra y el Saludo al Sol. En el verso "Llama, llama" poner las manos en el pecho.', rhythm: 'Suave y constante, 4/4. La canción del reconocimiento, no de la energía.' }, sessionStructure: week1.sessionStructure, posturas: week1.posturas, breathing: week1.breathing, relaxationScript: week1.relaxationScript, profileAdaptations: week1.profileAdaptations, artActivity: { name: 'Mi Mandala de Kawa — El Mapa de los 4 Mundos', materials: ['Plato de papel grande', 'Pinturas de los 4 colores del curso', 'Brillantina dorada', 'Los 4 objetos del curso'], steps: ['Trazar 4 círculos concéntricos.', 'Círculo interior: dibujar a Kawa como semilla.', 'Segundo círculo: 4 cuartos con el color de cada elemento.', 'Tercer círculo: los 4 guardianes.', 'Círculo exterior: símbolos del curso y brillantina.'], therapeuticNote: 'La organización circular del mandala tiene efecto meditativo documentado. Es el ritual de integración de los 4 mundos.' }, physicalObject: { name: 'Piedra de Lumi — El Calor que Se Lleva', description: 'Una piedra de color naranja o rojizo, suave, tamaño de la palma.', howToBuild: 'Buscar jaspe naranja en tienda de minerales. O pintar piedra suave con acrílico naranja. Opcional: calentar al sol antes de la sesión.', therapeuticUse: 'Para niños que buscan estimulación propioceptiva: apretar y soltar la piedra es un regulador portable.' }, microPractices: week1.microPractices, isModule: { title: 'Semana 4: Interoceptividad — El Sentido que Nadie Enseña', duration: '12 minutos', systemWorked: 'Sistema Interoceptivo', keyQuestion: '¿Por qué mi hijo no siente hambre, no siente frío o no reconoce sus propias emociones?', content: ['La interoceptividad es el sentido que percibe el estado interno del cuerpo: hambre, calor, latido, emociones físicas.', 'Muchos niños neurodivergentes tienen interoceptividad reducida — no "leen" las señales de su propio cuerpo.', 'Las posturas de fuego (manos en el pecho, Cobra, Flor de Loto) entrenan la conciencia del estado interno.', 'El ejercicio "¿qué sientes en el pecho?" antes y después de cada postura es un entrenamiento interoceptivo directo.', 'La piedra cálida en el cuerpo durante el Shavasana activa la conciencia táctil interna — un input interoceptivo concreto.'], parentTakeaway: 'Esta semana: varias veces al día pregunta "¿Cómo está tu cuerpo ahora?" sin evaluar la respuesta. Solo escuchar y validar. Esto entrena la interoceptividad.' } }

const week5: Week = { ...week1, id: 5, element: 'Espacio', elementEmoji: '✨', guardian: 'la Ballena Cósmica', guardianSpecies: '', color: '#1A237E', colorLight: '#E8EAF6', colorName: 'Índigo estrella', symbol: 'Círculo completo', tactileObject: 'Tela oscura con estrellas', teaching: 'El universo entero cabe en una semilla', story: week1.story, song: { name: 'Kawa Llega a Casa', lyrics: ['Viajé por la tierra, el agua y el viento,', 'el fuego me hizo, el espacio es mi centro.', 'Llevo una piedra, una tela, una pluma,', 'y una llama adentro que todo lo suma.', '', 'OM... el universo soy yo.', 'OM... y estaba en mi corazón.', 'OM... no hay lugar a donde ir,', 'porque yo ya soy el inicio y el fin.'], howToUse: 'Sentados en Flor de Loto con los 4 objetos del curso. Los OM se cantan largo.', rhythm: 'Muy lento, contemplativo. Los OM pueden durar todo lo que el niño necesite.' }, sessionStructure: week1.sessionStructure, posturas: week1.posturas, breathing: week1.breathing, relaxationScript: `Cierra los ojos. Pon la piedra verde en una mano, la tela azul en la otra. La pluma sobre tu corazón. La piedra naranja en tu pancita.

Sientes el peso de cada objeto. Cuatro mundos que recorriste.

Kawa está contigo. No a tu lado — dentro de ti. Porque tú eres Kawa. Siempre lo fuiste.

La Ballena Cósmica nada muy lejos, tan lejos que se confunde con las estrellas. Pero su vibración llega hasta ti. La sientes en el pecho.

Toodo... está... bien. No hay lugar a donde ir. Ya llegaste.

Eres tierra. Eres agua. Eres aire. Eres fuego. Eres espacio.

Eres una semilla que contiene el universo entero.

Cuando estés listo, mueve suavemente los dedos. Abre los ojos despacio. Bienvenido/a a casa.`, profileAdaptations: week1.profileAdaptations, artActivity: { name: 'El Diario Completo de Kawa — El Libro del Viaje', materials: ['Las 5 páginas del diario', 'Los 4 objetos del curso para fotografiar', 'Pegamento y tijeras', 'Una portada especial'], steps: ['Reunir todas las páginas del diario de las 5 semanas.', 'Crear una portada: los 5 mundos y Kawa en el centro.', 'Añadir página final: "Lo que aprendí en cada mundo".', 'El adulto escribe una dedicatoria personal al niño.', 'Encuadernar con hilo o broche.'], therapeuticNote: 'El libro terminado es la narrativa personal del niño materializada. Para niños con dificultades de comunicación: este libro habla por ellos.' }, physicalObject: { name: 'Diploma de Guardián/a del Equilibrio', description: 'Un diploma real con el nombre del niño y los 5 símbolos del curso.', howToBuild: 'Opción 1: plantilla imprimible. Opción 2: papel de acuarela con letra bonita, los 5 mundos, el nombre. El adulto lo firma.', therapeuticUse: 'La ceremonia de entrega es el ritual de cierre. El diploma puede colgarse en el cuarto del niño.' }, microPractices: [{ moment: 'Cada mañana', toCalm: 'Respiración Cósmica (2 min): las 4 respiraciones unidas', toActivate: 'Saludo al Sol 1 ciclo + OM para comenzar el día' }, { moment: 'Cuando algo es difícil', toCalm: '¿Qué guardián necesito? (Oma=calma, Iris=fluir, Inti=fuerza, Lumi=valentía)', toActivate: 'Respiración del guardián que más necesitan en ese momento' }, { moment: 'Con la familia', toCalm: 'Secuencia Completa de Kawa en familia, 1 vez por semana', toActivate: 'Cada miembro elige su postura favorita y la enseña' }, { moment: 'Antes de dormir', toCalm: '3 OM en Flor de Loto + Shavasana de 5 minutos', toActivate: 'Poner los 4 objetos del curso en la mesita como ancla visual' }], isModule: { title: 'Semana 5: Integración Sensorial — El Sistema Completo', duration: '12–15 minutos', systemWorked: 'Integración multisensorial', keyQuestion: '¿Cómo sé si el yoga sensorial está funcionando en mi hijo?', content: ['La integración sensorial es el proceso por el cual el cerebro organiza la información de todos los sentidos para producir una respuesta apropiada.', 'Después de 5 semanas de práctica, los indicadores de integración incluyen: el niño pide yoga espontáneamente, usa respiraciones para regularse solo, enseña posturas a otros.', 'La práctica no termina aquí — el cuerpo consolidó una biblioteca de herramientas. La semana 5 es el comienzo de una práctica de por vida.', 'Para mantener la práctica: anclar a una rutina existente (antes del colegio, después de bañarse). La consistencia importa más que la duración.', 'La secuencia completa de Kawa (los 5 mundos en un movimiento continuo) es la práctica de mantenimiento más completa.'], parentTakeaway: 'Esta semana y de ahora en adelante: 5 minutos de Secuencia Completa de Kawa + 3 OM antes de dormir. Eso es suficiente para mantener todo lo que construyeron.' } }

// ─── EXPORT ────────────────────────────────────────────────────────────────────

export const COURSE_WEEKS: Week[] = [week1, week2, week3, week4, week5]

export const WEEK_COLORS = {
  1: { main: '#2D6A4F', light: '#E8F5E9', name: 'tierra' },
  2: { main: '#0277BD', light: '#E1F5FE', name: 'agua' },
  3: { main: '#6A1B9A', light: '#EDE7F6', name: 'aire' },
  4: { main: '#BF360C', light: '#FBE9E7', name: 'fuego' },
  5: { main: '#1A237E', light: '#E8EAF6', name: 'espacio' },
}
