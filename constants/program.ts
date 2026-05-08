import { Week } from '../types';

export const WEEKS: Week[] = [
  {
    id: 'w1',
    label: 'Week 1',
    phase: 'Phase 1 — Foundation',
    phaseColor: 'blue',
    title: 'Learn the movements',
    desc: 'Focus 100% on form. Light reps, no rushing. Your body is adapting.',
    session: {
      morning: [
        { id: 'wide-pushup', name: 'Wide push-ups', tag: 'upper', reps: 10, unit: 'reps' },
        { id: 'pike-pushup', name: 'Pike push-ups', tag: 'upper', reps: 6, unit: 'reps' },
        { id: 'squat', name: 'Squats', tag: 'legs', reps: 12, unit: 'reps' },
        { id: 'lunge', name: 'Lunges', tag: 'legs', reps: 8, unit: 'each leg' },
        { id: 'leg-raise', name: 'Leg raises', tag: 'abs', reps: 8, unit: 'reps' },
        { id: 'plank-m', name: 'Plank', tag: 'core', reps: 20, unit: 'seconds' },
      ],
      night: [
        { id: 'reg-pushup', name: 'Regular push-ups', tag: 'upper', reps: 10, unit: 'reps' },
        { id: 'diamond-pushup', name: 'Diamond push-ups', tag: 'upper', reps: 5, unit: 'reps' },
        { id: 'glute-bridge', name: 'Glute bridges', tag: 'legs', reps: 12, unit: 'reps' },
        { id: 'rev-crunch', name: 'Reverse crunches', tag: 'abs', reps: 8, unit: 'reps' },
        { id: 'bicycle', name: 'Bicycle crunches', tag: 'abs', reps: 8, unit: 'each side' },
        { id: 'plank-n', name: 'Plank', tag: 'core', reps: 20, unit: 'seconds' },
      ],
      note: "Don't worry about reps feeling easy. You are training your nervous system to learn the movements correctly. Bad form now = bad habits forever.",
    },
  },
  {
    id: 'w2',
    label: 'Week 2',
    phase: 'Phase 1 — Foundation',
    phaseColor: 'blue',
    title: 'Build consistency',
    desc: 'Small rep increase. You should start feeling more comfortable with each exercise.',
    session: {
      morning: [
        { id: 'wide-pushup', name: 'Wide push-ups', tag: 'upper', reps: 12, delta: '+2', unit: 'reps' },
        { id: 'pike-pushup', name: 'Pike push-ups', tag: 'upper', reps: 8, delta: '+2', unit: 'reps' },
        { id: 'squat', name: 'Squats', tag: 'legs', reps: 15, delta: '+3', unit: 'reps' },
        { id: 'lunge', name: 'Lunges', tag: 'legs', reps: 10, delta: '+2', unit: 'each leg' },
        { id: 'leg-raise', name: 'Leg raises', tag: 'abs', reps: 10, delta: '+2', unit: 'reps' },
        { id: 'plank-m', name: 'Plank', tag: 'core', reps: 25, delta: '+5s', unit: 'seconds' },
      ],
      night: [
        { id: 'reg-pushup', name: 'Regular push-ups', tag: 'upper', reps: 12, delta: '+2', unit: 'reps' },
        { id: 'diamond-pushup', name: 'Diamond push-ups', tag: 'upper', reps: 7, delta: '+2', unit: 'reps' },
        { id: 'glute-bridge', name: 'Glute bridges', tag: 'legs', reps: 15, delta: '+3', unit: 'reps' },
        { id: 'rev-crunch', name: 'Reverse crunches', tag: 'abs', reps: 10, delta: '+2', unit: 'reps' },
        { id: 'bicycle', name: 'Bicycle crunches', tag: 'abs', reps: 10, delta: '+2', unit: 'each side' },
        { id: 'plank-n', name: 'Plank', tag: 'core', reps: 25, delta: '+5s', unit: 'seconds' },
      ],
      note: "Muscles may still be sore on day 1–2 — that's normal, it means they're rebuilding. Push through gently. If something hurts (not burns), skip it for a day.",
    },
  },
  {
    id: 'w3',
    label: 'Week 3',
    phase: 'Phase 2 — Building',
    phaseColor: 'green',
    title: 'Start feeling stronger',
    desc: 'Reps go up again. You should notice the first exercises feeling noticeably easier than day 1.',
    session: {
      morning: [
        { id: 'wide-pushup', name: 'Wide push-ups', tag: 'upper', reps: 14, delta: '+2', unit: 'reps' },
        { id: 'pike-pushup', name: 'Pike push-ups', tag: 'upper', reps: 10, delta: '+2', unit: 'reps' },
        { id: 'squat', name: 'Squats', tag: 'legs', reps: 18, delta: '+3', unit: 'reps' },
        { id: 'lunge', name: 'Lunges', tag: 'legs', reps: 12, delta: '+2', unit: 'each leg' },
        { id: 'leg-raise', name: 'Leg raises', tag: 'abs', reps: 12, delta: '+2', unit: 'reps' },
        { id: 'plank-m', name: 'Plank', tag: 'core', reps: 35, delta: '+10s', unit: 'seconds' },
      ],
      night: [
        { id: 'reg-pushup', name: 'Regular push-ups', tag: 'upper', reps: 14, delta: '+2', unit: 'reps' },
        { id: 'diamond-pushup', name: 'Diamond push-ups', tag: 'upper', reps: 9, delta: '+2', unit: 'reps' },
        { id: 'glute-bridge', name: 'Glute bridges', tag: 'legs', reps: 18, delta: '+3', unit: 'reps' },
        { id: 'rev-crunch', name: 'Reverse crunches', tag: 'abs', reps: 12, delta: '+2', unit: 'reps' },
        { id: 'bicycle', name: 'Bicycle crunches', tag: 'abs', reps: 12, delta: '+2', unit: 'each side' },
        { id: 'plank-n', name: 'Plank', tag: 'core', reps: 35, delta: '+10s', unit: 'seconds' },
      ],
      note: "This is where most people see their first results — clothes fit slightly differently, posture improves. Stay consistent and don't skip nights.",
    },
  },
  {
    id: 'w4',
    label: 'Week 4',
    phase: 'Phase 2 — Building',
    phaseColor: 'green',
    title: 'Deload & consolidate',
    desc: 'Intentionally lighter than week 3. Let your body fully absorb the gains.',
    isDeload: true,
    session: {
      morning: [
        { id: 'wide-pushup', name: 'Wide push-ups', tag: 'upper', reps: 12, unit: 'reps', sub: 'easy pace' },
        { id: 'pike-pushup', name: 'Pike push-ups', tag: 'upper', reps: 8, unit: 'reps', sub: 'easy pace' },
        { id: 'squat', name: 'Squats', tag: 'legs', reps: 15, unit: 'reps', sub: 'slow' },
        { id: 'lunge', name: 'Lunges', tag: 'legs', reps: 10, unit: 'each leg' },
        { id: 'leg-raise', name: 'Leg raises', tag: 'abs', reps: 10, unit: 'reps', sub: 'extra slow' },
        { id: 'plank-m', name: 'Plank', tag: 'core', reps: 30, unit: 'seconds' },
      ],
      night: [
        { id: 'reg-pushup', name: 'Regular push-ups', tag: 'upper', reps: 12, unit: 'reps', sub: 'easy pace' },
        { id: 'diamond-pushup', name: 'Diamond push-ups', tag: 'upper', reps: 7, unit: 'reps' },
        { id: 'glute-bridge', name: 'Glute bridges', tag: 'legs', reps: 15, unit: 'reps' },
        { id: 'rev-crunch', name: 'Reverse crunches', tag: 'abs', reps: 10, unit: 'reps' },
        { id: 'bicycle', name: 'Bicycle crunches', tag: 'abs', reps: 10, unit: 'each side' },
        { id: 'plank-n', name: 'Plank', tag: 'core', reps: 30, unit: 'seconds' },
      ],
      note: "Muscles grow during rest, not during training. A lighter week every month prevents burnout and actually makes you stronger going into the next phase. Don't skip this.",
    },
  },
  {
    id: 'w5',
    label: 'Weeks 5–6',
    phase: 'Phase 3 — Intensity',
    phaseColor: 'orange',
    title: 'Push harder',
    desc: 'Higher reps + longer plank. Your body is now ready for real challenge.',
    session: {
      morning: [
        { id: 'wide-pushup', name: 'Wide push-ups', tag: 'upper', reps: 16, unit: 'reps' },
        { id: 'pike-pushup', name: 'Pike push-ups', tag: 'upper', reps: 12, unit: 'reps' },
        { id: 'squat', name: 'Squats', tag: 'legs', reps: 20, unit: 'reps' },
        { id: 'lunge', name: 'Lunges', tag: 'legs', reps: 14, unit: 'each leg' },
        { id: 'leg-raise', name: 'Leg raises', tag: 'abs', reps: 14, unit: 'reps' },
        { id: 'plank-m', name: 'Plank', tag: 'core', reps: 45, unit: 'seconds' },
      ],
      night: [
        { id: 'reg-pushup', name: 'Regular push-ups', tag: 'upper', reps: 16, unit: 'reps' },
        { id: 'diamond-pushup', name: 'Diamond push-ups', tag: 'upper', reps: 12, unit: 'reps' },
        { id: 'glute-bridge', name: 'Glute bridges', tag: 'legs', reps: 20, unit: 'reps' },
        { id: 'rev-crunch', name: 'Reverse crunches', tag: 'abs', reps: 14, unit: 'reps' },
        { id: 'bicycle', name: 'Bicycle crunches', tag: 'abs', reps: 14, unit: 'each side' },
        { id: 'plank-n', name: 'Plank', tag: 'core', reps: 45, unit: 'seconds' },
      ],
      note: "Keep adding 2 reps per exercise each week if manageable. Always finish the last rep feeling like you could do 1–2 more — not 10 more, not zero.",
    },
  },
  {
    id: 'w6',
    label: 'Weeks 7–8',
    phase: 'Phase 3 — Intensity',
    phaseColor: 'orange',
    title: 'Deload + upgrade',
    desc: 'Week 7 = deload. Week 8 = resume with upgraded exercises.',
    isDeload: true,
    session: {
      morning: [
        { id: 'wide-pushup', name: 'Wide push-ups', tag: 'upper', reps: 14, unit: 'reps', sub: 'deload wk7' },
        { id: 'pike-pushup', name: 'Pike push-ups', tag: 'upper', reps: 10, unit: 'reps' },
        { id: 'jump-squat', name: 'Jump squats', tag: 'legs', reps: 12, unit: 'reps', sub: 'wk8 only', isNew: true },
        { id: 'lunge', name: 'Lunges', tag: 'legs', reps: 12, unit: 'each leg' },
        { id: 'leg-raise', name: 'Leg raises', tag: 'abs', reps: 14, unit: 'reps' },
        { id: 'plank-m', name: 'Plank', tag: 'core', reps: 50, unit: 'seconds' },
      ],
      night: [
        { id: 'reg-pushup', name: 'Regular push-ups', tag: 'upper', reps: 14, unit: 'reps' },
        { id: 'diamond-pushup', name: 'Diamond push-ups', tag: 'upper', reps: 12, unit: 'reps' },
        { id: 'glute-bridge', name: 'Glute bridges', tag: 'legs', reps: 20, unit: 'reps' },
        { id: 'rev-crunch', name: 'Reverse crunches', tag: 'abs', reps: 14, unit: 'reps' },
        { id: 'bicycle', name: 'Bicycle crunches', tag: 'abs', reps: 14, unit: 'each side' },
        { id: 'side-plank', name: 'Side plank', tag: 'core', reps: 25, unit: 'sec each side', sub: 'wk8 only', isNew: true },
      ],
      note: "Week 7: deload at ~80% reps, focus on perfect slow form. Week 8: add jump squats (explosive — jump at the top) and side plank for obliques.",
    },
  },
  {
    id: 'w7',
    label: 'Month 3+',
    phase: 'Phase 4 — Long term',
    phaseColor: 'purple',
    title: 'Your own pace',
    desc: 'By now you know your body. Apply the golden rule every week.',
    isLongTerm: true,
    session: {
      morning: [],
      night: [],
      note: "At month 3 the hardest part is already behind you. Habits are formed around week 3–4. If you made it here, you will keep going.",
    },
  },
];

export const GOLDEN_RULES = [
  'If an exercise feels easy for 3 sessions in a row → add 2–3 reps',
  'Plank easy for 3 sessions → add 10 seconds',
  'Every 4 weeks → take a deload week at ~80% reps',
  'Never add reps to two different exercises the same week',
];

export const UPGRADES = [
  { name: 'Archer push-ups', desc: 'One arm takes most of the load — toward one-arm push-up' },
  { name: 'Bulgarian split squats', desc: 'Rear foot elevated lunge — much harder than regular lunges' },
  { name: 'Decline push-ups', desc: 'Feet on a chair — loads upper chest and shoulders more' },
  { name: 'Dragon flags', desc: 'Hardest abs exercise — full body lever from a surface' },
  { name: 'Jumping rope', desc: 'Add 5–10 min as a third daily session when you get yours' },
];

export const TAG_LABELS: Record<string, string> = {
  upper: 'Upper',
  abs: 'Abs',
  legs: 'Legs',
  core: 'Core',
};

// How many weeks into the program each "week card" starts at
export const WEEK_START_OFFSETS = [0, 1, 2, 3, 4, 6, 8];

export function getWeekIndexFromStartDate(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7); // 0-indexed week number

  // Map actual week number to our program week cards
  if (weekNumber <= 0) return 0; // w1
  if (weekNumber === 1) return 1; // w2
  if (weekNumber === 2) return 2; // w3
  if (weekNumber === 3) return 3; // w4 (deload)
  if (weekNumber <= 5) return 4;  // w5 (weeks 5-6)
  if (weekNumber <= 7) return 5;  // w6 (weeks 7-8)
  return 6;                        // w7 (month 3+)
}
