import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Search, ChevronDown, ChevronUp, FileText, Calendar } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

export default function RecruiterStudents() {
  const { user } = useAuth()
  const { getRecruiterApplications } = useData()
  const apps = getRecruiterApplications(user.id)

  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filtered = apps.filter(a => {
    if (search && !a.studentName.toLowerCase().includes(search.toLowerCase()) && !a.programName.toLowerCase().includes(search.toLowerCase())) return false
    if (filter !== 'all' && a.status !== filter) return false
    return true
  }).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">My Students</h1>
          <p className="text-gray-500 mt-1">{apps.length} student application{apps.length !== 1 ? 's' : ''} submitted</p>
        </div>
        <Link to="/recruiter/submit" className="btn-primary">+ Submit Application</Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search students or programmes…" className="input-field pl-9" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field sm:w-44">
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="conditional">Conditional</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total',       value: apps.length,                                                      color: 'bg-blue-50 text-blue-700'   },
          { label: 'Under Review',value: apps.filter(a => ['submitted','under_review'].includes(a.status)).length, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Accepted',    value: apps.filter(a => a.status === 'accepted').length,                 color: 'bg-green-50 text-green-700'  },
          { label: 'Rejected',    value: apps.filter(a => a.status === 'rejected').length,                 color: 'bg-red-50 text-red-700'      },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="mb-3">{apps.length === 0 ? "You haven't submitted any student applications yet." : "No students match your filter."}</p>
          {apps.length === 0 && <Link to="/recruiter/submit" className="btn-primary">Submit First Application</Link>}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <div key={app.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 font-bold text-purple-700 uppercase text-sm">
                    {app.studentName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-semibold text-gray-900">{app.studentName}</p>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-sm text-gray-500 truncate">{app.programName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(app.submittedAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {app.documents?.length ?? 0} docs
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0">
                  {expanded === app.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {expanded === app.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  {app.adminNotes && (
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-blue-600 mb-1">Admin Note</p>
                      <p className="text-sm text-blue-800">{app.adminNotes}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-gray-400">Email</p><p className="font-medium">{app.studentEmail}</p></div>
                    <div><p className="text-xs text-gray-400">Last Updated</p><p className="font-medium">{new Date(app.updatedAt).toLocaleDateString()}</p></div>
                    <div><p className="text-xs text-gray-400">Application ID</p><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{app.id}</code></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
