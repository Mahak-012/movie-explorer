export default function Loader({ count = 10 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton poster-skeleton" />
          <div className="skeleton line-skeleton" />
          <div className="skeleton line-skeleton short" />
        </div>
      ))}
    </div>
  );
}