export default function Loader({ label = 'Loading' }) {
  return (
    <section className="page center-page">
      <div className="loader-card glass-panel">
        <div className="loader-ring" />
        <p>{label}</p>
      </div>
    </section>
  );
}

