import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page" id="main-content" lang="en">
      <span aria-hidden="true" className="not-found-number">404</span>
      <p className="eyebrow">A little off the path</p>
      <h1>This page couldn’t be found.</h1>
      <p>The address may have changed, or the page may not exist.</p>
      <Link className="button" href="/">
        Return home <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
