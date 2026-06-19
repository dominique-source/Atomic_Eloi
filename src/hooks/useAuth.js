import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'

export function isBrave() {
  try { return !!navigator.brave } catch { return false }
}

export function useAuth() {
  const [user, setUser] = useState(undefined)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [braveBlocked, setBraveBlocked] = useState(false)

  useEffect(() => {
    // Récupère le résultat après un signInWithRedirect
    getRedirectResult(auth)
      .then((result) => { if (result?.user) setUser(result.user) })
      .catch((e) => { if (e.code !== 'auth/null-user') console.warn('redirect result:', e.code) })

    const unsub = onAuthStateChanged(auth, (u) => { setUser(u ?? null) })
    return unsub
  }, [])

  async function loginGoogle() {
    setLoading(true); setError(null); setBraveBlocked(false)
    try {
      // signInWithPopup fonctionne sur tous les navigateurs modernes (desktop + mobile)
      // quand déclenché par un geste utilisateur direct (bouton click).
      // Safari ITP bloque signInWithRedirect mais autorise les popups depuis un geste.
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      if (
        e.code === 'auth/popup-blocked' ||
        e.code === 'auth/cancelled-popup-request'
      ) {
        if (isBrave()) {
          // Brave bloque tout — afficher les instructions shields
          setBraveBlocked(true)
          setLoading(false)
        } else {
          // Autre navigateur avec popup bloqué → essaie redirect
          try { await signInWithRedirect(auth, googleProvider) }
          catch (e2) { setError(e2.message); setLoading(false) }
        }
      } else if (e.code === 'auth/popup-closed-by-user') {
        // L'utilisateur a fermé la fenêtre — pas une erreur
        setLoading(false)
      } else {
        setError(e.message)
        setLoading(false)
      }
    }
  }

  async function loginEmail(email, password) {
    setLoading(true); setError(null)
    try { await signInWithEmailAndPassword(auth, email, password) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function registerEmail(email, password, displayName) {
    setLoading(true); setError(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) await updateProfile(cred.user, { displayName })
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function logout() { await signOut(auth) }

  return { user, error, loading, braveBlocked, loginGoogle, loginEmail, registerEmail, logout }
}
