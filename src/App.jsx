
import { useState, useEffect } from "react";
import {Routes,Route,Navigate,useNavigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import StudentList from "./pages/StudentList";
import StudentDetails from "./pages/StudentDetails";
import Login from "./pages/Login";
import AdminProfile from "./pages/AdminProfile";
import Attendance from "./pages/Attendance";
import AttendanceReport from "./pages/AttendanceReport";
import "./App.css";

function App() {
  // Student records
  const [students, setStudents] = useState(() => {
    try {
      const savedStudents = localStorage.getItem("students");
      const parsedStudents = savedStudents
        ? JSON.parse(savedStudents)
        : [];

      return Array.isArray(parsedStudents) ? parsedStudents : [];
    } catch {
      return [];
    }
  });

  // Edit student
  const [editingStudent, setEditingStudent] = useState(null);

  // Login status
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  // Admin password
  const [adminPassword, setAdminPassword] = useState(
    () => localStorage.getItem("adminPassword") || "admin123"
  );

  // Attendance records
  const [attendance, setAttendance] = useState(() => {
    try {
      const savedAttendance = localStorage.getItem("attendance");
      const parsedAttendance = savedAttendance
        ? JSON.parse(savedAttendance)
        : {};

      return parsedAttendance &&
        typeof parsedAttendance === "object" &&
        !Array.isArray(parsedAttendance)
        ? parsedAttendance
        : {};
    } catch {
      return {};
    }
  });

  const navigate = useNavigate();

  // Save student records
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // Save attendance records
  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  // Login
  function handleLogin(username, password) {
    if (username === "admin" && password === adminPassword) {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      navigate("/");
      return true;
    }

    return false;
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setEditingStudent(null);
    navigate("/login");
  }

  // Change admin password
  function handleChangePassword(currentPassword, newPassword) {
    if (currentPassword !== adminPassword) {
      return false;
    }

    localStorage.setItem("adminPassword", newPassword);
    setAdminPassword(newPassword);

    return true;
  }

  // Add student
  function handleAddStudent(student) {
    setStudents((previousStudents) => [
      ...previousStudents,
      student
    ]);

    navigate("/students");
  }

  // Delete student
  function handleDeleteStudent(studentId) {
    setStudents((previousStudents) =>
      previousStudents.filter(
        (student) => student.studentId !== studentId
      )
    );
  }

  // Edit student
  function handleEditStudent(student) {
    setEditingStudent(student);
    navigate("/add-student");
  }

  // Update student
  function handleUpdateStudent(updatedStudent) {
    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student.studentId === updatedStudent.studentId
          ? updatedStudent
          : student
      )
    );

    setEditingStudent(null);
    navigate("/students");
  }

  // Cancel editing
  function handleCancelEdit() {
    setEditingStudent(null);
    navigate("/students");
  }

  // Save attendance
  function handleSaveAttendance(date, records) {
    setAttendance((previousAttendance) => ({
      ...previousAttendance,
      [date]: records
    }));
  }

  // Show login page
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Navbar onLogout={handleLogout} />

      <div className="main-layout">
        <Sidebar />

        <div className="content">
          <Routes>

            {/* Dashboard */}
            <Route
              path="/"
              element={<Dashboard students={students} />}
            />

            {/* Student List */}
            <Route
              path="/students"
              element={
                <StudentList
                  students={students}
                  onDeleteStudent={handleDeleteStudent}
                  onEditStudent={handleEditStudent}
                />
              }
            />

            {/* Add Student */}
            <Route
              path="/add-student"
              element={
                <AddStudent
                  onAddStudent={handleAddStudent}
                  editingStudent={editingStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onCancelEdit={handleCancelEdit}
                />
              }
            />

            {/* Student Details */}
            <Route
              path="/students/:studentId"
              element={<StudentDetails students={students} />}
            />

            {/* Admin Profile */}
            <Route
              path="/admin-profile"
              element={
                <AdminProfile
                  onChangePassword={handleChangePassword}
                />
              }
            />

            {/* Attendance */}
            <Route
              path="/attendance"
              element={
                <Attendance
                  students={students}
                  attendance={attendance}
                  onSaveAttendance={handleSaveAttendance}
                />
              }
            />

            {/* Invalid routes */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/attendance-report"
              element={
                <AttendanceReport
                  students={students}
                  attendance={attendance}
                />
              }
            />

          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;





