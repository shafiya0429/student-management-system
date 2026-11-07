
import { useEffect, useState } from "react";
import "./Attendance.css";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Attendance({ students, attendance, onSaveAttendance }) {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    const savedForDate = attendance[selectedDate] || {};
    const initialStatus = {};

    students.forEach((student) => {
      initialStatus[student.studentId] =
        savedForDate[student.studentId] || "Absent";
    });

    setAttendanceStatus(initialStatus);
  }, [selectedDate, students, attendance]);

  function handleStatusChange(studentId, status) {
    setAttendanceStatus((previous) => ({
      ...previous,
      [studentId]: status
    }));
  }

  function handleSave() {
    onSaveAttendance(selectedDate, attendanceStatus);
    alert("Attendance saved successfully!");
  }

  const presentCount = Object.values(attendanceStatus).filter(
    (status) => status === "Present"
  ).length;

  const absentCount = students.length - presentCount;

  return (
    <div className="attendance-page">
      <h1>Student Attendance</h1>

      <div className="attendance-summary">
        <div className="attendance-card">
          <h3>Total Students</h3>
          <h2>{students.length}</h2>
        </div>

        <div className="attendance-card">
          <h3>Present</h3>
          <h2>{presentCount}</h2>
        </div>

        <div className="attendance-card">
          <h3>Absent</h3>
          <h2>{absentCount}</h2>
        </div>
      </div>

      <div className="attendance-container">
        <label htmlFor="attendance-date">Select Date:</label>

        <input
          id="attendance-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {students.length === 0 ? (
          <p>No students registered yet.</p>
        ) : (
          <>
            <div className="attendance-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Course</th>
                    <th>Attendance</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.name}</td>
                      <td>{student.studentId}</td>
                      <td>{student.course}</td>
                      <td>
                        <select
                          value={
                            attendanceStatus[student.studentId] || "Absent"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              student.studentId,
                              e.target.value
                            )
                          }
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="save-attendance-btn"
              onClick={handleSave}
            >
              Save Attendance
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;
