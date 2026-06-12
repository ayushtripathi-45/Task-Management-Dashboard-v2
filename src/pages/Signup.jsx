import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiAtSign, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Page from '../components/Page.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup, signInWithGoogle, firebaseReady } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <Page className="auth-page">
      <form className="auth-card glass-panel neumorphic wide" onSubmit={submit}>
        <span className="eyebrow">Start free</span>
        <h1>Create your productivity profile.</h1>
        {!firebaseReady && <p className="setup-note">Firebase env values are missing. Copy `.env.example` to `.env` and add your project keys.</p>}
        <button className="google-button" type="button" onClick={handleGoogle} disabled={googleBusy}>
          <FcGoogle /> {googleBusy ? 'Connecting Google...' : 'Sign up with Google'}
        </button>
        <div className="auth-divider"><span /> or create with email <span /></div>
        <div className="form-grid">
          <label><FiUser /> First Name<input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></label>
          <label><FiUser /> Last Name<input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></label>
        </div>
        <label><FiAtSign /> Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>
        <label><FiMail /> Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label><FiLock /> Password<input type="password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="primary" disabled={busy}>{busy ? 'Creating...' : 'Sign Up'}</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </Page>
  );
}