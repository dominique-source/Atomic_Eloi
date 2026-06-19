import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      const msg = this.state.error.message || String(this.state.error)
      const isFirebase = msg.toLowerCase().includes('firebase') || msg.toLowerCase().includes('vite_firebase')
      return (
        <div style={{
          minHeight: '100dvh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#15103A', padding: '32px 24px', textAlign: 'center',
        }}>
          <div style={{
            background: 'rgba(255,77,109,0.12)', border: '2px solid #FF4D6D',
            borderRadius: 12, padding: '28px 24px', maxWidth: 420,
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <div style={{
              fontFamily: "'Luckiest Guy', cursive", fontSize: 20,
              color: '#FF4D6D', letterSpacing: 2, marginBottom: 16,
            }}>
              {isFirebase ? 'FIREBASE NON CONFIGURÉ' : 'ERREUR DE DÉMARRAGE'}
            </div>
            {isFirebase ? (
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#9A93C7', lineHeight: 1.9, textAlign: 'left' }}>
                <div style={{ color: '#B4FF3A', marginBottom: 8 }}>Sur Vercel → Settings → Environment Variables, ajoute :</div>
                {[
                  'VITE_FIREBASE_API_KEY',
                  'VITE_FIREBASE_AUTH_DOMAIN',
                  'VITE_FIREBASE_PROJECT_ID',
                  'VITE_FIREBASE_STORAGE_BUCKET',
                  'VITE_FIREBASE_MESSAGING_SENDER_ID',
                  'VITE_FIREBASE_APP_ID',
                ].map(k => (
                  <div key={k} style={{ color: '#FFC93C' }}>{k}</div>
                ))}
                <div style={{ color: '#9A93C7', marginTop: 8 }}>Puis redéploie (Redeploy).</div>
              </div>
            ) : (
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#9A93C7', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {msg}
              </div>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
