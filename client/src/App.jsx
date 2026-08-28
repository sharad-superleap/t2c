import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterInspector from './pages/RegisterInspector'
import Dashboard from './pages/Dashboard'
import InspectorDashboard from './pages/InspectorDashboard'
import InspectorProfile from './pages/InspectorProfile'
import SchedulePickup from './pages/SchedulePickup'
import PickupHistory from './pages/PickupHistory'
import Profile from './pages/Profile'

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/inspector" element={<RegisterInspector />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inspector/dashboard"
              element={
                <ProtectedRoute allowedRoles={['inspector']}>
                  <InspectorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inspector/profile"
              element={
                <ProtectedRoute allowedRoles={['inspector']}>
                  <InspectorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <SchedulePickup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <PickupHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
