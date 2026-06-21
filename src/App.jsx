import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import CultureSignals from './pages/CultureSignals.jsx';
import Interviews from './pages/Interviews.jsx';
import Drops from './pages/Drops.jsx';
import Events from './pages/Events.jsx';
import Submit from './pages/Submit.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import AdminLogin from './pages/auth/AdminLogin.jsx';

import CustomerLayout from './components/customer/CustomerLayout.jsx';
import Overview from './pages/dashboard/Overview.jsx';
import Submissions from './pages/dashboard/Submissions.jsx';
import NewSubmission from './pages/dashboard/NewSubmission.jsx';
import TypedList from './pages/dashboard/TypedList.jsx';
import Profile from './pages/dashboard/Profile.jsx';
import SettingsPage from './pages/dashboard/Settings.jsx';

import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminSubmissions from './pages/admin/AdminSubmissions.jsx';
import AdminNewsletter from './pages/admin/AdminNewsletter.jsx';
import AdminMessages from './pages/admin/AdminMessages.jsx';
import AdminContent from './pages/admin/AdminContent.jsx';
import AdminCultureSignals from './pages/admin/AdminCultureSignals.jsx';
import AdminInterviews from './pages/admin/AdminInterviews.jsx';
import AdminDrops from './pages/admin/AdminDrops.jsx';
import AdminEvents from './pages/admin/AdminEvents.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

import { AuthProvider } from './contexts/AuthContext.jsx';
import { RequireAuth, RequireRole, RedirectIfAuthed } from './components/RouteGuard.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function PublicShell({ children }) {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route path="/" element={<PublicShell><Home /></PublicShell>} />
        <Route path="/culture-signals" element={<PublicShell><CultureSignals /></PublicShell>} />
        <Route path="/interviews" element={<PublicShell><Interviews /></PublicShell>} />
        <Route path="/drops" element={<PublicShell><Drops /></PublicShell>} />
        <Route path="/events" element={<PublicShell><Events /></PublicShell>} />
        <Route path="/submit" element={<PublicShell><Submit /></PublicShell>} />
        <Route path="/about" element={<PublicShell><About /></PublicShell>} />
        <Route path="/contact" element={<PublicShell><Contact /></PublicShell>} />

        {/* Auth */}
        <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
        <Route path="/signup" element={<RedirectIfAuthed><Signup /></RedirectIfAuthed>} />
        <Route path="/admin/login" element={<RedirectIfAuthed><AdminLogin /></RedirectIfAuthed>} />

        {/* Customer dashboard */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <CustomerLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Overview />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="new-submission" element={<NewSubmission />} />
          <Route path="drops" element={<TypedList type="drop" eyebrow="Customer / Drops" title="My drops." kicker="Your submitted and approved drops." ctaLabel="New Drop" />} />
          <Route path="events" element={<TypedList type="event" eyebrow="Customer / Events" title="My events." kicker="Your submitted and approved events." ctaLabel="New Event" />} />
          <Route path="interview-request" element={<TypedList type="interview" eyebrow="Customer / Interview" title="Interview requests." kicker="Pitch a person, a profile, or yourself." ctaLabel="New Request" />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <RequireRole allow={['editor']} fallback="/admin/login">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="culture-signals" element={<AdminCultureSignals />} />
          <Route path="interviews" element={<AdminInterviews />} />
          <Route path="drops" element={<AdminDrops />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
