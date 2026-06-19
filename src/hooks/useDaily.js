import { useState, useEffect, useCallback, useRef } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase.js'
import { getDailyChallenges, todayStr, yesterdayStr } from '../utils/randomizer.js'

function calcStreak(saved, today) {
  if (!saved) return 0
  const yesterday = yesterdayStr()
  if (saved.date === yesterday && (saved.completed?.length ?? 0) >= 3) {
    return (saved.streak ?? 0) + 1
  }
  if (saved.date === today) return saved.streak ?? 0
  return 0
}

function serializeState(state) {
  const { challenges, ...rest } = state
  return rest
}

function buildFreshDay(saved) {
  const today = todayStr()
  return {
    date: today,
    challenges: getDailyChallenges(today),
    completed: [],
    progress: {},
    totalXP: saved?.totalXP ?? 0,
    streak: calcStreak(saved, today),
    xpHistory: saved?.xpHistory ?? [],
    zoneHistory: saved?.zoneHistory ?? {},
  }
}

export function useDaily(userId) {
  const [state, setState] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const saveTimeout = useRef(null)

  useEffect(() => {
    if (!userId) { setState(null); return }
    const ref = doc(db, 'users', userId, 'data', 'daily')
    const unsub = onSnapshot(ref, (snap) => {
      const saved = snap.exists() ? snap.data() : null
      const today = todayStr()
      if (!saved || saved.date !== today) {
        const fresh = buildFreshDay(saved)
        setState(fresh)
        setDoc(ref, serializeState(fresh)).catch(console.error)
      } else {
        setState({ ...saved, challenges: getDailyChallenges(today) })
      }
    }, (err) => console.error('Firestore error:', err))
    return unsub
  }, [userId])

  const saveToFirestore = useCallback((newState) => {
    if (!userId) return
    setSyncing(true)
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      try {
        const ref = doc(db, 'users', userId, 'data', 'daily')
        await setDoc(ref, serializeState(newState))
      } catch (e) { console.error('Save error:', e) }
      finally { setSyncing(false) }
    }, 800)
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const interval = setInterval(() => {
      const today = todayStr()
      if (state && state.date !== today) {
        const fresh = buildFreshDay(state)
        setState(fresh)
        saveToFirestore(fresh)
      }
    }, 60_000)
    return () => clearInterval(interval)
  }, [userId, state, saveToFirestore])

  const completeChallenge = useCallback((challengeId, xpReward) => {
    setState(prev => {
      if (!prev || prev.completed.includes(challengeId)) return prev
      const completed = [...prev.completed, challengeId]
      const totalXP = prev.totalXP + xpReward
      const ch = prev.challenges.find(c => c.id === challengeId)
      const zoneHistory = { ...prev.zoneHistory }
      if (ch) {
        const key = `${prev.date}_${ch.zone}`
        zoneHistory[key] = (zoneHistory[key] ?? 0) + 1
      }
      const xpHistory = [...(prev.xpHistory ?? [])]
      const todayEntry = xpHistory.find(e => e.date === prev.date)
      if (todayEntry) todayEntry.xp += xpReward
      else xpHistory.push({ date: prev.date, xp: xpReward })
      const next = { ...prev, completed, totalXP, zoneHistory, xpHistory }
      saveToFirestore(next)
      return next
    })
  }, [saveToFirestore])

  const tickRep = useCallback((challengeId, totalReps, xpPerRep) => {
    setState(prev => {
      if (!prev) return prev
      const currentReps = prev.progress?.[challengeId] ?? 0
      if (currentReps >= totalReps) return prev
      const newReps = currentReps + 1
      const progress = { ...prev.progress, [challengeId]: newReps }
      const totalXP = prev.totalXP + xpPerRep
      const xpHistory = [...(prev.xpHistory ?? [])]
      const todayEntry = xpHistory.find(e => e.date === prev.date)
      if (todayEntry) todayEntry.xp += xpPerRep
      else xpHistory.push({ date: prev.date, xp: xpPerRep })
      let completed = [...prev.completed]
      const zoneHistory = { ...prev.zoneHistory }
      if (newReps >= totalReps && !completed.includes(challengeId)) {
        completed.push(challengeId)
        const ch = prev.challenges.find(c => c.id === challengeId)
        if (ch) {
          const key = `${prev.date}_${ch.zone}`
          zoneHistory[key] = (zoneHistory[key] ?? 0) + 1
        }
      }
      const next = { ...prev, progress, completed, totalXP, xpHistory, zoneHistory }
      saveToFirestore(next)
      return next
    })
  }, [saveToFirestore])

  return {
    state,
    syncing,
    date: state?.date,
    challenges: state?.challenges ?? [],
    completed: state?.completed ?? [],
    progress: state?.progress ?? {},
    totalXP: state?.totalXP ?? 0,
    streak: state?.streak ?? 0,
    xpHistory: state?.xpHistory ?? [],
    zoneHistory: state?.zoneHistory ?? {},
    completeChallenge,
    tickRep,
    allDone: (state?.completed?.length ?? 0) >= (state?.challenges?.length ?? 5),
  }
}
