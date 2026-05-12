import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// ─── Seed admin account so the app works out-of-the-box ───────────────────────
const SEED_USERS = [
  {
    id: 'admin-001',
    name: 'LAGAI Admin',
    email: 'admin@laga-institute.org',
    password: 'admin123',
    role: 'admin',
    authMethod: 'email',
    createdAt: new Date('2024-01-01').toISOString(),
    approved: true,
  },
  {
    id: 'student-001',
    name: 'Maria Santos',
    email: 'student@demo.com',
    password: 'demo123',
    role: 'student',
    authMethod: 'email',
    phone: '+238-555-0101',
    nationality: 'Cape Verdean',
    dob: '2001-06-20',
    createdAt: new Date('2024-01-10').toISOString(),
    approved: true,
  },
  {
    id: 'recruiter-001',
    name: 'Klaus Werner',
    email: 'recruiter@demo.com',
    password: 'demo123',
    role: 'recruiter',
    authMethod: 'email',
    agency: 'Luso-German Education Network',
    agencyCountry: 'Germany',
    phone: '+49-176-42954200',
    createdAt: new Date('2024-01-05').toISOString(),
    approved: true,
    commissionRate: 10,
  },
]

function getUsers() {
  const stored = localStorage.getItem('ua_users')
  if (stored) return JSON.parse(stored)
  localStorage.setItem('ua_users', JSON.stringify(SEED_USERS))
  return SEED_USERS
}

function saveUsers(users) {
  localStorage.setItem('ua_users', JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('ua_session')
    if (stored) {
      try {
        const session = JSON.parse(stored)
        const users = getUsers()
        const fresh = users.find(u => u.id === session.id)
        if (fresh) setUser(fresh)
      } catch (_) {}
    }
    setLoading(false)
  }, [])

  // ── Email / Password Login ─────────────────────────────────────────────────
  const login = (email, password) => {
    const users = getUsers()
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!found) throw new Error('Invalid email or password.')

    // Account was created via Google — must sign in with Google
    if (found.authMethod === 'google') {
      throw new Error('This account uses Google Sign-In. Please click "Continue with Google" below.')
    }

    if (found.password !== password) throw new Error('Invalid email or password.')

    if (!found.approved && found.role === 'recruiter')
      throw new Error('Your recruiter account is pending admin approval.')

    setUser(found)
    localStorage.setItem('ua_session', JSON.stringify({ id: found.id }))
    return found
  }

  // ── Google Login / Auto-register ───────────────────────────────────────────
  // Returns the user if found, or null if no account exists (register needed).
  const loginWithGoogle = (googlePayload) => {
    const { email, name, sub: googleId, picture } = googlePayload
    const users = getUsers()
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (found) {
      if (!found.approved && found.role === 'recruiter')
        throw new Error('Your recruiter account is pending admin approval.')

      // Link Google ID to existing email/password account if not already linked
      if (!found.googleId) {
        const updated = users.map(u =>
          u.id === found.id ? { ...u, googleId, picture: picture || u.picture } : u
        )
        saveUsers(updated)
        found = updated.find(u => u.id === found.id)
      }

      setUser(found)
      localStorage.setItem('ua_session', JSON.stringify({ id: found.id }))
      return found
    }

    // No account found — signal to the caller to redirect to register
    return null
  }

  // ── Register ───────────────────────────────────────────────────────────────
  const register = (data) => {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase()))
      throw new Error('An account with this email already exists.')

    const newUser = {
      id: `${data.role}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      approved: data.role !== 'recruiter',
      commissionRate: data.role === 'recruiter' ? 10 : undefined,
      ...data,
      // Never persist confirmPassword
      confirmPassword: undefined,
    }

    saveUsers([...users, newUser])

    if (newUser.approved) {
      setUser(newUser)
      localStorage.setItem('ua_session', JSON.stringify({ id: newUser.id }))
    }
    return newUser
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null)
    localStorage.removeItem('ua_session')
    // Also sign out from Google so their account chooser shows on next login
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
  }

  // ── Update current user ────────────────────────────────────────────────────
  const updateUser = (updates) => {
    const users = getUsers()
    const updated = users.map(u => u.id === user.id ? { ...u, ...updates } : u)
    saveUsers(updated)
    const fresh = updated.find(u => u.id === user.id)
    setUser(fresh)
    localStorage.setItem('ua_session', JSON.stringify({ id: fresh.id }))
  }

  // ── Admin helpers ─────────────────────────────────────────────────────────
  const getAllUsers = () => getUsers()

  const updateAnyUser = (userId, updates) => {
    const users = getUsers()
    const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u)
    saveUsers(updated)
    if (user && user.id === userId) {
      setUser(updated.find(u => u.id === userId))
    }
    return updated
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, updateUser, getAllUsers, updateAnyUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
