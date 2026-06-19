import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/dashboard/ui/DashboardPage'
import { UsersPage } from './pages/users/ui/UsersPage'
import { UserDetailPage } from './pages/users/ui/UserDetailPage'
import { PropertiesPage } from './pages/properties/ui/PropertiesPage'
import { PropertyDetailPage } from './pages/properties/ui/PropertyDetailPage'
import { RequestsPage } from './pages/requests/ui/RequestsPage'
import { RequestDetailPage } from './pages/requests/ui/RequestDetailPage'
import { PaymentsPage } from './pages/payments/ui/PaymentsPage'
import { LoginPage } from './pages/auth/ui/LoginPage'
import { ResetPasswordPage } from './pages/auth/ui/ResetPasswordPage'
import { ProfilePage } from './pages/profile/ui/ProfilePage'
import { NotificationsPage } from './pages/notifications/ui/NotificationsPage'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center font-black uppercase tracking-widest animate-pulse">Neural Sync in Progress...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          <Route path="/*" element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/users/:id" element={<UserDetailPage />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/properties/:id" element={<PropertyDetailPage />} />
                  <Route path="/requests" element={<RequestsPage />} />
                  <Route path="/requests/:id" element={<RequestDetailPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
