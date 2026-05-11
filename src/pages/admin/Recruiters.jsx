import { useState } from 'react'
import { Users, Search, CheckCircle, XCircle, Edit2, Globe, Phone, Calendar, DollarSign } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import Modal from '../../components/ui/Modal'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

export default function AdminRecruiters() {
  const { getAllUsers, updateAnyUser } = useAuth()
  const { getRecruiterApplications, getRecruiterCommissions } = useData()

  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all') // all | pending | active
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})

  const allUsers  = getAllUsers()
  const recruiters = allUsers.filter(u => u.role === 'recruiter')

  const filtered = recruiters.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.email.toLowerCase().includes(search.toLowerCase()) && !(r.agency || '').toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'pending' && r.approved) return false
    if (filter === 'active'  && !r.approved) return false
    return true
  })

  const approve = (id)  => updateAnyUser(id, { approved: true })
  const suspend = (id)  => updateAnyUser(id, { approved: false })

  const openEdit = (r) => {
    setEditing(r)
    setEditForm({ commissionRate: r.commissionRate ?? 10, agency: r.agency ?? '', phone: r.phone ?? '', agencyCountry: r.agencyCountry ?? '' })
  }

  const saveEdit = () => {
    updateAnyUser(editing.id, { ...editForm, commissionRate: Number(editForm.commissionRate) })
    setEditing(null)
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="page-title">Recruiter Management</h1>
        <p className="text-gray-500 mt-1">{recruiters.length} registered · {recruiters.filter(r => !r.approved).length} pending approval</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search recruiters…" className="input-field pl-9" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field sm:w-44">
            <option value="all">All Recruiters</option>
            <option value="pending">Pending Approval</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total',   value: recruiters.length,                      color: 'bg-gray-100 text-gray-700'    },
          { label: 'Active',  value: recruiters.filter(r => r.approved).length,    color: 'bg-green-50 text-green-700' },
          { label: 'Pending', value: recruiters.filter(r => !r.approved).length,   color: 'bg-amber-50 text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No recruiters found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => {
            const apps  = getRecruiterApplications(r.id)
            const comms = getRecruiterCommissions(r.id)
            const earned = comms.reduce((s, c) => s + (c.amount ?? 0), 0)

            return (
              <div key={r.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 uppercase text-lg flex-shrink-0">
                      {r.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-semibold text-gray-900">{r.name}</p>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${r.approved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          {r.approved ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{r.email}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 flex-wrap">
                        {r.agency && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{r.agency}</span>}
                        {r.phone  && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span>}
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-4 text-center flex-shrink-0">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{apps.length}</p>
                      <p className="text-xs text-gray-400">Students</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{apps.filter(a => a.status === 'accepted').length}</p>
                      <p className="text-xs text-gray-400">Accepted</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-purple-600">${earned.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Commissions</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-700">{r.commissionRate ?? 10}%</p>
                      <p className="text-xs text-gray-400">Rate</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => openEdit(r)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {r.approved ? (
                      <button onClick={() => suspend(r.id)}
                        className="flex items-center gap-1 text-xs py-1.5 px-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100">
                        <XCircle className="w-3.5 h-3.5" /> Suspend
                      </button>
                    ) : (
                      <button onClick={() => approve(r.id)}
                        className="flex items-center gap-1 text-xs py-1.5 px-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Recruiter">
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Agency / Company</label>
              <input value={editForm.agency} onChange={e => setEditForm(f => ({ ...f, agency: e.target.value }))}
                className="input-field" placeholder="Agency name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
              <input value={editForm.agencyCountry} onChange={e => setEditForm(f => ({ ...f, agencyCountry: e.target.value }))}
                className="input-field" placeholder="Country" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                className="input-field" placeholder="+1-555-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Commission Rate (%)</label>
              <input type="number" min="0" max="50" value={editForm.commissionRate}
                onChange={e => setEditForm(f => ({ ...f, commissionRate: e.target.value }))}
                className="input-field" />
              <p className="text-xs text-gray-400 mt-1">Percentage of annual fee paid as commission per accepted student.</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
              <button onClick={saveEdit} className="btn-primary">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  )
}
