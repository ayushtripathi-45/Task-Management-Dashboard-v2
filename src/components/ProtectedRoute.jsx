import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from './Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Securing your workspace" />;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

