export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <span className="error-icon">⚠️</span>
      <h3>Oops! Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn primary" onClick={onRetry}>🔄 Retry</button>
      )}
    </div>
  );
}