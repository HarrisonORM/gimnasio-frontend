import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CameraProvider } from './context/CameraContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import FloatingCamera from './components/FloatingCamera'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Acceso from './pages/Acceso'

function Layout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navbar />
      <main>
        {children}
      </main>
      <FloatingCamera />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CameraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/usuarios" element={
              <ProtectedRoute>
                <Layout><Usuarios /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/acceso" element={
              <ProtectedRoute>
                <Layout><Acceso /></Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </CameraProvider>
    </AuthProvider>
  )
}

export default App