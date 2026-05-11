import { Link } from 'react-router-dom'
import { ClipboardList, BookOpen, Send, Clock, CheckCircle, XCircle, ArrowRight, Bell } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { getStudentApplications, programs } = useData()
  const applications = getStudentApplications(user.id)

  const stats = {
    total:       applications.length,
    submitted:   applications.filter(a => a.status === 'submitted').length,
    under_review:applications.filter(a => a.status === 'under_review').length,
    accepted:    applications.filter(a => a.status === 'accepted').length,
    rejected:    applications.filter(a => a.status === 'rejected').length,
  }

  const recent = [...applications].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="page-title">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 mt-1">Here's a snapshot of your admission journey.</p>
        </div>
        <Link to="/student/apply" className="btn-primary">
          <Send className="w-4 h-4" /> New Application
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applications', value: stats.total,        icon: ClipboardList, color: 'text-blue-600',   bg: 'bg-blue-50'   },
          { label: 'Under Review',       value: stats.under_review, icon: Clock,         color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Accepted',           value: stats.accepted,     icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50'  },
          { label: 'Rejected',           value: stats.rejected,     icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-50'    },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Applications</h2>
            <Link to="/student/applications" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No applications yet.</p>
              <Link to="/student/apply" className="mt-3 inline-block btn-primary text-sm">Apply Now</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map(app => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{app.programName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Applied {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions + Programs */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="section-title mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { to: '/student/programs',     icon: BookOpen,     label: 'Browse Programs',   color: 'bg-blue-50 text-blue-700' },
                { to: '/student/apply',        icon: Send,         label: 'Submit Application', color: 'bg-green-50 text-green-700' },
                { to: '/student/applications', icon: ClipboardList, label: 'Track Applications', color: 'bg-purple-50 text-purple-700' },
              ].map(a => (
                <Link key={a.to} to={a.to}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className={`w-9 h-9 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0`}>
                    <a.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{a.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          <div className="card bg-blue-600 text-white">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-200" />
              <div>
                <p className="font-semibold text-sm">September 2025 Intake</p>
                <p className="text-blue-200 text-xs mt-1">Applications are now open for 6 programmes. Apply before the deadline!</p>
                <Link to="/student/programs" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                  View Programmes <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
