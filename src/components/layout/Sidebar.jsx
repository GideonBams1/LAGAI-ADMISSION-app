import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, FileText, ClipboardList,
  Users, DollarSign, LogOut, GraduationCap, Send, Menu, X,
  Settings, BarChart3
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const NAV = {
  student: [
    { to: '/student/dashboard',     label: 'Dashboard',        icon: LayoutDashboard },
    { to: '/student/programs',      label: 'Browse Programs',  icon: BookOpen },
    { to: '/student/apply',         label: 'Apply Now',        icon: Send },
    { to: '/student/applications',  label: 'My Applications',  icon: ClipboardList },
  ],
  recruiter: [
    { to: '/recruiter/dashboard',   label: 'Dashboard',        icon: LayoutDashboard },
    { to: '/recruiter/submit',      label: 'Submit Application', icon: Send },
    { to: '/recruiter/students',    label: 'My Students',      icon: Users },
    { to: '/recruiter/commissions', label: 'Commissions',      icon: DollarSign },
  ],
  admin: [
    { to: '/admin/dashboard',       label: 'Dashboard',        icon: LayoutDashboard },
    { to: '/admin/applications',    label: 'Applications',     icon: ClipboardList },
    { to: '/admin/programs',        label: 'Programs',         icon: BookOpen },
    { to: '/admin/recruiters',      label: 'Recruiters',       icon: Users },
    { to: '/admin/commissions',     label: 'Commissions',      icon: BarChart3 },
  ],
}

const ROLE_COLORS = {
  student:   'from-blue-700 to-blue-900',
  recruiter: 'from-purple-700 to-purple-900',
  admin:     'from-gray-800 to-gray-950',
}

const ROLE_LABELS = {
  student: 'Student Portal',
  recruiter: 'Recruiter Portal',
  admin: 'Admin Panel',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const nav = NAV[user?.role] ?? []
  const gradient = ROLE_COLORS[user?.role] ?? ROLE_COLORS.admin

  const SidebarContent = () => (
    <div className={`flex flex-col h-full bg-gradient-to-b ${gradient} text-white`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-none">UniApply</p>
          <p className="text-xs text-white/60 mt-0.5">{ROLE_LABELS[user?.role]}</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold uppercase">
            {user?.name?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}
