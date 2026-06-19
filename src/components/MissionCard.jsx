import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconRun, IconSalad, IconMoon, IconBrain, IconSkull,
  IconCheck, IconBolt,
} from '@tabler/icons-react'
import { ZONES } from '../data/challenges.js'

const ZONE_ICONS = {
  movement: IconRun,
  nutrition: IconSalad,
  recovery:  IconMoon,
  mindset:   IconBrain,
  boss:      IconSkull,
}

// Diagonal clip for Fortnite-style card corners
const CLIP_PATH = 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'

function XPBurst({ xp }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], y: -70, scale: 1.3 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)',
        fontSize: 30, letterSpacing: 2,
        color: '#B4FF3A',
        textShadow: '0 0 20px #B4FF3A, 0 0 40px #B4FF3A',
        pointerEvents: 'none', zIndex: 10,
        whiteSpace: 'nowrap',
      }}>
      +{xp} XP
    </motion.div>
  )
}

// Rarity label pill
function RarityBadge({ color, label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: `${color}22`,
      border: `1px solid ${color}66`,
      borderRadius: 4, padding: '2px 8px',
      fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 2,
      color, textTransform: 'uppercase',
    }}>
      <div style={{ width: 5, height: 5, borderRadius: 1, background: color }} />
      {label}
    </div>
  )
}

export default function MissionCard({ challenge, isCompleted, onComplete, onTickRep, repCount = 0, index }) {
  const [showBurst, setShowBurst] = useState(false)

  const zone = ZONES[challenge.zone.toUpperCase()] ?? ZONES.MOVEMENT
  const ZoneIcon = ZONE_ICONS[challenge.zone] ?? IconBolt
  const color = zone.color
  const isBoss = challenge.isBoss
  const hasReps = !!challenge.reps
  const totalReps = challenge.reps ?? 1
  const xpPerRep = Math.round(challenge.xp / totalReps)

  function handleComplete() {
    if (isCompleted) return
    onComplete(challenge.id, challenge.xp)
    setShowBurst(true)
    setTimeout(() => setShowBurst(false), 1300)
  }

  function handleTick(i) {
    if (repCount > i) return
    onTickRep(challenge.id, totalReps, xpPerRep)
    setShowBurst(true)
    setTimeout(() => setShowBurst(false), 1300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      style={{ position: 'relative' }}>

      <motion.div
        animate={!isCompleted ? {
          boxShadow: [`0 0 0px ${color}00`, `0 0 16px ${color}33`, `0 0 0px ${color}00`],
        } : {}}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.5 }}
        style={{
          background: isCompleted
            ? `linear-gradient(135deg, ${color}10, ${color}20)`
            : `linear-gradient(135deg, var(--card), ${color}08)`,
          border: `1px solid ${isCompleted ? color : color + '44'}`,
          clipPath: CLIP_PATH,
          padding: isBoss ? '20px 18px' : '16px 18px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.3s',
        }}>

        {/* Boss animated top stripe */}
        {isBoss && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, transparent, ${color}, #FFC93C, ${color}, transparent)`,
              backgroundSize: '200% 100%',
            }} />
        )}

        {/* Completed shimmer */}
        {isCompleted && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${color}06, transparent)`,
            pointerEvents: 'none',
          }} />
        )}

        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* Zone icon with rarity glow */}
          <div style={{
            width: 44, height: 44, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${color}22, ${color}11)`,
            border: `2px solid ${color}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 10px ${color}33`,
          }}>
            {isCompleted
              ? <IconCheck size={22} color={color} />
              : <ZoneIcon size={22} color={color} />}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Rarity badge */}
            <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RarityBadge color={color} label={zone.rarity} />
              {isBoss && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 8, color: '#FF4D6D',
                  letterSpacing: 1, border: '1px solid #FF4D6D55', borderRadius: 3,
                  padding: '2px 6px',
                }}>
                  ⚡ MYTHIQUE
                </span>
              )}
            </div>

            {/* Title */}
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: isBoss ? 14 : 13,
              letterSpacing: 1, marginBottom: 4,
              color: isCompleted ? color : 'var(--text)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              opacity: isCompleted ? 0.7 : 1,
              lineHeight: 1.2,
            }}>
              {challenge.title}
            </div>

            {/* Mission */}
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
              color: 'var(--text)', marginBottom: 6, lineHeight: 1.3,
            }}>
              {challenge.mission}
            </div>

            {/* Flavor */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)',
              lineHeight: 1.55, marginBottom: 12,
            }}>
              {challenge.flavor}
            </div>

            {/* Reps */}
            {hasReps && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', marginBottom: 8, letterSpacing: 1 }}>
                  PROGRESSION : {repCount}/{totalReps}
                </div>
                {/* Progress bar */}
                <div style={{ height: 4, background: '#15103A', borderRadius: 2, overflow: 'hidden', marginBottom: 8, border: '1px solid var(--border)' }}>
                  <motion.div
                    animate={{ width: `${(repCount / totalReps) * 100}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {challenge.repLabels.map((label, i) => {
                    const done = repCount > i
                    return (
                      <motion.button key={i}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleTick(i)}
                        disabled={done}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          background: done ? `${color}18` : '#15103A',
                          border: `1px solid ${done ? color : 'var(--border)'}`,
                          borderRadius: 8, padding: '10px 14px',
                          cursor: done ? 'default' : 'pointer',
                          transition: 'all 0.2s',
                          clipPath: done ? 'none' : 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                        }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          border: `2px solid ${done ? color : 'var(--border)'}`,
                          background: done ? color : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {done && <span style={{ fontSize: 11, color: '#000', fontWeight: 900 }}>✓</span>}
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                          color: done ? color : 'var(--text)',
                          textDecoration: done ? 'line-through' : 'none',
                          opacity: done ? 0.7 : 1,
                          flex: 1, textAlign: 'left',
                        }}>
                          {label}
                        </span>
                        {!done && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--lime)' }}>
                            +{xpPerRep} XP
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Bottom row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 11,
                color: isCompleted ? color : 'var(--lime)',
                letterSpacing: 1,
              }}>
                {isCompleted ? '✓ LOOT RÉCLAMÉ' : `+${challenge.xp} XP`}
              </div>

              {!isCompleted && !hasReps && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  style={{
                    background: `linear-gradient(135deg, ${color}30, ${color}55)`,
                    border: `1px solid ${color}`,
                    borderRadius: 6, padding: '7px 16px',
                    fontFamily: 'var(--font-display)', fontSize: 9,
                    color, letterSpacing: 2, cursor: 'pointer',
                    boxShadow: `0 0 10px ${color}33`,
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                  }}>
                  RÉCLAMER LE LOOT
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showBurst && <XPBurst xp={hasReps ? xpPerRep : challenge.xp} />}
      </AnimatePresence>
    </motion.div>
  )
}
