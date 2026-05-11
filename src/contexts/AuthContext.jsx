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
    createdAt: new Date('2024-01-01').toISOString(),
    approved: true,
  },
  {
    id: 'student-001',
    name: 'Maria Santos',
    email: 'student@demo.com',
    password: 'demo123',
    role: 'student',
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
        // Re-fetch user to pick up any updates
        const users = getUsers()
        const fresh = users.find(u => u.id === session.id)
        if (fresh) setUser(fresh)
      } catch (_) {}
    }
    setLoading(false)
  }, [])

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = (email, password) => {
    const users = getUsers()
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) throw new Error('Invalid email or password.')
    if (!found.approved && found.role === 'recruiter')
      throw new Error('Your recruiter account is pending admin approval.')
    setUser(found)
    localStorage.setItem('ua_session', JSON.stringify({ id: found.id }))
    return found
  }

  // ── Register ───────────────────────────────────────────────────────────────
  const register = (data) => {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase()))
      throw new Error('An account with this email already exists.')

    const newUser = {
      id: `${data.role}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      approved: data.role !== 'recruiter', // recruiters need admin approval
      commissionRate: data.role === 'recruiter' ? 10 : undefined,
      ...data,
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
    // If admin updated the logged-in user, refresh session
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
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, getAllUsers, updateAnyUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
