export default function SearchBar({ value, onChange }) {
  return (
    <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search movies by title, actor…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="clear-btn" onClick={() => onChange("")}>
          ✕
        </button>
      )}
      <button type="submit" className="search-submit">SEARCH</button>
    </form>
  );
}