import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, BookOpen, Clock, DollarSign, Users, Filter, ArrowRight, GraduationCap } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import { useData } from '../../contexts/DataContext'

const LEVELS = ['All', 'Undergraduate', 'Postgraduate']
const FACULTIES = ['All', 'Engineering & Technology', 'Business School', 'School of Law', 'School of Medicine', 'Design & Built Environment', 'Social Sciences']

export default function StudentPrograms() {
  const { programs } = useData()
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All')
  const [faculty, setFaculty] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = programs.filter(p => {
    if (!p.active) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.faculty.toLowerCase().includes(search.toLowerCase())) return false
    if (level !== 'All' && p.level !== level) return false
    if (faculty !== 'All' && p.faculty !== faculty) return false
    return true
  })

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="page-title">Browse Programmes</h1>
        <p className="text-gray-500 mt-1">Explore our {programs.filter(p => p.active).length} available programmes</p>
      </div>

      {/* Search & Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search programmes or faculties…"
              className="input-field pl-9"
            />
          </div>
          <select value={level} onChange={e => setLevel(e.target.value)} className="input-field md:w-44">
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
          <select value={faculty} onChange={e => setFaculty(e.target.value)} className="input-field md:w-60">
            {FACULTIES.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          <Filter className="w-3 h-3 inline mr-1" />
          Showing {filtered.length} of {programs.filter(p => p.active).length} programmes
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No programmes match your search.</p>
          <button onClick={() => { setSearch(''); setLevel('All'); setFaculty('All') }}
            className="mt-3 text-sm text-blue-600 hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => (
            <div key={p.id} className="card hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col"
              onClick={() => setSelected(p)}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  p.level === 'Undergraduate' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                }`}>{p.level}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
              <p className="text-xs text-blue-600 font-medium mb-3">{p.faculty}</p>
              <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">{p.description}</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {p.duration}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  ${p.fee?.toLocaleString()}/yr
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  {p.seats} seats
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Intake: {p.intake}</span>
                <Link
                  to={`/student/apply/${p.id}`}
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Apply <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    selected.level === 'Undergraduate' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                  }`}>{selected.level}</span>
                  <h2 className="text-xl font-bold text-gray-900 mt-2">{selected.name}</h2>
                  <p className="text-blue-600 text-sm font-medium">{selected.faculty}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>

              <p className="text-gray-600 mb-5">{selected.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                {[
                  { label: 'Duration', value: selected.duration },
                  { label: 'Annual Fee', value: `$${selected.fee?.toLocaleString()}` },
                  { label: 'Intake', value: selected.intake },
                  { label: 'Seats', value: `${selected.seats} available` },
                ].map(d => (
                  <div key={d.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500">{d.label}</p>
                    <p className="font-semibold text-gray-900 text-sm mt-1">{d.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Entry Requirements</h3>
                <ul className="space-y-1.5">
                  {selected.requirements?.map(r => (
                    <li key={r} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/student/apply/${selected.id}`}
                className="btn-primary w-full justify-center py-3"
                onClick={() => setSelected(null)}
              >
                Apply for this Programme <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
