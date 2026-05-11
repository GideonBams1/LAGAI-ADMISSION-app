import { useState } from 'react'
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Search } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

export default function RecruiterCommissions() {
  const { user } = useAuth()
  const { getRecruiterCommissions } = useData()
  const comms = getRecruiterCommissions(user.id)

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = comms.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false
    if (search && !c.studentName.toLowerCase().includes(search.toLowerCase()) && !c.programName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total   = comms.reduce((s, c) => s + (c.amount ?? 0), 0)
  const paid    = comms.filter(c => c.status === 'paid').reduce((s, c) => s + (c.amount ?? 0), 0)
  const approved= comms.filter(c => c.status === 'approved').reduce((s, c) => s + (c.amount ?? 0), 0)
  const pending = comms.filter(c => c.status === 'pending').reduce((s, c) => s + (c.amount ?? 0), 0)

  const statusIcon = { paid: CheckCircle, approved: TrendingUp, pending: Clock, cancelled: XCircle }

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="page-title">My Commissions</h1>
        <p className="text-gray-500 mt-1">Track your earnings for every successful student enrolment</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Earned',    value: total,    icon: DollarSign,  color: 'text-gray-800',    bg: 'bg-gray-100'   },
          { label: 'Paid Out',        value: paid,     icon: CheckCircle, color: 'text-green-600',   bg: 'bg-green-50'   },
          { label: 'Awaiting Payout', value: approved, icon: TrendingUp,  color: 'text-blue-600',    bg: 'bg-blue-50'    },
          { label: 'Pending Review',  value: pending,  icon: Clock,       color: 'text-yellow-600',  bg: 'bg-yellow-50'  },
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

      {/* Rate info */}
      <div className="card bg-gradient-to-r from-purple-600 to-indigo-700 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm">Your commission rate</p>
            <p className="text-4xl font-extrabold mt-1">{user.commissionRate ?? 10}%</p>
            <p className="text-purple-200 text-xs mt-1">Applied to the annual programme fee per successful enrolment</p>
          </div>
          <div className="text-right">
            <p className="text-purple-200 text-sm">Commissions earned</p>
            <p className="text-3xl font-bold">{comms.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by student or programme…" className="input-field pl-9" />
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
                  {['Student', 'Programme', 'Programme Fee', 'Rate', 'Commission', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.studentName}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[160px]">
                      <p className="truncate">{c.programName}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-900">${c.programFee?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700">{c.rate}%</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${c.status === 'paid' ? 'text-green-600' : c.status === 'cancelled' ? 'text-gray-400' : 'text-gray-900'}`}>
                        ${c.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(c.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-sm font-semibold text-gray-700">Total ({filtered.length} items)</td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    ${filtered.reduce((s, c) => s + (c.amount ?? 0), 0).toLocaleString()}
                  </td>
                  <td colSpan="2" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
