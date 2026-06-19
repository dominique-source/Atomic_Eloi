import { motion } from 'framer-motion'
import { getLevel, getNextLevel, getProgressPct } from '../hooks/useXP.js'

// Animated island silhouette
function IslandSilhouette() {
  return (
    <svg viewBox="0 0 480 180" width="100%" style={{ display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id="skyLobby" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15103A" />
          <stop offset="60%" stopColor="#1E1550" />
          <stop offset="100%" stopColor="#2A1F6B" />
        </linearGradient>
        <filter id="glowL">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="strongGlowL">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="480" height="180" fill="url(#skyLobby)" />

      {/* Stars */}
      {[...Array(35)].map((_, i) => (
        <motion.circle key={i}
          cx={(i * 83 + 17) % 480} cy={(i * 37 + 8) % 70} r="0.9"
          fill="white"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.15 }} />
      ))}

      {/* Storm ring */}
      <motion.circle cx="240" cy="88" r="70"
        fill="none" stroke="#FF4D6D" strokeWidth="1.5" opacity="0.3" filter="url(#glowL)"
        animate={{ r: [68, 72, 68] }}
        transition={{ duration: 3, repeat: Infinity }} />
      <circle cx="240" cy="88" r="45" fill="none" stroke="#9B5CFF" strokeWidth="1" opacity="0.2" />

      {/* Island ground */}
      <ellipse cx="240" cy="168" rx="200" ry="22" fill="#1E1550" />
      <ellipse cx="240" cy="162" rx="160" ry="18" fill="#2A1F6B" />

      {/* Trees left */}
      {[55, 95, 130].map((x, i) => (
        <g key={`tl${i}`}>
          <rect x={x - 2} y={132 - i * 8} width="4" height={28 + i * 6} fill="#150e35" />
          <polygon points={`${x},${105 - i * 10} ${x - 12},${135 - i * 8} ${x + 12},${135 - i * 8}`}
            fill={i % 2 === 0 ? '#9B5CFF' : '#2BD9FF'} opacity="0.75" filter="url(#glowL)" />
        </g>
      ))}

      {/* Trees right */}
      {[350, 385, 425].map((x, i) => (
        <g key={`tr${i}`}>
          <rect x={x - 2} y={128 - i * 6} width="4" height={26 + i * 5} fill="#150e35" />
          <polygon points={`${x},${100 - i * 9} ${x - 11},${132 - i * 6} ${x + 11},${132 - i * 6}`}
            fill={i % 2 === 0 ? '#FFC93C' : '#9B5CFF'} opacity="0.7" filter="url(#glowL)" />
        </g>
      ))}

      {/* Storm glow on horizon */}
      <rect x="0" y="155" width="480" height="2" fill="#9B5CFF" opacity="0.5" filter="url(#strongGlowL)" />

      {/* Title text */}
      <text x="240" y="35" textAnchor="middle" fill="#9B5CFF" opacity="0.2"
        fontFamily="'Luckiest Guy', cursive" fontSize="11" letterSpacing="8">L'ÎLE</text>
    </svg>
  )
}

// Fortnite-style character doing emote
function FortniteCharacter({ dancing = false }) {
  return (
    <motion.div style={{ position: 'relative', width: 56, height: 60 }}
      animate={dancing ? { y: [0, -8, 0, -6, 0] } : {}}
      transition={dancing ? { duration: 0.6, repeat: Infinity } : {}}>
      <svg viewBox="0 0 56 60" width="56" height="60">
        {/* Body */}
        <rect x="18" y="20" width="20" height="20" rx="3" fill="#2BD9FF" />
        {/* Chest stripe */}
        <rect x="18" y="24" width="20" height="3" fill="#9B5CFF" opacity="0.8" />
        {/* Head */}
        <rect x="19" y="8" width="18" height="16" rx="4" fill="#FFC93C" />
        {/* Helmet visor */}
        <rect x="20" y="13" width="16" height="6" rx="2" fill="#15103A" opacity="0.9" />
        {/* Visor glow */}
        <rect x="21" y="14" width="14" height="4" rx="1" fill="#00E0FF" opacity="0.5" />

        {/* Left arm */}
        <motion.rect x="8" y="21" width="10" height="5" rx="2" fill="#2BD9FF"
          animate={dancing ? { rotate: [-25, 25, -25] } : {}}
          transition={{ duration: 0.4, repeat: Infinity }}
          style={{ transformOrigin: '18px 23px' }} />
        {/* Right arm */}
        <motion.rect x="38" y="21" width="10" height="5" rx="2" fill="#2BD9FF"
          animate={dancing ? { rotate: [25, -25, 25] } : {}}
          transition={{ duration: 0.4, repeat: Infinity }}
          style={{ transformOrigin: '38px 23px' }} />

        {/* Left leg */}
        <motion.rect x="18" y="40" width="8" height="16" rx="2" fill="#9B5CFF"
          animate={dancing ? { rotate: [-15, 15, -15] } : {}}
          transition={{ duration: 0.4, repeat: Infinity }}
          style={{ transformOrigin: '22px 40px' }} />
        {/* Right leg */}
        <motion.rect x="30" y="40" width="8" height="16" rx="2" fill="#9B5CFF"
          animate={dancing ? { rotate: [15, -15, 15] } : {}}
          transition={{ duration: 0.4, repeat: Infinity }}
          style={{ transformOrigin: '34px 40px' }} />

        {/* Dance sparkles */}
        {dancing && (
          <>
            <motion.circle cx="6" cy="18" r="2" fill="#B4FF3A"
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} />
            <motion.circle cx="50" cy="22" r="2" fill="#FFC93C"
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
            <motion.circle cx="8" cy="35" r="1.5" fill="#9B5CFF"
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} />
          </>
        )}
      </svg>
    </motion.div>
  )
}

export default function LobbyView({ totalXP, streak, completedCount, totalCount, levelUpAnimation }) {
  const level = getLevel(totalXP)
  const next = getNextLevel(totalXP)
  const pct = getProgressPct(totalXP)

  return (
    <div style={{ position: 'relative' }}>
      {/* Island backdrop */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <IslandSilhouette />
        {/* Character in lobby */}
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)' }}>
          <FortniteCharacter dancing={levelUpAnimation} />
        </div>
        {/* Victory Royale banner when leveling up */}
        {levelUpAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #FFC93C44, #FFC93C88)',
              border: '2px solid #FFC93C',
              borderRadius: 8, padding: '8px 20px', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 3,
              color: '#FFC93C', textShadow: '0 0 20px #FFC93C',
              boxShadow: '0 0 30px #FFC93C44',
            }}>
            VICTORY ROYALE !
          </motion.div>
        )}
      </div>

      {/* Battle Pass HUD */}
      <div style={{
        background: 'linear-gradient(180deg, #1E1550 0%, #221A55 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 18px',
      }}>
        {/* Level tier + Battle Pass bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <motion.div
            animate={levelUpAnimation ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.6 }}
            style={{
              background: `linear-gradient(135deg, ${level.color}25, ${level.color}50)`,
              border: `2px solid ${level.color}`,
              borderRadius: 6, padding: '4px 12px',
              fontFamily: 'var(--font-display)', fontSize: 10,
              color: level.color, letterSpacing: 2,
              boxShadow: `0 0 12px ${level.color}44`,
              flexShrink: 0,
            }}>
            {level.name}
          </motion.div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>
                BATTLE PASS
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--lime)' }}>
                {totalXP.toLocaleString()}{next ? ` / ${next.min.toLocaleString()}` : ' MAX'} XP
              </span>
            </div>
            <div style={{ height: 8, background: '#15103A', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${level.color}, ${level.color}bb)`,
                  borderRadius: 4,
                  boxShadow: `0 0 8px ${level.color}88`,
                }} />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-around' }}>
          {/* Streak */}
          <div style={{ textAlign: 'center' }}>
            <motion.div
              animate={streak > 0 ? { textShadow: ['0 0 8px #FFC93C', '0 0 20px #FFC93C', '0 0 8px #FFC93C'] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#FFC93C', lineHeight: 1 }}>
              {streak}
            </motion.div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', letterSpacing: 1, marginTop: 2 }}>
              SÉRIE DE VICTOIRES
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />

          {/* Missions */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)', lineHeight: 1 }}>
              {completedCount}
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>/{totalCount}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', letterSpacing: 1, marginTop: 2 }}>
              LOOTS RÉCLAMÉS
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />

          {/* XP */}
          <div style={{ textAlign: 'center' }}>
            <motion.div
              key={totalXP}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--lime)', lineHeight: 1 }}>
              {totalXP.toLocaleString()}
            </motion.div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', letterSpacing: 1, marginTop: 2 }}>
              XP TOTAL
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
