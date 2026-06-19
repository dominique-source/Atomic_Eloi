import { motion } from 'framer-motion'

const POINTS_OF_INTEREST = [
  { key: 'movement', label: 'ZONE D\'ENTRAÎNEMENT', subtitle: 'Point d\'intérêt ÉPIQUE',    color: '#9B5CFF', emoji: '⚡' },
  { key: 'nutrition', label: 'RATION DE COMBAT',    subtitle: 'Point d\'intérêt RARE',      color: '#2BD9FF', emoji: '🎯' },
  { key: 'recovery',  label: 'SECTEUR REPOS',       subtitle: 'Point d\'intérêt PEU COMMUN', color: '#B4FF3A', emoji: '🌙' },
  { key: 'mindset',   label: 'BUNKER MENTAL',       subtitle: 'Point d\'intérêt LÉGENDAIRE', color: '#FFC93C', emoji: '🏆' },
  { key: 'boss',      label: 'ZONE DE TEMPÊTE',     subtitle: 'Point d\'intérêt MYTHIQUE',  color: '#FF4D6D', emoji: '💀' },
]

function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function getZoneCompletions(zoneHistory, zone, days) {
  return days.reduce((sum, day) => sum + (zoneHistory[`${day}_${zone}`] ?? 0), 0)
}

// Mini SVG island map
function IslandMapSVG({ activeZones }) {
  const zonePositions = {
    movement: { x: 120, y: 80 },
    nutrition: { x: 240, y: 55 },
    recovery:  { x: 360, y: 80 },
    mindset:   { x: 190, y: 130 },
    boss:      { x: 290, y: 130 },
  }
  const zoneColors = {
    movement: '#9B5CFF',
    nutrition: '#2BD9FF',
    recovery:  '#B4FF3A',
    mindset:   '#FFC93C',
    boss:      '#FF4D6D',
  }

  return (
    <svg viewBox="0 0 480 190" width="100%" style={{ display: 'block', borderRadius: 8 }} aria-hidden>
      <defs>
        <radialGradient id="islandBg" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#2A1F6B" />
          <stop offset="100%" stopColor="#15103A" />
        </radialGradient>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="480" height="190" fill="url(#islandBg)" rx="8" />

      {/* Grid lines */}
      {[80, 160, 240, 320, 400].map(x => (
        <line key={`vg${x}`} x1={x} y1="0" x2={x} y2="190" stroke="#9B5CFF" strokeWidth="0.3" opacity="0.15" />
      ))}
      {[47, 94, 141].map(y => (
        <line key={`hg${y}`} x1="0" y1={y} x2="480" y2={y} stroke="#9B5CFF" strokeWidth="0.3" opacity="0.15" />
      ))}

      {/* Island shape */}
      <ellipse cx="240" cy="120" rx="195" ry="65" fill="#1E1550" stroke="#9B5CFF" strokeWidth="0.5" opacity="0.8" />
      <ellipse cx="240" cy="118" rx="170" ry="55" fill="#221A55" opacity="0.9" />

      {/* Storm ring */}
      <motion.circle cx="240" cy="95" r="85"
        fill="none" stroke="#FF4D6D" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '240px 95px' }} />

      {/* Connection lines between zones */}
      {Object.entries(zonePositions).map(([key, pos]) =>
        Object.entries(zonePositions).filter(([k2]) => k2 !== key).slice(0, 2).map(([k2, pos2]) => (
          <line key={`${key}-${k2}`}
            x1={pos.x} y1={pos.y} x2={pos2.x} y2={pos2.y}
            stroke="#9B5CFF" strokeWidth="0.5" opacity="0.12" />
        ))
      )}

      {/* Zone nodes */}
      {Object.entries(zonePositions).map(([key, pos]) => {
        const active = activeZones.includes(key)
        const color = zoneColors[key]
        return (
          <g key={key}>
            {active && (
              <motion.circle cx={pos.x} cy={pos.y} r="18"
                fill={`${color}20`} stroke={color} strokeWidth="1.5" opacity="0.6"
                filter="url(#nodeGlow)"
                animate={{ r: [16, 20, 16] }}
                transition={{ duration: 2, repeat: Infinity }} />
            )}
            <circle cx={pos.x} cy={pos.y} r="10"
              fill={active ? color : '#1E1550'}
              stroke={color} strokeWidth="1.5"
              filter={active ? 'url(#nodeGlow)' : 'none'}
              opacity={active ? 1 : 0.5} />
            {active && (
              <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                fill="#000" fontSize="8" fontWeight="900">✓</text>
            )}
            {/* Label */}
            <text x={pos.x} y={pos.y + 22} textAnchor="middle"
              fill={active ? color : '#9A93C7'} fontSize="7" fontFamily="'Luckiest Guy', cursive"
              letterSpacing="1" opacity={active ? 1 : 0.6}>
              {key.toUpperCase().slice(0, 4)}
            </text>
          </g>
        )
      })}

      {/* Compass */}
      <g transform="translate(450,18)">
        <circle cx="0" cy="0" r="10" fill="#1E1550" stroke="#9B5CFF" strokeWidth="0.8" opacity="0.6" />
        <text x="0" y="4" textAnchor="middle" fill="#9A93C7" fontSize="8" fontWeight="bold">N</text>
      </g>
    </svg>
  )
}

export default function IslandMap({ zoneHistory }) {
  const days = getLast7Days()

  const dayLabels = days.map(d => {
    const dt = new Date(d + 'T00:00:00')
    return ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'][dt.getDay()]
  })

  const zoneStats = POINTS_OF_INTEREST.map(z => {
    const total = getZoneCompletions(zoneHistory, z.key, days)
    const pct = Math.min(100, Math.round((total / Math.max(days.length, 1)) * 100 * (z.key === 'boss' ? 5 : 1)))
    return { ...z, total, pct: Math.min(100, pct) }
  })

  const activeZones = zoneStats.filter(z => z.total > 0).map(z => z.key)

  return (
    <div style={{ padding: '20px 16px' }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--muted)', marginBottom: 3 }}>
          VUE TACTIQUE
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)', letterSpacing: 1 }}>
          CARTE DE L'ÎLE
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
          Activité par zone — 7 derniers jours
        </div>
      </div>

      {/* Island SVG map */}
      <div style={{ marginBottom: 20, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <IslandMapSVG activeZones={activeZones} />
      </div>

      {/* Zone cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {zoneStats.map((z, i) => (
          <motion.div key={z.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              background: z.pct > 0
                ? `linear-gradient(135deg, ${z.color}10, ${z.color}18)`
                : 'var(--card)',
              border: `1px solid ${z.pct > 0 ? z.color + '55' : 'var(--border)'}`,
              borderRadius: 8, padding: '12px 14px',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              boxShadow: z.pct > 0 ? `0 0 12px ${z.color}22` : 'none',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{z.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: z.color, letterSpacing: 2 }}>
                  {z.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)' }}>
                  {z.subtitle}
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 14,
                color: z.total > 0 ? z.color : 'var(--muted)',
              }}>
                {z.total}×
              </div>
            </div>

            {/* Bar */}
            <div style={{ height: 5, background: '#15103A', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <motion.div
                animate={{ width: `${z.pct}%` }}
                initial={{ width: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${z.color}, ${z.color}88)`,
                  borderRadius: 3,
                  boxShadow: z.pct > 0 ? `0 0 6px ${z.color}88` : 'none',
                }} />
            </div>

            {/* Weekly activity dots */}
            <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'space-between' }}>
              {days.map((day, di) => {
                const count = zoneHistory[`${day}_${z.key}`] ?? 0
                return (
                  <div key={day} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      width: '100%', height: 14, borderRadius: 2,
                      background: count > 0 ? z.color : '#1E1550',
                      opacity: count > 0 ? 1 : 0.35,
                      boxShadow: count > 0 ? `0 0 6px ${z.color}77` : 'none',
                      transition: 'all 0.3s',
                    }} />
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--muted)', marginTop: 2 }}>
                      {dayLabels[di]}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '12px 14px',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', lineHeight: 1.8,
      }}>
        <div style={{ color: 'var(--lime)', marginBottom: 4, letterSpacing: 1 }}>// GUIDE DES SIGNAUX</div>
        <div>Bloc coloré = loot réclamé dans ce secteur ce jour-là</div>
        <div>Complète 3+ zones/jour pour maintenir ta série de victoires</div>
        <div>Le défi mythique apparaît environ 20% des jours</div>
      </div>
    </div>
  )
}
