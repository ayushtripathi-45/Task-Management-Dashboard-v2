import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { auth, db, firebaseReady } from '../firebase/config.js';

const AuthContext = createContext(null);
const defaultStats = { currentStreak: 0, bestStreak: 0, lastCompletedDate: null };
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

function splitDisplayName(displayName = '') {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || 'Google',
    lastName: parts.slice(1).join(' ') || 'User'
  };
}

function usernameFromUser(user) {
  return user.email?.split('@')[0] || user.displayName?.toLowerCase().replace(/\s+/g, '.') || 'taskflow.user';
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setProfile(null);
        setActivities([]);
        setLoading(false);
        return;
      }

      const profileRef = doc(db, 'users', user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setProfile({ id: profileSnap.id, ...profileSnap.data() });
      }
      await addActivity(user.uid, 'Login Activity');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!currentUser || !firebaseReady) return undefined;

    const unsubProfile = onSnapshot(doc(db, 'users', currentUser.uid), (snapshot) => {
      if (snapshot.exists()) setProfile({ id: snapshot.id, ...snapshot.data() });
    });

    const activityQuery = query(
      collection(db, 'activities'),
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );
    const unsubActivities = onSnapshot(activityQuery, (snapshot) => {
      setActivities(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });

    return () => {
      unsubProfile();
      unsubActivities();
    };
  }, [currentUser]);

  async function addActivity(userId, action) {
    if (!firebaseReady || !userId) return;
    await addDoc(collection(db, 'activities'), { userId, action, timestamp: serverTimestamp() });
  }

  async function createProfileIfMissing(user, source = 'email', formProfile = null) {
    const profileRef = doc(db, 'users', user.uid);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) return false;

    const display = splitDisplayName(user.displayName);
    const firstName = formProfile?.firstName || display.firstName;
    const lastName = formProfile?.lastName || display.lastName;
    const username = formProfile?.username || usernameFromUser(user);
    const email = formProfile?.email || user.email;

    await setDoc(profileRef, {
      profile: {
        firstName,
        lastName,
        username,
        email,
        avatarLetter: firstName?.charAt(0)?.toUpperCase() || 'U',
        authProvider: source,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp()
      },
      stats: defaultStats,
      settings: { theme: localStorage.getItem('taskflow-theme') || 'dark' }
    });
    return true;
  }

  async function signup(form) {
    if (!firebaseReady) throw new Error('Firebase is not configured. Add your .env values first.');
    const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
    await createProfileIfMissing(credential.user, 'email', form);
    await addActivity(credential.user.uid, 'Account Created');
    toast.success('Welcome to Task Dashboard');
  }

  async function login(email, password) {
    if (!firebaseReady) throw new Error('Firebase is not configured. Add your .env values first.');
    await signInWithEmailAndPassword(auth, email, password);
    toast.success('Signed in successfully');
  }

  async function signInWithGoogle() {
    if (!firebaseReady) throw new Error('Firebase is not configured. Add your .env values first.');
    const credential = await signInWithPopup(auth, googleProvider);
    const created = await createProfileIfMissing(credential.user, 'google');
    await addActivity(credential.user.uid, created ? 'Account Created with Google' : 'Google Login Activity');
    toast.success(created ? 'Google account connected. Welcome in.' : 'Signed in with Google');
    return credential.user;
  }

  async function logout() {
    if (currentUser) await addActivity(currentUser.uid, 'Logout');
    await signOut(auth);
    toast.info('Signed out');
  }

  async function resetPassword(email) {
    if (!firebaseReady) throw new Error('Firebase is not configured. Add your .env values first.');
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent');
  }

  async function editProfile(nextProfile) {
    await updateDoc(doc(db, 'users', currentUser.uid), { profile: nextProfile });
    await addActivity(currentUser.uid, 'Profile Updated');
    toast.success('Profile updated');
  }

  async function changePassword(currentPassword, nextPassword) {
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, nextPassword);
    await addActivity(currentUser.uid, 'Password Changed');
    toast.success('Password changed');
  }

  const value = useMemo(
    () => ({ currentUser, profile, activities, loading, signup, login, signInWithGoogle, logout, resetPassword, editProfile, changePassword, addActivity, firebaseReady }),
    [currentUser, profile, activities, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}