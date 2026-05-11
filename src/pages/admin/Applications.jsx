import { useState } from 'react'
import { Search, Filter, ChevronDown, ChevronUp, FileText, Calendar, User, CheckCircle, XCircle, Clock, Eye, MessageSquare } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import { useData } from '../../contexts/DataContext'

const STATUS_OPTIONS = ['all','submitted','under_review','conditional','accepted','rejected','withdrawn']

export default function AdminApplications() {
  const { applications, updateApplicationStatus } = useData()

  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [reviewing, setReviewing] = useState(null)
  const [reviewForm, setReviewForm] = useState({ status: '', notes: '' })

  const filtered = applications.filter(a => {
    if (search && !a.studentName?.toLowerCase().includes(search.toLowerCase()) && !a.programName?.toLowerCase().includes(search.toLowerCase())) return false
    if (filter !== 'all' && a.status !== filter) return false
    return true
  }).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  const openReview = (app) => {
    setReviewing(app)
    setReviewForm({ status: app.status, notes: app.adminNotes || '' })
  }

  const submitReview = () => {
    if (!reviewForm.status) return
    updateApplicationStatus(reviewing.id, reviewForm.status, reviewForm.notes)
    setReviewing(null)
  }

  const quickAction = (app, status) => {
    updateApplicationStatus(app.id, status, app.adminNotes || '')
  }

  const STATUS_COLORS = {
    submitted:    'bg-blue-50 text-blue-700',
    under_review: 'bg-yellow-50 text-yellow-700',
    conditional:  'bg-orange-50 text-orange-700',
    accepted:     'bg-green-50 text-green-700',
    rejected:     'bg-red-50 text-red-700',
    withdrawn:    'bg-gray-50 text-gray-500',
  }

  const counts = STATUS_OPTIONS.slice(1).reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length
    return acc
  }, {})

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="page-title">Applications Management</h1>
        <p className="text-gray-500 mt-1">{applications.length} total applications</p>
      </div>

      {/* Status pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === s
                ? 'bg-gray-900 text-white'
                : s === 'all' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : `${STATUS_COLORS[s]} hover:opacity-80`
            }`}>
            {s === 'all' ? `All (${applications.length})` : `${s.replace('_', ' ')} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name or programme…" className="input-field pl-9" />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          <Filter className="w-3 h-3 inline mr-1" />Showing {filtered.length} applications
        </p>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No applications match your filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <div key={app.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 uppercase text-sm flex-shrink-0">
                    {app.studentName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-semibold text-gray-900">{app.studentName}</p>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-sm text-gray-600 truncate">{app.programName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                        {new Date(app.submittedAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                      </span>
                      {app.recruiterName && (
                        <span className="flex items-center gap-1 text-purple-500">
                          <User className="w-3 h-3" /> via {app.recruiterName}
                        </span>
                      )}
                      <span>{app.documents?.length ?? 0} docs</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {app.status === 'submitted' && (
                    <button onClick={() => quickAction(app, 'under_review')}
                      className="btn-secondary text-xs py-1 px-2.5">
                      <Clock className="w-3 h-3" /> Review
                    </button>
                  )}
                  {['submitted','under_review','conditional'].includes(app.status) && (
                    <>
                      <button onClick={() => quickAction(app, 'accepted')}
                        className="text-xs py-1 px-2.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Accept
                      </button>
                      <button onClick={() => quickAction(app, 'rejected')}
                        className="text-xs py-1 px-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => openReview(app)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600">
                    {expanded === app.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === app.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div><p className="text-xs text-gray-400">Email</p><p className="font-medium">{app.studentEmail}</p></div>
                    <div><p className="text-xs text-gray-400">Last Updated</p><p className="font-medium">{new Date(app.updatedAt).toLocaleDateString()}</p></div>
                    <div><p className="text-xs text-gray-400">App ID</p><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{app.id}</code></div>
                  </div>
                  {app.personalStatement && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-gray-500 mb-1">Personal Statement</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{app.personalStatement}</p>
                    </div>
                  )}
                  {app.adminNotes && (
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Admin Notes
                      </p>
                      <p className="text-sm text-blue-800">{app.adminNotes}</p>
                    </div>
                  )}
                  {app.documents?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {app.documents.map((d, i) => (
                          <span key={i} className="inline-flex items-center gap-1 bg-white border text-xs px-2.5 py-1 rounded-full text-gray-700">
                            <FileText className="w-3 h-3 text-gray-400" />{d.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal open={!!reviewing} onClose={() => setReviewing(null)} title="Review Application" size="lg">
        {reviewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-600 mb-1">Student</p>
                <p className="font-medium">{reviewing.studentName}</p>
                <p className="text-sm text-gray-500">{reviewing.studentEmail}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Programme</p>
                <p className="font-medium">{reviewing.programName}</p>
                {reviewing.recruiterName && <p className="text-xs text-purple-500 mt-1">via {reviewing.recruiterName}</p>}
              </div>
            </div>

            {reviewing.personalStatement && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Personal Statement</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 max-h-32 overflow-y-auto">
                  {reviewing.personalStatement}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
              <select value={reviewForm.status} onChange={e => setReviewForm(f => ({ ...f, status: e.target.value }))}
                className="input-field">
                {STATUS_OPTIONS.slice(1).map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (visible to student & recruiter)</label>
              <textarea value={reviewForm.notes}
                onChange={e => setReviewForm(f => ({ ...f, notes: e.target.value }))}
                rows={3} placeholder="Any notes or conditions…"
                className="input-field resize-none" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setReviewing(null)} className="btn-secondary">Cancel</button>
              <button onClick={submitReview} className="btn-primary">Save Decision</button>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  )
}
