import { motion } from 'framer-motion'
import { getLevel, LEVELS } from '../hooks/useXP.js'

function getLast30Days() {
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function CalendarHeatmap({ xpHistory }) {
  const days = getLast30Days()
  const xpMap = Object.fromEntries((xpHistory ?? []).map(e => [e.date, e.xp]))
  const maxXP = Math.max(...Object.values(xpMap), 1)

  const weeks = []
  let week = []
  days.forEach((d, i) => {
    week.push(d)
    if (week.length === 7 || i === days.length - 1) { weeks.push(week); week = [] }
  })

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)', marginBottom: 8, letterSpacing: 1 }}>
        ACTIVITÉ XP — 30 DERNIERS JOURS
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {weeks.map((w, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
            {w.map(day => {
              const xp = xpMap[day] ?? 0
              const intensity = xp / maxXP
              const color = xp > 0
                ? `rgba(180, 255, 58, ${0.2 + intensity * 0.8})`
                : '#1E1550'
              return (
                <motion.div key={day}
                  title={`${day}: ${xp} XP`}
                  whileHover={{ scale: 1.3 }}
                  style={{
                    width: '100%', paddingBottom: '100%', borderRadius: 2,
                    background: color,
                    boxShadow: xp > 0 ? `0 0 4px rgba(180,255,58,${intensity * 0.7})` : 'none',
                    cursor: 'default',
                  }} />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StatsView({ totalXP, streak, xpHistory }) {
  const level = getLevel(totalXP)
  const totalDays = (xpHistory ?? []).length
  const totalXPEarned = (xpHistory ?? []).reduce((s, e) => s + e.xp, 0)
  const bestDay = (xpHistory ?? []).reduce((best, e) => e.xp > (best?.xp ?? 0) ? e : best, null)
  const avgXP = totalDays > 0 ? Math.round(totalXPEarned / totalDays) : 0

  return (
    <div style={{ padding: '20px 16px' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 3, color: 'var(--muted)', marginBottom: 3 }}>
          DOSSIER JOUEUR
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)', letterSpacing: 1 }}>
          STATISTIQUES
        </div>
      </div>

      {/* Battle Pass tier card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: `linear-gradient(135deg, ${level.color}15, ${level.color}08)`,
          border: `2px solid ${level.color}66`,
          borderRadius: 10, padding: '20px',
          marginBottom: 16, textAlign: 'center',
          boxShadow: `0 0 20px ${level.color}22`,
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted)',
          letterSpacing: 3, marginBottom: 8,
        }}>
          BATTLE PASS TIER
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 36, color: level.color,
          letterSpacing: 4, textShadow: `0 0 20px ${level.color}88`,
        }}>
          {level.name}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
          {totalXP.toLocaleString()} XP TOTAL
        </div>

        {/* Level milestones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          {LEVELS.map((l) => (
            <div key={l.name} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', margin: '0 auto 4px',
                background: totalXP >= l.min ? l.color : '#1E1550',
                border: `1px solid ${l.color}`,
                boxShadow: totalXP >= l.min ? `0 0 8px ${l.color}` : 'none',
              }} />
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 7,
                color: totalXP >= l.min ? l.color : 'var(--muted)',
              }}>
                {l.name.slice(0, 3)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'SÉRIE DE VICTOIRES', value: streak,   unit: 'jours',   color: '#FFC93C' },
          { label: 'JOURS ACTIFS',       value: totalDays, unit: 'total',  color: '#2BD9FF' },
          { label: 'XP MOYEN/JOUR',      value: avgXP,    unit: 'xp/jour', color: '#B4FF3A' },
          { label: 'MEILLEUR JOUR',      value: bestDay?.xp ?? 0, unit: 'xp',  color: '#9B5CFF' },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '14px 12px',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', letterSpacing: 1, marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 26, color: s.color, lineHeight: 1,
              textShadow: `0 0 10px ${s.color}66`,
            }}>
              {s.value.toLocaleString()}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--muted)', marginTop: 4 }}>
              {s.unit}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Heatmap */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '14px', marginBottom: 16,
      }}>
        <CalendarHeatmap xpHistory={xpHistory} />
      </div>

      {/* Intel footer */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '14px 16px',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', lineHeight: 1.8,
      }}>
        <div style={{ color: 'var(--lime)', marginBottom: 6, letterSpacing: 1 }}>// INTEL COMBAT</div>
        <div>Réclame 3+ loots par jour pour maintenir ta série.</div>
        <div>500 XP débloque le tier ARGENT. 7 000 XP atteint CHAMPION.</div>
        <div>Le défi mythique (Boss) rapporte 300 XP — la récompense maximale.</div>
        <div style={{ marginTop: 8, color: '#9B5CFF' }}>JOUEUR : ÉLOI</div>
      </div>
    </div>
  )
}
