import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
     {/*  <h2 className="logo">Softech Invoice Management</h2> */}

      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/team">
          Team Member
        </NavLink>

        <NavLink to="/course">
          Course
        </NavLink>

        <NavLink to="/invoice">
          Invoice
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;