export default function AdminWorkspaceLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="admin-loading">
      <p className="eyebrow">Admin workspace</p>
      <h1>Loading dashboard</h1>
      <p>Loading available administration tools.</p>
      <div aria-hidden="true" className="admin-loading-grid">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
