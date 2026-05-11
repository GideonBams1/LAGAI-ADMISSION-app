import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_PROGRAMS = [
  { id: 'prog-1', name: 'Computer Science (BSc)', faculty: 'Engineering & Technology', level: 'Undergraduate', duration: '4 Years', fee: 15000, currency: 'USD', intake: 'September 2025', seats: 120, description: 'A rigorous program covering algorithms, software engineering, AI, and systems design.', requirements: ['High School Diploma', 'Math & Science A-level', 'IELTS 6.5+'], active: true },
  { id: 'prog-2', name: 'Business Administration (MBA)', faculty: 'Business School', level: 'Postgraduate', duration: '2 Years', fee: 22000, currency: 'USD', intake: 'January 2026', seats: 80, description: 'Develop strategic leadership skills with concentrations in Finance, Marketing, or Operations.', requirements: ['Bachelor\'s Degree (any field)', 'GMAT 550+', 'IELTS 7.0+', '2 Years Work Experience'], active: true },
  { id: 'prog-3', name: 'Data Science & Analytics (MSc)', faculty: 'Engineering & Technology', level: 'Postgraduate', duration: '18 Months', fee: 18000, currency: 'USD', intake: 'September 2025', seats: 60, description: 'Master machine learning, big data technologies, and statistical modelling.', requirements: ['Bachelor\'s in CS/Math/Stats', 'Python proficiency', 'IELTS 6.5+'], active: true },
  { id: 'prog-4', name: 'International Law (LLB)', faculty: 'School of Law', level: 'Undergraduate', duration: '3 Years', fee: 16000, currency: 'USD', intake: 'September 2025', seats: 90, description: 'Study international trade law, human rights, and global governance frameworks.', requirements: ['High School Diploma', 'Essay submission', 'IELTS 7.0+'], active: true },
  { id: 'prog-5', name: 'Medicine (MBBS)', faculty: 'School of Medicine', level: 'Undergraduate', duration: '6 Years', fee: 28000, currency: 'USD', intake: 'September 2025', seats: 50, description: 'Clinical training combined with biomedical science for future healthcare professionals.', requirements: ['A-level Biology & Chemistry', 'MCAT 510+', 'IELTS 7.5+', 'Interview'], active: true },
  { id: 'prog-6', name: 'Architecture (BArch)', faculty: 'Design & Built Environment', level: 'Undergraduate', duration: '5 Years', fee: 17500, currency: 'USD', intake: 'September 2025', seats: 45, description: 'Creative design meets technical engineering in this accredited architecture programme.', requirements: ['Portfolio submission', 'A-level Math or Art', 'IELTS 6.5+'], active: true },
  { id: 'prog-7', name: 'Psychology (BSc)', faculty: 'Social Sciences', level: 'Undergraduate', duration: '3 Years', fee: 12000, currency: 'USD', intake: 'January 2026', seats: 100, description: 'Explore human behaviour, cognition, and mental health through evidence-based research.', requirements: ['High School Diploma', 'IELTS 6.0+'], active: true },
  { id: 'prog-8', name: 'Artificial Intelligence (MSc)', faculty: 'Engineering & Technology', level: 'Postgraduate', duration: '1 Year', fee: 19500, currency: 'USD', intake: 'September 2025', seats: 40, description: 'Deep learning, NLP, computer vision, and AI ethics for the next generation of AI engineers.', requirements: ['Bachelor\'s in CS or related', 'Programming experience', 'IELTS 6.5+'], active: true },
]

const SEED_APPLICATIONS = [
  {
    id: 'app-001',
    studentId: 'student-001',
    studentName: 'Alice Johnson',
    studentEmail: 'student@demo.com',
    programId: 'prog-1',
    programName: 'Computer Science (BSc)',
    recruiterId: null,
    recruiterName: null,
    status: 'under_review',
    submittedAt: new Date('2024-03-15').toISOString(),
    updatedAt: new Date('2024-03-16').toISOString(),
    personalStatement: 'I have always been passionate about technology and problem-solving...',
    documents: [
      { name: 'passport.pdf', type: 'passport', uploadedAt: new Date('2024-03-15').toISOString() },
      { name: 'transcript.pdf', type: 'transcript', uploadedAt: new Date('2024-03-15').toISOString() },
    ],
    adminNotes: '',
    offerLetterUrl: null,
  },
  {
    id: 'app-002',
    studentId: 'student-001',
    studentName: 'Alice Johnson',
    studentEmail: 'student@demo.com',
    programId: 'prog-3',
    programName: 'Data Science & Analytics (MSc)',
    recruiterId: 'recruiter-001',
    recruiterName: 'Bob Smith',
    status: 'accepted',
    submittedAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString(),
    personalStatement: 'My background in mathematics drives my interest in data science...',
    documents: [
      { name: 'cv.pdf', type: 'cv', uploadedAt: new Date('2024-02-20').toISOString() },
    ],
    adminNotes: 'Strong candidate. Scholarship considered.',
    offerLetterUrl: null,
    commissionPaid: false,
  },
]

const SEED_COMMISSIONS = [
  {
    id: 'com-001',
    recruiterId: 'recruiter-001',
    recruiterName: 'Bob Smith',
    applicationId: 'app-002',
    studentName: 'Alice Johnson',
    programName: 'Data Science & Analytics (MSc)',
    programFee: 18000,
    rate: 10,
    amount: 1800,
    status: 'pending',
    createdAt: new Date('2024-03-01').toISOString(),
  },
]

function load(key, seed) {
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw)
  localStorage.setItem(key, JSON.stringify(seed))
  return seed
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function DataProvider({ children }) {
  const [programs, setPrograms]       = useState(() => load('ua_programs', SEED_PROGRAMS))
  const [applications, setApplications] = useState(() => load('ua_applications', SEED_APPLICATIONS))
  const [commissions, setCommissions] = useState(() => load('ua_commissions', SEED_COMMISSIONS))

  // Persist to localStorage whenever state changes
  useEffect(() => { save('ua_programs', programs) },     [programs])
  useEffect(() => { save('ua_applications', applications) }, [applications])
  useEffect(() => { save('ua_commissions', commissions) }, [commissions])

  // ── Programs ──────────────────────────────────────────────────────────────
  const addProgram = (data) => {
    const p = { id: `prog-${Date.now()}`, ...data, active: true }
    setPrograms(prev => [...prev, p])
    return p
  }

  const updateProgram = (id, updates) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteProgram = (id) => {
    setPrograms(prev => prev.filter(p => p.id !== id))
  }

  // ── Applications ──────────────────────────────────────────────────────────
  const submitApplication = (data) => {
    const program = programs.find(p => p.id === data.programId)
    const app = {
      id: `app-${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      programName: program?.name ?? 'Unknown Program',
      adminNotes: '',
      offerLetterUrl: null,
      commissionPaid: false,
      ...data,
    }
    setApplications(prev => [...prev, app])

    // If there's a recruiter, create a pending commission
    if (data.recruiterId) {
      const rate = 10 // default 10%
      const comm = {
        id: `com-${Date.now()}`,
        recruiterId: data.recruiterId,
        recruiterName: data.recruiterName,
        applicationId: app.id,
        studentName: data.studentName,
        programName: app.programName,
        programFee: program?.fee ?? 0,
        rate,
        amount: Math.round((program?.fee ?? 0) * rate / 100),
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      setCommissions(prev => [...prev, comm])
    }

    return app
  }

  const updateApplication = (id, updates) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)
    )
  }

  const updateApplicationStatus = (id, status, adminNotes = '') => {
    setApplications(prev =>
      prev.map(a => a.id === id
        ? { ...a, status, adminNotes, updatedAt: new Date().toISOString() }
        : a)
    )

    // On acceptance, mark commissions as approved
    if (status === 'accepted') {
      setCommissions(prev =>
        prev.map(c => c.applicationId === id ? { ...c, status: 'approved' } : c)
      )
    }
    // On rejection, cancel commissions
    if (status === 'rejected') {
      setCommissions(prev =>
        prev.map(c => c.applicationId === id ? { ...c, status: 'cancelled' } : c)
      )
    }
  }

  // ── Commissions ───────────────────────────────────────────────────────────
  const updateCommission = (id, updates) => {
    setCommissions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const markCommissionPaid = (id) => {
    setCommissions(prev =>
      prev.map(c => c.id === id ? { ...c, status: 'paid', paidAt: new Date().toISOString() } : c)
    )
  }

  // ── Derived helpers ───────────────────────────────────────────────────────
  const getStudentApplications = (studentId) =>
    applications.filter(a => a.studentId === studentId)

  const getRecruiterApplications = (recruiterId) =>
    applications.filter(a => a.recruiterId === recruiterId)

  const getRecruiterCommissions = (recruiterId) =>
    commissions.filter(c => c.recruiterId === recruiterId)

  return (
    <DataContext.Provider value={{
      programs, applications, commissions,
      addProgram, updateProgram, deleteProgram,
      submitApplication, updateApplication, updateApplicationStatus,
      updateCommission, markCommissionPaid,
      getStudentApplications, getRecruiterApplications, getRecruiterCommissions,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
