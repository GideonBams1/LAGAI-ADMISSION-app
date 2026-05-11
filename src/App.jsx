import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import StudentPrograms from './pages/student/Programs'
import StudentApply from './pages/student/Apply'
import StudentApplications from './pages/student/Applications'

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/Dashboard'
import RecruiterSubmit from './pages/recruiter/Submit'
import RecruiterStudents from './pages/recruiter/Students'
import RecruiterCommissions from './pages/recruiter/Commissions'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminApplications from './pages/admin/Applications'
import AdminPrograms from './pages/admin/Programs'
import AdminRecruiters from './pages/admin/Recruiters'
import AdminCommissions from './pages/admin/Commissions'

// Route guard
function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
  if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<RoleRedirect />} />

            {/* Student routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/student/programs" element={
              <ProtectedRoute role="student"><StudentPrograms /></ProtectedRoute>
            } />
            <Route path="/student/apply/:programId?" element={
              <ProtectedRoute role="student"><StudentApply /></ProtectedRoute>
            } />
            <Route path="/student/applications" element={
              <ProtectedRoute role="student"><StudentApplications /></ProtectedRoute>
            } />

            {/* Recruiter routes */}
            <Route path="/recruiter/dashboard" element={
              <ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>
            } />
            <Route path="/recruiter/submit" element={
              <ProtectedRoute role="recruiter"><RecruiterSubmit /></ProtectedRoute>
            } />
            <Route path="/recruiter/students" element={
              <ProtectedRoute role="recruiter"><RecruiterStudents /></ProtectedRoute>
            } />
            <Route path="/recruiter/commissions" element={
              <ProtectedRoute role="recruiter"><RecruiterCommissions /></ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/applications" element={
              <ProtectedRoute role="admin"><AdminApplications /></ProtectedRoute>
            } />
            <Route path="/admin/programs" element={
              <ProtectedRoute role="admin"><AdminPrograms /></ProtectedRoute>
            } />
            <Route path="/admin/recruiters" element={
              <ProtectedRoute role="admin"><AdminRecruiters /></ProtectedRoute>
            } />
            <Route path="/admin/commissions" element={
              <ProtectedRoute role="admin"><AdminCommissions /></ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}
