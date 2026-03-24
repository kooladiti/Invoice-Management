import { FaBell, FaMoon, FaSun } from "react-icons/fa";
import "./NavbarTop.css";

function NavbarTop({ theme, setTheme }) {

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="top-navbar">

      <h4 className="logo-text">
        Softech <span>Infoways Management</span>
      </h4>

      <div className="nav-right">
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>

        <FaBell className="icon" />
        <div className="avatar">A</div>
      </div>

    </div>
  );
}

export default NavbarTop;