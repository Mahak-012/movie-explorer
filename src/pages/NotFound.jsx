import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container page center">
      <h1 className="code-404">404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn primary">← Back to Home</Link>
    </main>
  );
}