import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function FullPageLoader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-bone">
      <div className="flex items-center gap-3">
        <span className="block h-2 w-2 animate-pulse bg-ink" />
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ash">{label}…</p>
      </div>
    </div>
  );
}

export function RequireAuth({ children, redirectTo = '/login' }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  return children;
}

export function RequireRole({ children, allow = [], fallback = '/dashboard' }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  const ok = role === 'admin' || allow.includes(role);
  if (!ok) return <Navigate to={fallback} replace />;
  return children;
}

export function RedirectIfAuthed({ children }) {
  const { user, role, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (user) {
    const dest = role === 'admin' || role === 'editor' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={dest} replace />;
  }
  return children;
}
