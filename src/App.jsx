import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Guest from './pages/Main/Guest';
import Layout from './components/layout/Layout';
import LoginForm from './pages/Auth/LoginForm';
import RegisterForm from './pages/Auth/RegisterForm';
import Dashboard from './pages/Main/Dashboard';
import PageNotFound from './pages/Error/PageNotFound';
import { ROUTES } from './utils/Routes';
import Attendance from './pages/Main/Attendance';
import ScanQR from './pages/Main/ScanQR';
import Notification from './pages/Main/Notification';
import Profile from './pages/Main/Profile';
import CreateQR from './pages/Main/CreateQR';
// Import pages lainnya sesuai kebutuhan

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Guest Route Component
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route - Landing Page */}
      <Route path={ROUTES.HOME} element={<Guest />} />
      
      {/* Guest Routes - Auth Pages */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <GuestRoute>
            <LoginForm />
          </GuestRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <GuestRoute>
            <RegisterForm />
          </GuestRoute>
        }
      />
      
      {/* Protected Routes with NavbarLayout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.CREATEQR} element={
          <CreateQR />
        } />

        <Route path={ROUTES.DASHBOARD} element={
          <Dashboard />
        } />

        <Route path={ROUTES.ATTENDANCE} element={
          <Attendance />
        } />

        <Route path={ROUTES.SCANQR} element={
          <ScanQR />
        } />

        <Route path={ROUTES.NOTIFICATIONS} element={
          <Notification />
        } />

        <Route path={ROUTES.PROFILE} element={
          <Profile />
        } />
        
      </Route>
      
      {/* 404 Redirect */}
      <Route path={ROUTES.NOT_FOUND} element={
        <PageNotFound />
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename="/frontend-attendance-web-react">
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;