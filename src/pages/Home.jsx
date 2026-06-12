import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiCode, FiLock, FiTrendingUp, FiZap } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import Page from '../components/Page.jsx';

const features = [
  ['Task Management', 'Create, prioritize, schedule, update, and complete work with a focused flow.', FiCheckCircle],
  ['Progress Tracking', 'Live status views and productivity signals keep momentum visible.', FiTrendingUp],
  ['Productivity Analytics', 'Charts make workload, priority, and weekly progress easy to understand.', FiBarChart2],
  ['Task Streak System', 'Current and best streaks encourage consistent follow-through.', FiZap],
  ['Secure Authentication', 'Firebase Auth protects user dashboards and account centers.', FiLock]
];
const stack = ['React', 'JavaScript', 'Firebase', 'Firestore', 'CSS', 'Framer Motion', 'Recharts'];

export default function Home() {
  return (
    <Page>
      <section className="hero split-grid">
        <div className="hero-copy">
          <span className="eyebrow">Version 2.0 • Premium SaaS Dashboard</span>
          <h1>Plan sharper, move faster, and make progress feel visible.</h1>
          <p>Task Dashboard is a modern task management workspace for creators, students, and teams who want Trello-style clarity with Linear-grade polish.</p>
          <div className="button-row">
            <Link className="primary" to="/explore">Explore Project <FiArrowRight /></Link>
            <Link className="ghost" to="/signup">Get Started</Link>
          </div>
        </div>
        <motion.div className="hero-board glass-panel neumorphic float-card" initial={{ rotate: -2 }} animate={{ rotate: 0, y: [0, -15, 0] }} transition={{ y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } }}>
          <div className="mini-window"><span /><span /><span /></div>
          {['Design auth flow', 'Ship analytics center', 'Polish dashboard UX'].map((item, index) => (
            <motion.div className="mini-task" key={item} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.15, duration: 0.5 }}>
              <strong>{item}</strong><small>{index === 2 ? 'Completed' : index === 1 ? 'In progress' : 'Upcoming'}</small>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section-block">
        <div className="section-heading"><span className="eyebrow">Features Overview</span><h2>Everything a serious task dashboard needs.</h2></div>
        <div className="feature-grid">
          {features.map(([title, text, Icon]) => <article className="feature-card glass-panel hover-lift float-card" key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="section-block split-grid overview-grid">
        <div className="glass-panel padded hover-lift">
          <FiCode className="large-icon" />
          <h2>Project Overview</h2>
          <p>Built as a full-stack React and Firebase application with protected routes, real-time Firestore updates, responsive layouts, analytics, activity logs, and theme persistence.</p>
        </div>
        <div className="stack-cloud glass-panel padded hover-lift">
          <h2>Tech Stack</h2>
          <div>{stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
          <h3>Key Highlights</h3>
          <p>Glassmorphism, neumorphic cards, drag-and-drop task board, streak engine, keyboard shortcuts, toasts, and animated counters.</p>
          <h3>Upcoming Features</h3>
          <p>Team workspaces, comments, file attachments, calendar sync, and AI-generated task breakdowns.</p>
        </div>
      </section>

      <footer className="footer glass-panel">
        <p>Created by Ayush Tripathi (B.Tech CSE Undergrad)</p>
        <a className="github-icon" href="https://github.com/ayushtripathi-45" target="_blank" rel="noreferrer" aria-label="Open Ayush Tripathi GitHub profile"><FaGithub /></a>
        <p>Copyright © 2026 Task Dashboard</p>
      </footer>
    </Page>
  );
}