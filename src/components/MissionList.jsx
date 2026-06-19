import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MissionCard from './MissionCard.jsx'

function VictoryConfetti() {
  const colors = ['#B4FF3A', '#9B5CFF', '#00E0FF', '#FF4D6D', '#FFC93C']
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.2 + Math.random() * 1,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {particles.map(p => (
        <motion.div key={p.id}
          initial={{ x: `${p.x}vw`, y: '-5vh', opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: '110vh', opacity: 0, rotate: 540, scale: 0.2 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute', width: 8, height: 8,
            borderRadius: p.id % 3 === 0 ? '50%' : 2,
            background: p.color, boxShadow: `0 0 8px ${p.color}`,
          }} />
      ))}
    </div>
  )
}

export default function MissionList({ challenges, completed, progress, onComplete, onTickRep, loading, firestoreError }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const allDone = challenges.length > 0 && completed.length >= challenges.length

  useEffect(() => {
    if (allDone) {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(t)
    }
  }, [allDone])

  return (
    <div style={{ padding: '20px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--muted)', marginBottom: 3 }}>
            BUS DE COMBAT · AUJOURD'HUI
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)', letterSpacing: 1 }}>
            LOOTS DISPONIBLES
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 13,
          color: completed.length >= 3 ? 'var(--lime)' : 'var(--muted)',
          textShadow: completed.length >= 3 ? '0 0 10px var(--lime)' : 'none',
        }}>
          {challenges.length > 0 ? `${completed.length}/${challenges.length}` : ''}
        </div>
      </div>

      {/* Firestore error */}
      {firestoreError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'rgba(255,77,109,0.12)', border: '1px solid #FF4D6D',
            borderRadius: 8, padding: '14px 16px', marginBottom: 16,
            fontFamily: 'var(--font-mono)', fontSize: 10, color: '#FF4D6D', lineHeight: 1.7,
          }}>
          <div style={{ marginBottom: 4, fontWeight: 700 }}>⚠ CONNEXION FIRESTORE ÉCHOUÉE</div>
          <div style={{ color: 'var(--muted)' }}>
            {firestoreError.includes('permission') || firestoreError.includes('PERMISSION')
              ? 'Règles Firestore bloquantes. Va dans Firebase Console → Firestore → Règles et autorise l\'accès authentifié.'
              : firestoreError.includes('not-found') || firestoreError.includes('database')
              ? 'Base de données Firestore introuvable. Crée-la dans Firebase Console → Firestore Database → Créer une base.'
              : firestoreError}
          </div>
        </motion.div>
      )}

      {/* Loading skeleton */}
      {loading && !firestoreError && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <motion.div key={i}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              style={{
                height: 100, borderRadius: 8, background: 'var(--card)',
                border: '1px solid var(--border)',
              }} />
          ))}
        </div>
      )}

      {/* All-done Victory Royale banner */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'linear-gradient(135deg, #FFC93C22, #FFC93C44)',
              border: '2px solid #FFC93C',
              borderRadius: 8, padding: '16px 18px',
              marginBottom: 16, textAlign: 'center',
              boxShadow: '0 0 30px #FFC93C33',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#FFC93C', letterSpacing: 3 }}>
              VICTORY ROYALE !
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginTop: 6 }}>
              Tous les loots réclamés. Tu domines l'île aujourd'hui, Éloi.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mission cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {challenges.map((ch, i) => (
          <MissionCard
            key={ch.id}
            challenge={ch}
            isCompleted={completed.includes(ch.id)}
            repCount={progress[ch.id] ?? 0}
            onComplete={onComplete}
            onTickRep={onTickRep}
            index={i}
          />
        ))}
      </div>

      <AnimatePresence>
        {showConfetti && <VictoryConfetti />}
      </AnimatePresence>
    </div>
  )
}
