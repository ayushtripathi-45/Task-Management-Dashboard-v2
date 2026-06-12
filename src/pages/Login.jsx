import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiLock, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Page from '../components/Page.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, resetPassword, signInWithGoogle, firebaseReady } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo);
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
      navigate(redirectTo);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGoogleBusy(false);
    }
  }

  async function forgotPassword() {
    if (!form.email) return toast.info('Enter your email first.');
    try { await resetPassword(form.email); } catch (error) { toast.error(error.message); }
  }

  return (
    <Page className="auth-page">
      <form className="auth-card glass-panel neumorphic" onSubmit={submit}>
        <span className="eyebrow">Welcome back</span>
        <h1>Login to your command center.</h1>
        {!firebaseReady && <p className="setup-note">Firebase env values are missing. Copy `.env.example` to `.env` and add your project keys.</p>}
        <button className="google-button" type="button" onClick={handleGoogle} disabled={googleBusy}>
          <FcGoogle /> {googleBusy ? 'Connecting Google...' : 'Continue with Google'}
        </button>
        <div className="auth-divider"><span /> or continue with email <span /></div>
        <label><FiMail /> Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label><FiLock /> Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="primary" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
        <button className="text-button" type="button" onClick={forgotPassword}>Forgot password?</button>
        <p>New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </Page>
  );
}