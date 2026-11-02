"use client";

export default function AdminWorkspaceError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <section className="admin-error-state" role="alert">
      <p className="eyebrow">Admin workspace</p>
      <h1>We could not load this page.</h1>
      <p>
        The requested admin content is temporarily unavailable. Please try
        again.
      </p>
      <button className="button button-primary" onClick={retry} type="button">
        Try again
      </button>
    </section>
  );
}
