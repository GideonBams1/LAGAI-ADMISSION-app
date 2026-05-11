import { useState } from 'react'
import { Plus, Edit2, Trash2, BookOpen, Search, ToggleLeft, ToggleRight, X, AlertCircle } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import Modal from '../../components/ui/Modal'
import { useData } from '../../contexts/DataContext'

const EMPTY_FORM = {
  name: '', faculty: '', level: 'Undergraduate', duration: '', fee: '', currency: 'USD',
  intake: '', seats: '', description: '', requirements: '',
}

const LEVELS    = ['Undergraduate', 'Postgraduate', 'Doctorate', 'Certificate']
const FACULTIES = ['Engineering & Technology', 'Business School', 'School of Law', 'School of Medicine', 'Design & Built Environment', 'Social Sciences', 'Arts & Humanities', 'Science']

export default function AdminPrograms() {
  const { programs, addProgram, updateProgram, deleteProgram } = useData()
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null) // null | 'add' | 'edit'
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editing, setEditing]   = useState(null)
  const [error, setError]       = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = programs.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.faculty.toLowerCase().includes(search.toLowerCase())
  )

  const handleForm = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setError(''); setModal('edit') }
  const openEdit = (p) => {
    setForm({ ...p, requirements: Array.isArray(p.requirements) ? p.requirements.join('\n') : p.requirements || '' })
    setEditing(p.id)
    setError('')
    setModal('edit')
  }

  const save = () => {
    if (!form.name || !form.faculty || !form.fee) { setError('Name, Faculty, and Fee are required.'); return }
    const data = {
      ...form,
      fee: Number(form.fee),
      seats: Number(form.seats) || 0,
      requirements: typeof form.requirements === 'string'
        ? form.requirements.split('\n').map(r => r.trim()).filter(Boolean)
        : form.requirements,
    }
    if (editing) {
      updateProgram(editing, data)
    } else {
      addProgram(data)
    }
    setModal(null)
  }

  const confirmDel = (id) => setConfirmDelete(id)
  const doDelete   = () => { deleteProgram(confirmDelete); setConfirmDelete(null) }

  const toggle = (p) => updateProgram(p.id, { active: !p.active })

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Programme Management</h1>
          <p className="text-gray-500 mt-1">{programs.length} programmes · {programs.filter(p => p.active).length} active</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Programme
        </button>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search programmes…" className="input-field pl-9" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Programme', 'Faculty', 'Level', 'Duration', 'Fee/yr', 'Intake', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className={`hover:bg-gray-50 ${!p.active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{p.name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[140px]">
                    <p className="truncate">{p.faculty}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.level === 'Undergraduate' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                      {p.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.duration}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">${Number(p.fee).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{p.intake}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(p)} className="flex items-center gap-1.5 text-xs font-medium">
                      {p.active
                        ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Active</span></>
                        : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-500">Inactive</span></>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => confirmDel(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No programmes found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modal === 'edit'} onClose={() => setModal(null)} title={editing ? 'Edit Programme' : 'Add New Programme'} size="lg">
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Programme Name *</label>
              <input name="name" value={form.name} onChange={handleForm} className="input-field" placeholder="e.g. Computer Science (BSc)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Faculty *</label>
              <select name="faculty" value={form.faculty} onChange={handleForm} className="input-field">
                <option value="">Select faculty…</option>
                {FACULTIES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
              <select name="level" value={form.level} onChange={handleForm} className="input-field">
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
              <input name="duration" value={form.duration} onChange={handleForm} className="input-field" placeholder="e.g. 4 Years" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual Fee (USD) *</label>
              <input name="fee" type="number" value={form.fee} onChange={handleForm} className="input-field" placeholder="e.g. 15000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Next Intake</label>
              <input name="intake" value={form.intake} onChange={handleForm} className="input-field" placeholder="e.g. September 2025" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Available Seats</label>
              <input name="seats" type="number" value={form.seats} onChange={handleForm} className="input-field" placeholder="e.g. 120" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleForm} rows={3} className="input-field resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Entry Requirements (one per line)</label>
              <textarea name="requirements" value={form.requirements} onChange={handleForm} rows={4}
                className="input-field resize-none font-mono text-sm"
                placeholder="Bachelor's Degree&#10;IELTS 6.5+&#10;2 Years Work Experience" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={save} className="btn-primary">{editing ? 'Save Changes' : 'Add Programme'}</button>
          </div>
        </div>
      </Modal>

      {/* Confirm delete */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Programme" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this programme? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setConfirmDelete(null)} className="btn-secondary">Cancel</button>
          <button onClick={doDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </PageLayout>
  )
}
