import { NON_BOSS, BOSS_CHALLENGE } from '../data/challenges.js'

function seededRandom(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13; h ^= h >> 7; h ^= h << 17
    return (h >>> 0) / 0xFFFFFFFF
  }
}

function shuffle(arr, rand) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getDailyChallenges(dateStr) {
  const rand = seededRandom(dateStr)
  const includeBoss = rand() < 0.20

  if (includeBoss) {
    const shuffled = shuffle(NON_BOSS, rand)
    return [BOSS_CHALLENGE, ...shuffled.slice(0, 4)]
  }

  const zones = ['movement', 'nutrition', 'recovery', 'mindset']
  const picked = []
  const used = new Set()

  for (const zone of zones) {
    const pool = NON_BOSS.filter(c => c.zone === zone)
    const shuffledPool = shuffle(pool, rand)
    const pick = shuffledPool.find(c => !used.has(c.id))
    if (pick) { picked.push(pick); used.add(pick.id) }
  }

  const remaining = shuffle(NON_BOSS.filter(c => !used.has(c.id)), rand)
  picked.push(remaining[0])

  return shuffle(picked, rand)
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}
