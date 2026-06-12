import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiRefreshCcw } from 'react-icons/fi';
import Page from '../components/Page.jsx';

const features = ['User Authentication', 'Task CRUD Operations', 'Task Status Management', 'Dashboard Analytics', 'User Account Center', 'Theme Switching', 'Productivity Streak Tracking', 'Responsive Design'];
const workflow = ['Sign Up', 'Login', 'Create Tasks', 'Manage Tasks', 'Track Progress', 'Increase Productivity'];

export default function Explore() {
  return (
    <Page>
      <section className="section-block hero compact">
        <span className="eyebrow">Project Showcase</span>
        <h1>A dashboard designed to remove friction from personal execution.</h1>
        <p>Task Dashboard was built to solve the scattered-work problem: too many task lists, not enough feedback loops, and no satisfying sense of progress.</p>
      </section>

      <section className="split-grid section-block">
        <article className="glass-panel padded hover-lift">
          <h2>Why it was built</h2>
          <p>Most productivity tools are either too plain for daily motivation or too heavy for individual users. This project blends clarity, delight, and real-time data in one polished interface.</p>
        </article>
        <article className="glass-panel padded hover-lift">
          <h2>Benefits for users</h2>
          <p>Users can capture work quickly, see what matters, track completion habits, and understand productivity patterns without leaving the dashboard.</p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading"><span className="eyebrow">Features Grid</span><h2>Built for secure, visual task control.</h2></div>
        <div className="feature-grid compact-grid">
          {features.map((feature) => <article className="feature-card glass-panel hover-lift float-card" key={feature}><FiCheckCircle /><h3>{feature}</h3></article>)}
        </div>
      </section>

      <section className="section-block glass-panel padded hover-lift">
        <div className="section-heading"><FiRefreshCcw className="large-icon" /><h2>Workflow</h2></div>
        <div className="workflow-row">{workflow.map((step) => <span key={step}>{step}</span>)}</div>
      </section>

      <section className="cta-panel glass-panel neumorphic hover-lift">
        <h2>Ready to experience the dashboard?</h2>
        <p>Open the secure workspace and start managing real tasks with analytics, streaks, and a board that actually feels good to use.</p>
        <Link className="primary" to="/dashboard">Explore Dashboard <FiArrowRight /></Link>
      </section>
    </Page>
  );
}

