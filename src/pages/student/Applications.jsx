import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Search, FileText, Calendar, ChevronDown, ChevronUp, User, MessageSquare } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

const STATUS_STEPS = ['submitted', 'under_review', 'conditional', 'accepted']

function Timeline({ status }) {
  const currentIdx = STATUS_STEPS.indexOf(status)
  if (status === 'rejected' || status === 'withdrawn') {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs font-medium text-red-500">
          {status === 'rejected' ? '✗ Application rejected' : '✗ Application withdrawn'}
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 mt-3 flex-wrap">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={`w-2.5 h-2.5 rounded-full ${
            i < currentIdx ? 'bg-green-500' : i === currentIdx ? 'bg-blue-500' : 'bg-gray-200'
          }`} />
          <span className={`text-xs ${i === currentIdx ? 'text-blue-600 font-medium' : i < currentIdx ? 'text-green-600' : 'text-gray-400'}`}>
            {s.replace('_', ' ')}
          </span>
          {i < STATUS_STEPS.length - 1 && <span className="text-gray-200 text-xs">›</span>}
        </div>
      ))}
    </div>
  )
}

export default function StudentApplications() {
  const { user } = useAuth()
  const { getStudentApplications } = useData()
  const apps = getStudentApplications(user.id)

  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filtered = apps.filter(a => {
    if (search && !a.programName.toLowerCase().includes(search.toLowerCase())) return false
    if (filter !== 'all' && a.status !== filter) return false
    return true
  }).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="text-gray-500 mt-1">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/student/apply" className="btn-primary">+ New Application</Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search programmes…" className="input-field pl-9" />
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

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="mb-3">{apps.length === 0 ? "You haven't submitted any applications yet." : "No applications match your filter."}</p>
          {apps.length === 0 && <Link to="/student/apply" className="btn-primary">Apply Now</Link>}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <div key={app.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{app.programName}</h3>
                    <StatusBadge status={app.status} />
                    {app.recruiterName && (
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        via {app.recruiterName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Submitted {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {app.documents?.length ?? 0} document{app.documents?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Timeline status={app.status} />
                </div>
                <button onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0">
                  {expanded === app.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded detail */}
              {expanded === app.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  {app.adminNotes && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> Note from Admissions
                      </p>
                      <p className="text-sm text-blue-800">{app.adminNotes}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Personal Statement</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 line-clamp-4">{app.personalStatement}</p>
                  </div>
                  {app.documents?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Uploaded Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {app.documents.map((d, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700">
                            <FileText className="w-3 h-3 text-gray-400" /> {d.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    Application ID: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{app.id}</code>
                    &nbsp;·&nbsp;Last updated: {new Date(app.updatedAt).toLocaleString()}
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
