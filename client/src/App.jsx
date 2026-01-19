import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Menu, X, Book, Heart, Calendar, Clock, User,
  Settings, Home, Search, BookOpen, Star, Sparkles,
  ChevronRight, ArrowRight, Play, Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import QuranPage from './pages/QuranPage';
import DuasPage from './pages/DuasPage';
import PrayersPage from './pages/PrayersPage';
import SurahDetail from './pages/SurahDetail';
import DuaDetail from './pages/DuaDetail';
import NamesPage from './pages/NamesPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Shared Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { icon: <Home size={18} />, label: "Home", path: "/" },
    { icon: <BookOpen size={18} />, label: "Quran", path: "/quran" },
    { icon: <Heart size={18} />, label: "Duas", path: "/duas" },
    { icon: <Clock size={18} />, label: "Prayers", path: "/prayers" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-md py-2' : 'spiritual-gradient py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 ${scrolled ? 'bg-spiritual-800 text-white shadow-lg' : 'bg-white/20 text-white shadow-lg backdrop-blur-md'
              }`}>
              <span className="text-xl font-bold font-arabic">ن</span>
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-spiritual-900' : 'text-white'
              }`}>Nur al-Quran</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <CustomNavLink
                key={link.label}
                {...link}
                scrolled={scrolled}
                active={location.pathname === link.path}
              />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${scrolled ? 'border-spiritual-100 bg-spiritual-50 text-spiritual-800' : 'border-white/20 bg-white/10 text-white'}`}>
                  <User size={16} />
                  <span className="text-sm font-bold">{user?.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm font-bold text-accent-gold hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-accent-gold hover:bg-yellow-600 text-white px-5 py-2 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg ${scrolled ? 'text-spiritual-900' : 'text-white'}`}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-spiritual-100 shadow-2xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <MobileNavLink key={link.label} {...link} onClick={() => setIsOpen(false)} />
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-spiritual-50 rounded-xl">
                      <User size={20} className="text-spiritual-400" />
                      <span className="font-bold text-spiritual-800">{user?.username}</span>
                    </div>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 bg-spiritual-800 text-white text-center rounded-xl font-semibold shadow-lg"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CustomNavLink = ({ icon, label, path, scrolled, active }) => (
  <Link to={path} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${active
    ? (scrolled ? 'bg-spiritual-800 text-white' : 'bg-white/20 text-white')
    : (scrolled ? 'text-spiritual-600 hover:bg-spiritual-50' : 'text-spiritual-100 hover:bg-white/10 hover:text-white')
    }`}>
    {icon}
    {label}
  </Link>
);

const MobileNavLink = ({ icon, label, path, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium text-spiritual-700 hover:bg-spiritual-50 active:bg-spiritual-100 transition-colors"
  >
    <span className="text-spiritual-400">{icon}</span>
    {label}
  </Link>
);

// --- Hero & Content Sections ---

const Hero = () => (
  <section className="relative pt-40 pb-24 px-4 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_top_right,#f0fdf4,white)]" />
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 left-10 w-96 h-96 bg-accent-gold/20 rounded-full blur-3xl -z-10"
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-accent-emerald/20 rounded-full blur-[100px] -z-10"
    />

    <div className="max-w-7xl mx-auto text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-spiritual-100 text-spiritual-800 text-sm font-bold uppercase tracking-widest animate-pulse">
          Experience the Majesty
        </span>
        <h1 className="text-5xl md:text-8xl font-bold text-spiritual-950 mb-8 font-arabic leading-[1.2] drop-shadow-sm">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </h1>
        <h2 className="text-4xl md:text-7xl font-extrabold text-spiritual-900 mb-8 leading-[1.1] tracking-tight">
          Illuminate Your Life with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-spiritual-700 to-accent-emerald underline decoration-accent-gold/40 underline-offset-8">Divine Revelation</span>
        </h2>
        <p className="text-xl md:text-2xl text-spiritual-700 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          A modern, spiritual gateway to understanding the Holy Quran. Crystal-clear translations, soul-stirring recitations, and tools for your spiritual journey.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-center gap-5"
      >
        <Link to="/quran" className="group bg-spiritual-800 text-white px-10 py-5 rounded-2xl font-bold shadow-[0_10px_30px_rgba(20,83,45,0.3)] hover:bg-spiritual-950 transition-all flex items-center justify-center gap-3 text-lg">
          <BookOpen className="group-hover:rotate-12 transition-transform" />
          Start Reading
          <ChevronRight size={20} />
        </Link>
        <Link to="/prayers" className="bg-white text-spiritual-950 border-2 border-spiritual-100 px-10 py-5 rounded-2xl font-bold hover:bg-spiritual-50 transition-all flex items-center justify-center gap-3 text-lg shadow-sm hover:shadow-md">
          <Play size={20} className="fill-spiritual-900" />
          Prayer Times
        </Link>
      </motion.div>

      {/* Stats/Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
      >
        {[
          { label: 'Surahs', count: '114' },
          { label: 'Verses', count: '6,236' },
          { label: 'Words', count: '77k+' },
          { label: 'Languages', count: '50+' },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-sm">
            <div className="text-2xl font-bold text-spiritual-900">{stat.count}</div>
            <div className="text-sm text-spiritual-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    {
      title: "Interactive Reader",
      desc: "Immersive reading experience with word-by-word analysis and bookmarking.",
      icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
      color: "bg-emerald-50",
      path: "/quran"
    },
    {
      title: "Audio Recitations",
      desc: "Listen to world-renowned Qaris with synchronized verse-by-verse highlighting.",
      icon: <Play className="w-8 h-8 text-amber-600" />,
      color: "bg-amber-50",
      path: "/quran"
    },
    {
      title: "Multi-Language",
      desc: "Translations and Tafsir in over 50 languages for global understanding.",
      icon: <Languages className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-50",
      path: "/quran"
    },
    {
      title: "Daily Remembrance",
      desc: "A collection of authentic Duas and Azkar for every moment of your day.",
      icon: <Star className="w-8 h-8 text-rose-600" />,
      color: "bg-rose-50",
      path: "/duas"
    },
    {
      title: "99 Names",
      desc: "Deep dive into the beautiful attributes and names of Allah with their meanings.",
      icon: <Sparkles className="w-8 h-8 text-indigo-600" />,
      color: "bg-indigo-50",
      path: "/names"
    }
  ];

  return (
    <section className="py-24 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-accent-emerald font-bold tracking-widest uppercase text-sm mb-3">Key Features</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-spiritual-950">Designed for Spiritual Growth</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.path}>
              <motion.div
                whileHover={{ y: -10 }}
                className="p-8 h-full rounded-[32px] border border-spiritual-50 glass-card transition-all cursor-pointer"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-spiritual-900 mb-3">{feature.title}</h4>
                <p className="text-spiritual-600 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-spiritual-950 text-white py-16 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 border-b border-white/10 pb-12 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm outline outline-1 outline-white/20">
            <span className="text-2xl font-bold font-arabic">ن</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">Nur al-Quran</span>
        </div>

        <div className="flex gap-8 text-spiritual-300 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/quran" className="hover:text-white transition-colors">Quran</Link>
          <Link to="/duas" className="hover:text-white transition-colors">Duas</Link>
          <Link to="/prayers" className="hover:text-white transition-colors">Prayers</Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-white font-bold">Aadhil • Web Developer</p>
          <div className="flex items-center gap-4">
            <a href="mailto:aadhildev2025@gmail.com" className="hover:text-accent-gold transition-colors text-sm">aadhildev2025@gmail.com</a>
            <a
              href="https://wa.me/94714304378?text=Hello%20DevLoop%E2%9D%A4"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-green-600/10 hover:bg-green-600/20 text-green-500 px-3 py-1.5 rounded-lg border border-green-500/20 transition-all"
              title="Chat on WhatsApp"
            >
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.628 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-xs font-bold">Chat on WhatsApp</span>
            </a>
          </div>
          <p className="text-xs opacity-60 mt-2">This is an open source page for all users to learn and benefit from.</p>
        </div>
        <div className="md:text-right flex flex-col gap-2">
          <p className="text-sm">&copy; {new Date().getFullYear()} Nur al-Quran Learning Platform.</p>
          <p className="text-sm opacity-60 italic">In the service of the Ummah</p>
        </div>
      </div>
    </div>
  </footer>
);

// --- Component Wrapper for Scroll to Top ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Main App ---

function AppContent() {
  return (
    <div className="min-h-screen bg-spiritual-50/50 selection:bg-spiritual-200 selection:text-spiritual-950">
      <ScrollToTop />
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Hero />
                <Features />
              </motion.div>
            } />
            <Route path="/quran" element={
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <QuranPage />
              </motion.div>
            } />
            <Route path="/quran/:id" element={
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <SurahDetail />
              </motion.div>
            } />
            <Route path="/duas" element={
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <DuasPage />
              </motion.div>
            } />
            <Route path="/duas/:category" element={
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <DuaDetail />
              </motion.div>
            } />
            <Route path="/names" element={
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <NamesPage />
              </motion.div>
            } />
            <Route path="/prayers" element={
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <PrayersPage />
              </motion.div>
            } />
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/register" element={<AuthPage initialMode="register" />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
