import { motion } from 'framer-motion';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiHome, FiLogIn, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Layout() {
  const { currentUser, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const firstName = profile?.profile?.firstName || currentUser?.email?.split('@')[0] || 'Guest';
  const avatar = profile?.profile?.avatarLetter || firstName.charAt(0).toUpperCase();

  function handleMouseMove(event) {
    const x = Math.round((event.clientX / window.innerWidth) * 100);
    const y = Math.round((event.clientY / window.innerHeight) * 100);
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
  }

  return (
    <div className="app-shell" onMouseMove={handleMouseMove}>
      <GradientBackground />
      <header className="navbar glass-panel">
        <button className="brand" onClick={() => navigate('/')} aria-label="Task Dashboard home">
          <span className="brand-mark">T</span>
          <span>Task Dashboard</span>
        </button>
        <nav className="nav-links">
          <NavLink to="/"><FiHome /> Home</NavLink>
          <NavLink to="/explore"><FiGrid /> Explore</NavLink>
          {currentUser && <NavLink to="/dashboard"><FiGrid /> Dashboard</NavLink>}
          {currentUser && <NavLink to="/account"><FiUser /> Account</NavLink>}
        </nav>
        <div className="nav-actions">
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          {currentUser ? (
            <button className="profile-chip" onClick={() => navigate('/account')}>
              <span>{avatar}</span>{firstName}
            </button>
          ) : (
            <button className="primary small" onClick={() => navigate('/login')}><FiLogIn /> Login</button>
          )}
          {currentUser && <button className="ghost small" onClick={logout}>Logout</button>}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function GradientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="mesh mesh-one" />
      <span className="mesh mesh-two" />
      <span className="mesh mesh-three" />
      <span className="aurora aurora-one" />
      <span className="aurora aurora-two" />
      <span className="noise-layer" />
      {Array.from({ length: 26 }).map((_, index) => (
        <motion.span
          className="particle"
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0.12, 0.56, 0.16], y: [-10, -150], x: [0, index % 2 ? 36 : -36] }}
          transition={{ duration: 16 + (index % 8), repeat: Infinity, delay: index * 0.42, ease: 'easeInOut' }}
          style={{ left: `${3 + index * 3.7}%`, top: `${42 + (index % 6) * 9}%` }}
        />
      ))}
    </div>
  );
}