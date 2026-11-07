
import "./Navbar.css";

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <h2>Student Management</h2>

      <div className="navbar-right">
        <span>Admin</span>

        <button onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
