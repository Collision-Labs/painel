import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Login from './components/Login'
import Signup from './components/Signup'
import ResetPassword from './components/ResetPassword'
import Dashboard from './components/Dashboard'
import CRM from './components/CRM'
import LeadsManager from './components/LeadsManager'
import EnrichmentLists from './components/EnrichmentLists'
import ImportExcel from './components/ImportExcel'
import Reports from './components/Reports'
import Settings from './components/Settings'
import AdminPanel from './components/AdminPanel'
import CreditsManager from './components/CreditsManager'
import './App.css'

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/crm" element={
            <ProtectedRoute>
              <AppLayout>
                <CRM />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/leads" element={
            <ProtectedRoute>
              <AppLayout>
                <LeadsManager />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/enrichment" element={
            <ProtectedRoute>
              <AppLayout>
                <EnrichmentLists />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/import" element={
            <ProtectedRoute>
              <AppLayout>
                <ImportExcel />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="collision_admin">
              <AppLayout>
                <AdminPanel />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/credits" element={
            <ProtectedRoute requiredRole="collision_admin">
              <AppLayout>
                <CreditsManager />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

