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

// Brave détecte comme Desktop mais bloque les popups OAuth — redirect est plus fiable universellement
const useRedirect = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || isBrave()

function isBrave() {
  try { return !!navigator.brave } catch { return false }
}

export function useAuth() {
  const [user, setUser] = useState(undefined)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => { if (result?.user) setUser(result.user) })
      .catch((e) => { if (e.code !== 'auth/null-user') setError(e.message) })

    const unsub = onAuthStateChanged(auth, (u) => { setUser(u ?? null) })
    return unsub
  }, [])

  async function loginGoogle() {
    setLoading(true); setError(null)
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, googleProvider)
        return
      }
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      if (
        e.code === 'auth/popup-blocked' ||
        e.code === 'auth/popup-closed-by-user' ||
        e.code === 'auth/cancelled-popup-request'
      ) {
        try { await signInWithRedirect(auth, googleProvider) }
        catch (e2) { setError(e2.message); setLoading(false) }
      } else { setError(e.message); setLoading(false) }
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

  return { user, error, loading, loginGoogle, loginEmail, registerEmail, logout }
}
