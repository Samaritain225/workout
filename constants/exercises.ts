import { Exercise } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
  // ABS
  {
    id: 'crunches',
    name: 'Crunches',
    tag: 'abs',
    reps: 20,
    unit: 'reps',
    instructions: {
      en: "Lie on your back like a turtle stuck on its shell. Bend your knees, put your hands behind your head, and try to bring your chest up to look at your belly button! Squeeze your tummy!",
      fr: "Allonge-toi sur le dos comme une tortue coincée sur sa carapace. Plie les genoux, mets tes mains derrière la tête, et essaie de soulever ta poitrine pour regarder ton nombril ! Serre bien le ventre !"
    },
    videoUrl: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    equipment: ['none'],
  },
  {
    id: 'leg_raises',
    name: 'Leg Raises',
    tag: 'abs',
    reps: 15,
    unit: 'reps',
    instructions: {
      en: "Lie down super flat. Keep your legs straight like two stiff boards and lift them up together until they point to the ceiling. Then lower them down super slowly without letting them touch the floor!",
      fr: "Allonge-toi bien à plat. Garde tes jambes droites comme deux planches et lève-les ensemble jusqu'à ce qu'elles pointent vers le plafond. Ensuite, redescends-les très lentement sans toucher le sol !"
    },
    videoUrl: 'https://www.youtube.com/watch?v=l4kQd9eWclE',
    equipment: ['none'],
  },
  {
    id: 'plank',
    name: 'Plank',
    tag: 'abs',
    reps: 45,
    unit: 'sec',
    instructions: {
      en: "Get into a push-up position but rest on your elbows. Make your body as stiff and straight as a wooden plank! Don't let your hips sag down or stick up in the air. Hold it like a statue!",
      fr: "Mets-toi en position de pompe mais repose-toi sur tes coudes. Rends ton corps aussi raide et droit qu'une planche en bois ! Ne laisse pas tes hanches s'affaisser ou monter en l'air. Reste figé comme une statue !"
    },
    videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    equipment: ['none'],
  },
  // UPPER
  {
    id: 'push_ups',
    name: 'Push-ups',
    tag: 'upper',
    reps: 12,
    unit: 'reps',
    instructions: {
      en: "Start like a stiff plank on your hands and toes. Lower your whole body down together until your nose almost touches the floor, then push the earth away from you to go back up!",
      fr: "Commence comme une planche droite sur tes mains et tes orteils. Descends tout ton corps d'un coup jusqu'à ce que ton nez touche presque le sol, puis repousse la terre loin de toi pour remonter !"
    },
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    equipment: ['none'],
  },
  {
    id: 'dips',
    name: 'Bench Dips',
    tag: 'upper',
    reps: 12,
    unit: 'reps',
    instructions: {
      en: "Sit on the edge of a chair, put your hands next to your hips, and walk your feet out. Slide your bum off the chair and lower yourself down by bending your elbows, then push yourself back up!",
      fr: "Assieds-toi au bord d'une chaise, mets tes mains près de tes hanches et avance tes pieds. Glisse tes fesses hors de la chaise et descends en pliant les coudes, puis pousse pour remonter !"
    },
    videoUrl: 'https://www.youtube.com/watch?v=0326dy_-CzM',
    equipment: ['none'],
  },
  // LEGS
  {
    id: 'squats',
    name: 'Squats',
    tag: 'legs',
    reps: 20,
    unit: 'reps',
    instructions: {
      en: "Pretend you are about to sit down on an invisible mini-chair behind you. Keep your chest up proudly like a superhero, bend your knees, sit back, and stand back up!",
      fr: "Fais semblant de t'asseoir sur une mini-chaise invisible derrière toi. Garde la poitrine haute comme un super-héros, plie les genoux, assieds-toi en arrière, puis relève-toi !"
    },
    videoUrl: 'https://www.youtube.com/watch?v=gcNh17Ckjgg',
    equipment: ['none'],
  },
  {
    id: 'lunges',
    name: 'Lunges',
    tag: 'legs',
    reps: 10,
    unit: 'reps/leg',
    instructions: {
      en: "Take a giant step forward and drop your back knee straight down toward the floor like you are going to tie your shoe, but don't touch the ground! Push back up and switch legs.",
      fr: "Fais un pas de géant en avant et descends ton genou arrière vers le sol comme si tu allais lacer ta chaussure, mais ne touche pas le sol ! Pousse pour remonter et change de jambe."
    },
    videoUrl: 'https://www.youtube.com/watch?v=L8fyJH_R3V8',
    equipment: ['none'],
  },
  {
    id: 'db_chest_press',
    name: 'Dumbbell Chest Press',
    tag: 'upper',
    reps: 12,
    unit: 'reps',
    instructions: {
      en: "Lie flat on your back like you're sleeping. Hold your dumbbells and push them straight up to the sky until your arms are locked, then bring them back down slowly like a slow-motion movie.",
      fr: "Allonge-toi sur le dos comme si tu dormais. Prends tes haltères et pousse-les tout droit vers le ciel jusqu'à ce que tes bras soient tendus, puis redescends-les doucement comme dans un film au ralenti."
    },
    thumbnail: require('../assets/images/exercises/chest_press.png'),
    equipment: ['dumbbells'],
  },
  {
    id: 'db_goblet_squat',
    name: 'Goblet Squat',
    tag: 'legs',
    reps: 15,
    unit: 'reps',
    instructions: {
      en: "Hold one dumbbell vertically with both hands right against your chest, like you are hugging a giant heavy cup of hot chocolate! Now, squat down on your invisible chair and stand back up.",
      fr: "Tiens un haltère à la verticale avec tes deux mains contre ta poitrine, comme si tu serrais une grosse tasse lourde de chocolat chaud ! Maintenant, fais ton squat sur ta chaise invisible et relève-toi."
    },
    thumbnail: require('../assets/images/exercises/goblet_squat.png'),
    equipment: ['dumbbells'],
  },
  {
    id: 'db_lunges',
    name: 'Dumbbell Lunges',
    tag: 'legs',
    reps: 10,
    unit: 'reps/leg',
    instructions: {
      en: "Hold a dumbbell in each hand like you are carrying two heavy suitcases. Take a giant step forward, bend both knees down, and then push hard to stand back up!",
      fr: "Tiens un haltère dans chaque main comme si tu portais deux valises lourdes. Fais un pas de géant en avant, plie les deux genoux vers le bas, puis pousse fort pour te relever !"
    },
    thumbnail: require('../assets/images/exercises/lunges.png'),
    equipment: ['dumbbells'],
  },
  {
    id: 'db_rows',
    name: 'Dumbbell Rows',
    tag: 'upper',
    reps: 12,
    unit: 'reps/arm',
    instructions: {
      en: "Bend over and put one hand and one knee on a bench so your back is flat like a table. With your free hand, pull the dumbbell straight up to your belly button like you are starting a lawnmower!",
      fr: "Penche-toi et pose une main et un genou sur un banc pour que ton dos soit plat comme une table. Avec ta main libre, tire l'haltère vers ton nombril comme si tu démarrais une tondeuse à gazon !"
    },
    thumbnail: require('../assets/images/exercises/rows.png'),
    equipment: ['dumbbells'],
  },
  {
    id: 'glute_bridges',
    name: 'Glute Bridges',
    tag: 'legs',
    reps: 20,
    unit: 'reps',
    instructions: {
      en: "Lie on your back, bend your knees, and put your feet flat on the floor. Now, push your hips up high to the sky to make a bridge with your body! Squeeze your bum super hard at the top!",
      fr: "Allonge-toi sur le dos, plie les genoux et mets tes pieds à plat sur le sol. Maintenant, pousse tes hanches très haut vers le ciel pour faire un pont avec ton corps ! Serre les fesses super fort en haut !"
    },
    thumbnail: require('../assets/images/exercises/glute_bridges.png'),
    equipment: ['none'],
  },
  {
    id: 'reverse_crunches',
    name: 'Reverse Crunches',
    tag: 'abs',
    reps: 15,
    unit: 'reps',
    instructions: {
      en: "Lie on your back and lift your legs up in the air. Use your tummy muscles to roll your hips up off the floor and bring your knees close to your face, then roll back down slowly!",
      fr: "Allonge-toi sur le dos et lève tes jambes en l'air. Utilise les muscles de ton ventre pour décoller tes hanches du sol et ramener tes genoux vers ton visage, puis redescends doucement !"
    },
    thumbnail: require('../assets/images/exercises/reverse_crunches.png'),
    equipment: ['none'],
  },
];
