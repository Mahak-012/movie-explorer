import { Link, NavLink } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function Navbar() {
  const { favorites } = useFavorites();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span>Cine<span className="logo-accent">Vault</span></span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Discover</NavLink>
          <NavLink to="/favorites">
            Favorites <span className="badge">{favorites.length}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}