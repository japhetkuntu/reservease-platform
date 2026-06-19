import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/login/ui/LoginPage';
import { SignupPage } from '../pages/signup/ui/SignupPage';
import { ForgotPasswordPage } from '../pages/forgot-password/ui/ForgotPasswordPage';
import { DashboardPage } from '../pages/dashboard/ui/DashboardPage';
import { AddPropertyPage } from '../pages/property/ui/AddPropertyPage';
import { EditPropertyPage } from '../pages/property/ui/EditPropertyPage';
import { AccommodationDetailPage } from '../pages/accommodation/ui/AccommodationDetailPage';
import { ProfilePage } from '../pages/profile/ui/ProfilePage';
import { NotificationsPage } from '../pages/notifications/ui/NotificationsPage';
import { Layout } from '../components/layout/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path="/accommodation/:id" element={
              <ProtectedRoute>
                <AccommodationDetailPage />
              </ProtectedRoute>
            } />

            <Route path="/add-property" element={
              <ProtectedRoute>
                <AddPropertyPage />
              </ProtectedRoute>
            } />

            <Route path="/edit-property/:id" element={
              <ProtectedRoute>
                <EditPropertyPage />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
