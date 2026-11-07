import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Menu</h3>

      <ul>
        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>

        <li>
          <NavLink to="/students">Students</NavLink>
        </li>

        <li>
          <NavLink to="/add-student">Add Student</NavLink>
        </li>
        <li>
           <NavLink to="/attendance">Attendance</NavLink>
        </li>

        <li>
          <NavLink to="/attendance-report">Attendance Reports </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
