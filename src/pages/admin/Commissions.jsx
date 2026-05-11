import { useState } from 'react'
import { DollarSign, Search, CheckCircle, Clock, TrendingUp, CreditCard } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { useData } from '../../contexts/DataContext'

export default function AdminCommissions() {
  const { commissions, updateCommission, markCommissionPaid } = useData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = commissions.filter(c => {
    if (search && !c.recruiterName?.toLowerCase().includes(search.toLowerCase()) && !c.studentName?.toLowerCase().includes(search.toLowerCase())) return false
    if (filter !== 'all' && c.status !== filter) return false
    return true
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total    = commissions.reduce((s, c) => s + (c.amount ?? 0), 0)
  const paid     = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + (c.amount ?? 0), 0)
  const approved = commissions.filter(c => c.status === 'approved').reduce((s, c) => s + (c.amount ?? 0), 0)
  const pending  = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + (c.amount ?? 0), 0)

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="page-title">Commission Management</h1>
        <p className="text-gray-500 mt-1">Track and process recruiter commissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Owed',      value: total,    icon: DollarSign,  color: 'text-gray-700',   bg: 'bg-gray-100'   },
          { label: 'Paid Out',        value: paid,     icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50'   },
          { label: 'Approved (Queue)',value: approved, icon: TrendingUp,  color: 'text-blue-600',   bg: 'bg-blue-50'    },
          { label: 'Pending Review',  value: pending,  icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50'  },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${s.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by recruiter or student…" className="input-field pl-9" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field sm:w-44">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No commissions found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Recruiter', 'Student', 'Programme', 'Fee', 'Rate', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.recruiterName}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.studentName}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[140px]">
                      <p className="truncate">{c.programName}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">${c.programFee?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700">{c.rate}%</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900">${c.amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {c.status === 'pending' && (
                          <button onClick={() => updateCommission(c.id, { status: 'approved' })}
                            className="text-xs py-1 px-2 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100">
                            Approve
                          </button>
                        )}
                        {c.status === 'approved' && (
                          <button onClick={() => markCommissionPaid(c.id)}
                            className="flex items-center gap-1 text-xs py-1 px-2 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100">
                            <CreditCard className="w-3 h-3" /> Mark Paid
                          </button>
                        )}
                        {c.status === 'pending' && (
                          <button onClick={() => updateCommission(c.id, { status: 'cancelled' })}
                            className="text-xs py-1 px-2 bg-gray-50 text-gray-500 border border-gray-200 rounded hover:bg-gray-100">
                            Cancel
                          </button>
                        )}
                        {c.status === 'paid' && (
                          <span className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Total ({filtered.length} commissions)
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    ${filtered.reduce((s, c) => s + (c.amount ?? 0), 0).toLocaleString()}
                  </td>
                  <td colSpan="3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
