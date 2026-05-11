import { Link } from 'react-router-dom'
import { ClipboardList, BookOpen, Users, DollarSign, ArrowRight, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

export default function AdminDashboard() {
  const { getAllUsers } = useAuth()
  const { applications, programs, commissions } = useData()

  const allUsers = getAllUsers()
  const recruiters = allUsers.filter(u => u.role === 'recruiter')
  const students   = allUsers.filter(u => u.role === 'student')

  const pendingApps     = applications.filter(a => a.status === 'submitted').length
  const underReviewApps = applications.filter(a => a.status === 'under_review').length
  const acceptedApps    = applications.filter(a => a.status === 'accepted').length
  const pendingRecruiters = recruiters.filter(r => !r.approved).length
  const totalCommission = commissions.reduce((s, c) => s + (c.amount ?? 0), 0)

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 6)

  const stats = [
    { label: 'New Applications',     value: pendingApps,       icon: Clock,         color: 'text-yellow-600', bg: 'bg-yellow-50',  to: '/admin/applications?status=submitted'  },
    { label: 'Under Review',         value: underReviewApps,   icon: ClipboardList, color: 'text-blue-600',   bg: 'bg-blue-50',    to: '/admin/applications?status=under_review'},
    { label: 'Accepted',             value: acceptedApps,      icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50',   to: '/admin/applications?status=accepted'   },
    { label: 'Pending Recruiters',   value: pendingRecruiters, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50',  to: '/admin/recruiters'                     },
    { label: 'Active Programmes',    value: programs.filter(p => p.active).length, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', to: '/admin/programs' },
    { label: 'Total Commissions',    value: `$${totalCommission.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50', to: '/admin/commissions' },
  ]

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of all admissions, programmes, and recruiter activity</p>
      </div>

      {/* Alert for pending items */}
      {(pendingApps > 0 || pendingRecruiters > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-amber-800">Action Required</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {pendingApps > 0 && `${pendingApps} new application${pendingApps > 1 ? 's' : ''} awaiting review. `}
              {pendingRecruiters > 0 && `${pendingRecruiters} recruiter${pendingRecruiters > 1 ? 's' : ''} pending approval.`}
            </p>
          </div>
          <Link to="/admin/applications" className="text-xs font-medium text-amber-700 hover:underline flex-shrink-0">Review Now</Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} to={s.to} className="stat-card hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent applications */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Applications</h2>
            <Link to="/admin/applications" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Manage all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentApps.map(app => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-900">{app.studentName}</p>
                  <p className="text-xs text-gray-400 truncate">{app.programName}</p>
                  {app.recruiterName && <p className="text-xs text-purple-500">via {app.recruiterName}</p>}
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
            {recentApps.length === 0 && (
              <p className="text-center text-gray-400 py-6 text-sm">No applications yet.</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="section-title mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { to: '/admin/applications', label: 'Review Applications', icon: ClipboardList, color: 'bg-blue-50 text-blue-700'   },
                { to: '/admin/programs',     label: 'Manage Programmes',   icon: BookOpen,      color: 'bg-indigo-50 text-indigo-700' },
                { to: '/admin/recruiters',   label: 'Manage Recruiters',   icon: Users,         color: 'bg-purple-50 text-purple-700' },
                { to: '/admin/commissions',  label: 'Process Commissions', icon: DollarSign,    color: 'bg-green-50 text-green-700'   },
              ].map(a => (
                <Link key={a.to} to={a.to}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className={`w-9 h-9 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0`}>
                    <a.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">{a.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform summary */}
          <div className="card bg-gray-900 text-white">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <p className="font-semibold text-sm">Platform Summary</p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Total Students',   value: students.length     },
                { label: 'Active Recruiters',value: recruiters.filter(r => r.approved).length },
                { label: 'Total Applications', value: applications.length },
                { label: 'Acceptance Rate',  value: applications.length
                  ? `${Math.round(acceptedApps / applications.length * 100)}%`
                  : 'N/A' },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-gray-400">{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
