import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FiEdit3, FiKey, FiLogOut, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Page from '../components/Page.jsx';
import Counter from '../components/Counter.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../firebase/config.js';

const statuses = ['Upcoming', 'In Progress', 'Completed'];
const priorities = ['Low', 'Medium', 'High'];
const colors = ['#7C3AED', '#06B6D4', '#10B981'];

export default function Account() {
  const { currentUser, profile, activities, editProfile, changePassword, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [changing, setChanging] = useState(false);
  const [profileForm, setProfileForm] = useState(profile?.profile || {});
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '' });

  useEffect(() => {
    const taskQuery = query(collection(db, 'tasks'), where('userId', '==', currentUser.uid));
    return onSnapshot(taskQuery, (snapshot) => setTasks(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
  }, [currentUser.uid]);

  useEffect(() => setProfileForm(profile?.profile || {}), [profile]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'Completed').length;
    const inProgress = tasks.filter((task) => task.status === 'In Progress').length;
    const upcoming = tasks.filter((task) => task.status === 'Upcoming').length;
    return { total, completed, inProgress, upcoming, productivity: total ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  const charts = useMemo(() => ({
    status: statuses.map((status) => ({ name: status, value: tasks.filter((task) => task.status === status).length })),
    priority: priorities.map((priority) => ({ name: priority, tasks: tasks.filter((task) => task.priority === priority).length })),
    weekly: Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const iso = date.toISOString().slice(0, 10);
      return { day, completed: tasks.filter((task) => task.completedAt?.startsWith?.(iso)).length };
    })
  }), [tasks]);

  async function saveProfile(event) {
    event.preventDefault();
    await editProfile({ ...profileForm, avatarLetter: profileForm.firstName?.charAt(0)?.toUpperCase() || 'U', email: currentUser.email });
    setEditing(false);
  }

  async function savePassword(event) {
    event.preventDefault();
    try {
      await changePassword(passwordForm.current, passwordForm.next);
      setChanging(false);
      setPasswordForm({ current: '', next: '' });
    } catch (error) {
      toast.error(error.message);
    }
  }

  const createdAt = profile?.profile?.createdAt?.toDate?.()?.toLocaleDateString?.() || 'Recently';
  const avatar = profile?.profile?.avatarLetter || profile?.profile?.firstName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <Page>
      <section className="account-header glass-panel">
        <div className="avatar-xl">{avatar}</div>
        <div><span className="eyebrow">Account Center</span><h1>{profile?.profile?.firstName} {profile?.profile?.lastName}</h1><p>@{profile?.profile?.username} • {currentUser.email}</p></div>
      </section>

      <section className="split-grid section-block account-grid">
        <article className="glass-panel padded hover-lift">
          <h2><FiUser /> Account Information</h2>
          <Info label="User ID" value={currentUser.uid} />
          <Info label="First Name" value={profile?.profile?.firstName} />
          <Info label="Last Name" value={profile?.profile?.lastName} />
          <Info label="Username" value={profile?.profile?.username} />
          <Info label="Email" value={currentUser.email} />
          <Info label="Account Creation Date" value={createdAt} />
          <div className="button-row"><button className="primary" onClick={() => setEditing(true)}><FiEdit3 /> Edit Profile</button><button className="ghost" onClick={() => setChanging(true)}><FiKey /> Change Password</button><button className="ghost" onClick={logout}><FiLogOut /> Logout</button></div>
        </article>
        <article className="glass-panel padded hover-lift">
          <h2>User Statistics</h2>
          <div className="mini-stats">
            <span>Total <strong><Counter value={stats.total} /></strong></span><span>Completed <strong><Counter value={stats.completed} /></strong></span><span>In Progress <strong><Counter value={stats.inProgress} /></strong></span><span>Upcoming <strong><Counter value={stats.upcoming} /></strong></span><span>Productivity <strong><Counter value={stats.productivity} suffix="%" /></strong></span><span>Current Streak <strong><Counter value={profile?.stats?.currentStreak || 0} /></strong></span><span>Best Streak <strong><Counter value={profile?.stats?.bestStreak || 0} /></strong></span>
          </div>
        </article>
      </section>

      <section className="analytics-grid account-analytics">
        <ChartCard title="Task Status Distribution"><ResponsiveContainer><PieChart><Pie data={charts.status} dataKey="value" nameKey="name" outerRadius={76}>{charts.status.map((_, i) => <Cell key={i} fill={colors[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Tasks by Priority"><ResponsiveContainer><BarChart data={charts.priority}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="tasks" fill="#06B6D4" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Weekly Productivity Trend"><ResponsiveContainer><LineChart data={charts.weekly}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="day" /><YAxis allowDecimals={false} /><Tooltip /><Line dataKey="completed" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} /></LineChart></ResponsiveContainer></ChartCard>
      </section>

      <section className="badges glass-panel padded hover-lift"><h2>Productivity Badges</h2><span>Starter</span>{stats.completed >= 5 && <span>Closer</span>}{profile?.stats?.currentStreak >= 3 && <span>Streak Builder</span>}{stats.productivity >= 80 && <span>Flow Master</span>}</section>

      <section className="glass-panel padded section-block hover-lift">
        <h2>Activity History</h2>
        <div className="timeline">
          {activities.length ? activities.map((activity) => <div key={activity.id}><span /><p>{activity.action}</p><small>{activity.timestamp?.toDate?.()?.toLocaleString?.() || 'Just now'}</small></div>) : <p className="empty-state">No activity yet. Create your first task to start the timeline.</p>}
        </div>
      </section>

      {editing && <div className="modal-backdrop"><form className="modal-card glass-panel" onSubmit={saveProfile}><h2>Edit Profile</h2><input placeholder="First name" value={profileForm.firstName || ''} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} /><input placeholder="Last name" value={profileForm.lastName || ''} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} /><input placeholder="Username" value={profileForm.username || ''} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} /><div className="button-row"><button className="primary">Save</button><button className="ghost" type="button" onClick={() => setEditing(false)}>Cancel</button></div></form></div>}
      {changing && <div className="modal-backdrop"><form className="modal-card glass-panel" onSubmit={savePassword}><h2>Change Password</h2><input type="password" placeholder="Current password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} /><input type="password" minLength="6" placeholder="New password" value={passwordForm.next} onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })} /><div className="button-row"><button className="primary">Update</button><button className="ghost" type="button" onClick={() => setChanging(false)}>Cancel</button></div></form></div>}
    </Page>
  );
}

function ChartCard({ title, children }) { return <article className="chart-card glass-panel hover-lift float-card"><h2>{title}</h2><div>{children}</div></article>; }
function Info({ label, value }) { return <p className="info-row"><span>{label}</span><strong>{value || '-'}</strong></p>; }