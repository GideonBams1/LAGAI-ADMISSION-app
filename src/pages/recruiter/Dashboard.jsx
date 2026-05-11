import { Link } from 'react-router-dom'
import { Users, DollarSign, Send, CheckCircle, Clock, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

export default function RecruiterDashboard() {
  const { user } = useAuth()
  const { getRecruiterApplications, getRecruiterCommissions } = useData()

  const apps   = getRecruiterApplications(user.id)
  const comms  = getRecruiterCommissions(user.id)
  const recent = [...apps].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)

  const totalCommission   = comms.reduce((s, c) => s + (c.amount ?? 0), 0)
  const paidCommission    = comms.filter(c => c.status === 'paid').reduce((s, c) => s + (c.amount ?? 0), 0)
  const pendingCommission = comms.filter(c => c.status !== 'paid' && c.status !== 'cancelled').reduce((s, c) => s + (c.amount ?? 0), 0)

  const stats = [
    { label: 'Total Students', value: apps.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Accepted',       value: apps.filter(a => a.status === 'accepted').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Review', value: apps.filter(a => ['submitted','under_review'].includes(a.status)).length, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Earnings', value: `$${totalCommission.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <PageLayout>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="page-title">Recruiter Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.name} · {user.agency}</p>
        </div>
        <Link to="/recruiter/submit" className="btn-primary">
          <Send className="w-4 h-4" /> Submit Application
        </Link>
      </div>

      {!user.approved && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Account Pending Approval</p>
            <p className="text-sm text-amber-700 mt-0.5">Your recruiter account is awaiting admin approval.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
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
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Student Applications</h2>
            <Link to="/recruiter/students" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No student applications yet.</p>
              <Link to="/recruiter/submit" className="mt-3 inline-block btn-primary text-sm">Submit First Application</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map(app => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900">{app.studentName}</p>
                    <p className="text-xs text-gray-400 truncate">{app.programName}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" /> Commission Summary
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Total Earned', value: `$${totalCommission.toLocaleString()}`,   color: 'text-gray-900'    },
                { label: 'Paid Out',     value: `$${paidCommission.toLocaleString()}`,     color: 'text-green-600'   },
                { label: 'Pending',      value: `$${pendingCommission.toLocaleString()}`,  color: 'text-yellow-600'  },
              ].map(c => (
                <div key={c.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{c.label}</span>
                  <span className={`font-bold ${c.color}`}>{c.value}</span>
                </div>
              ))}
            </div>
            <Link to="/recruiter/commissions" className="mt-4 text-sm text-purple-600 hover:underline flex items-center gap-1">View details <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="card bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
            <p className="font-semibold text-sm">Your Commission Rate</p>
            <p className="text-4xl font-extrabold mt-1">{user.commissionRate ?? 10}%</p>
            <p className="text-purple-200 text-xs mt-1">Per successful enrolment</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
