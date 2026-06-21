import { Routes, Route, useLocation } from 'react-router-dom';
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/culture-signals" element={<CultureSignals />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/drops" element={<Drops />} />
          <Route path="/events" element={<Events />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
