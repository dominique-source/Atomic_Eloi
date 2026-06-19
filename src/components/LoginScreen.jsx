import { useState } from 'react'
import { motion } from 'framer-motion'
import { IconBrandGoogle, IconMail, IconLock, IconUser } from '@tabler/icons-react'

// Fortnite-style animated island backdrop
function IslandBackdrop() {
  return (
    <svg viewBox="0 0 480 200" width="100%" style={{ display: 'block', position: 'absolute', bottom: 0, left: 0 }} aria-hidden>
      <defs>
        <linearGradient id="skyLogin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15103A" />
          <stop offset="100%" stopColor="#2A1F6B" />
        </linearGradient>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Ground */}
      <ellipse cx="240" cy="185" rx="240" ry="30" fill="#1E1550" />
      <ellipse cx="240" cy="180" rx="180" ry="22" fill="#2A1F6B" />
      {/* Trees */}
      {[60,120,180,300,360,420].map((x, i) => (
        <g key={i}>
          <rect x={x - 3} y={150 - i % 3 * 10} width="6" height={30 + i % 3 * 8} fill="#1a0a3e" />
          <polygon points={`${x},${120 - i % 3 * 15} ${x - 14},${155 - i % 3 * 10} ${x + 14},${155 - i % 3 * 10}`}
            fill={i % 2 === 0 ? '#9B5CFF' : '#2BD9FF'} opacity="0.7" />
        </g>
      ))}
      {/* Storm circle */}
      <circle cx="240" cy="100" r="80" fill="none" stroke="#FF4D6D" strokeWidth="1.5" opacity="0.25" filter="url(#glow2)" />
      <circle cx="240" cy="100" r="55" fill="none" stroke="#9B5CFF" strokeWidth="1" opacity="0.2" />
      {/* Stars */}
      {[...Array(30)].map((_, i) => (
        <circle key={i} cx={(i * 113 + 7) % 480} cy={(i * 41 + 5) % 80} r="0.7"
          fill="white" opacity={0.2 + (i % 5) * 0.12} />
      ))}
    </svg>
  )
}

export default function LoginScreen({ onLoginGoogle, onLoginEmail, onRegister, error, loading }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const inputStyle = {
    width: '100%',
    background: 'rgba(21,16,58,0.8)',
    border: '1px solid rgba(155,92,255,0.4)',
    borderRadius: 10,
    padding: '13px 14px 13px 44px',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: 600,
    outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, #15103A 0%, #2A1F6B 60%, #15103A 100%)',
      padding: '24px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <IslandBackdrop />

      {/* Storm ring decorations */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 300, borderRadius: '50%',
          border: '1px solid rgba(155,92,255,0.12)', pointerEvents: 'none',
        }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 36, position: 'relative', zIndex: 1 }}>

        {/* Fortnite-style title block */}
        <div style={{
          background: 'linear-gradient(135deg, #9B5CFF44, #00E0FF22)',
          border: '2px solid #9B5CFF',
          borderRadius: 12, padding: '16px 28px', marginBottom: 12,
          boxShadow: '0 0 30px #9B5CFF44, 0 0 60px #00E0FF22',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 38, letterSpacing: 4,
            color: '#FFC93C', textShadow: '0 0 20px #FFC93C88, 3px 3px 0 #9B5CFF',
            lineHeight: 1,
          }}>
            ATOMIC
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 44, letterSpacing: 6,
            color: '#FFFFFF', textShadow: '0 0 20px #00E0FF88, 3px 3px 0 #9B5CFF',
            lineHeight: 1.1,
          }}>
            ÉLOI
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)',
          letterSpacing: 3, textTransform: 'uppercase',
        }}>
          Battle Pass des bonnes habitudes
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>

        {/* Google button */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onLoginGoogle}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.14))',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10,
            fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text)',
            letterSpacing: 2, marginBottom: 20, cursor: 'pointer',
          }}>
          <IconBrandGoogle size={20} color="#EA4335" />
          CONTINUER AVEC GOOGLE
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>OU</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Email form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div style={{ position: 'relative' }}>
              <IconUser size={16} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Ton prénom (ex: Éloi)" value={name}
                onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <IconMail size={16} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="email" placeholder="Courriel" value={email}
              onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ position: 'relative' }}>
            <IconLock size={16} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="password" placeholder="Mot de passe" value={password}
              onChange={e => setPassword(e.target.value)} style={inputStyle} />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,77,109,0.15)', border: '1px solid #FF4D6D',
              borderRadius: 8, padding: '10px 14px',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: '#FF4D6D',
            }}>
              {error.replace('Firebase: ', '').replace(/\(auth.*\)/, '')}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => mode === 'login' ? onLoginEmail(email, password) : onRegister(email, password, name)}
            disabled={loading}
            style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg, #9B5CFF55, #9B5CFF88)',
              border: '2px solid #9B5CFF',
              borderRadius: 12, fontFamily: 'var(--font-display)',
              fontSize: 13, color: '#fff', letterSpacing: 3,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
              boxShadow: '0 0 20px #9B5CFF44',
            }}>
            {loading ? 'CHARGEMENT...' : mode === 'login' ? 'REJOINDRE LA PARTIE' : 'CRÉER MON COMPTE'}
          </motion.button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)',
            }}>
            {mode === 'login'
              ? 'Pas de compte ? → CRÉER UN COMPTE'
              : 'Déjà un compte ? → SE CONNECTER'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
