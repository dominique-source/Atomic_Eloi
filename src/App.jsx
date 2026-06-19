import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconHome, IconMap, IconChartBar, IconShield,
  IconLogout, IconLoader2,
} from '@tabler/icons-react'
import LobbyView from './components/LobbyView.jsx'
import MissionList from './components/MissionList.jsx'
import IslandMap from './components/IslandMap.jsx'
import StatsView from './components/StatsView.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import { useDaily } from './hooks/useDaily.js'
import { useAuth } from './hooks/useAuth.js'
import { getLevel } from './hooks/useXP.js'

const TABS = [
  { id: 'home',  label: 'LOBBY',  Icon: IconHome },
  { id: 'map',   label: 'ÎLE',    Icon: IconMap },
  { id: 'stats', label: 'STATS',  Icon: IconChartBar },
]

function TabBar({ active, onChange }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(21,16,58,0.97)',
      borderTop: '1px solid rgba(155,92,255,0.25)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button key={id} onClick={() => onChange(id)}
            style={{
              flex: 1, padding: '12px 0 10px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
            }}>
            <motion.div animate={{ scale: isActive ? 1.2 : 1 }} transition={{ duration: 0.2 }}>
              <Icon size={20} color={isActive ? '#9B5CFF' : '#9A93C7'} />
            </motion.div>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
              color: isActive ? '#9B5CFF' : '#9A93C7',
            }}>
              {label}
            </span>
            {isActive && (
              <motion.div layoutId="tab-indicator"
                style={{ width: 20, height: 2, borderRadius: 1, background: '#9B5CFF', marginTop: 2, boxShadow: '0 0 8px #9B5CFF' }} />
            )}
          </button>
        )
      })}
    </div>
  )
}

function SyncDot({ syncing }) {
  if (!syncing) return null
  return (
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1, repeat: Infinity }}
      style={{
        width: 6, height: 6, borderRadius: '50%',
        background: '#9B5CFF', marginLeft: 6, display: 'inline-block',
        boxShadow: '0 0 6px #9B5CFF',
      }} />
  )
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [levelUpAnim, setLevelUpAnim] = useState(false)
  const { user, error, loading: authLoading, loginGoogle, loginEmail, registerEmail, logout } = useAuth()

  const {
    challenges, completed, progress, totalXP, streak,
    xpHistory, zoneHistory, completeChallenge, tickRep, syncing,
  } = useDaily(user?.uid)

  const level = getLevel(totalXP)

  function handleComplete(id, xp) {
    const prevLevel = getLevel(totalXP)
    completeChallenge(id, xp)
    const newXP = totalXP + xp
    const newLevel = getLevel(newXP)
    if (newLevel.index > prevLevel.index) {
      setLevelUpAnim(true)
      setTimeout(() => setLevelUpAnim(false), 2500)
    }
  }

  // Auth loading
  if (user === undefined) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <IconLoader2 size={32} color="#9B5CFF" />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <LoginScreen
        onLoginGoogle={loginGoogle}
        onLoginEmail={loginEmail}
        onRegister={registerEmail}
        error={error}
        loading={authLoading}
      />
    )
  }

  const displayName = user.displayName || 'ÉLOI'

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh', position: 'relative', background: 'var(--bg)' }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(21,16,58,0.97)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(155,92,255,0.2)',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconShield size={16} color="#9B5CFF" />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 2,
            color: '#9B5CFF', textShadow: '0 0 10px #9B5CFF88',
          }}>
            ATOMIC ÉLOI
          </span>
          <SyncDot syncing={syncing} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: `linear-gradient(135deg, ${level.color}22, ${level.color}44)`,
            border: `1px solid ${level.color}66`,
            borderRadius: 4, padding: '3px 8px',
            fontFamily: 'var(--font-mono)', fontSize: 9, color: level.color, letterSpacing: 1,
          }}>
            {level.name}
          </div>
          <button onClick={logout} title="Déconnexion"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <IconLogout size={16} color="var(--muted)" />
          </button>
        </div>
      </div>

      {/* Victory Royale level-up banner */}
      <AnimatePresence>
        {levelUpAnim && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
              zIndex: 200, whiteSpace: 'nowrap',
              background: `linear-gradient(135deg, ${level.color}33, ${level.color}66)`,
              border: `2px solid ${level.color}`,
              borderRadius: 8, padding: '12px 28px',
              fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 3,
              color: level.color, textShadow: `0 0 20px ${level.color}`,
              boxShadow: `0 0 40px ${level.color}55`,
            }}>
            ⚡ VICTORY ROYALE — {level.name} ⚡
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player tag */}
      <div style={{
        padding: '6px 16px 0',
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color: 'var(--muted)', letterSpacing: 1,
      }}>
        JOUEUR : {displayName.toUpperCase()}
      </div>

      {/* Page content */}
      <div style={{ paddingBottom: 80 }}>
        <AnimatePresence mode="wait">
          {tab === 'home' && (
            <motion.div key="home"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <LobbyView
                totalXP={totalXP}
                streak={streak}
                completedCount={completed.length}
                totalCount={challenges.length}
                levelUpAnimation={levelUpAnim}
              />
              <MissionList
                challenges={challenges}
                completed={completed}
                progress={progress}
                onComplete={handleComplete}
                onTickRep={tickRep}
              />
            </motion.div>
          )}

          {tab === 'map' && (
            <motion.div key="map"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <IslandMap zoneHistory={zoneHistory} />
            </motion.div>
          )}

          {tab === 'stats' && (
            <motion.div key="stats"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              <StatsView totalXP={totalXP} streak={streak} xpHistory={xpHistory} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
