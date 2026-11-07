
import { useState } from "react";
import "./AttendanceReport.css";

function AttendanceReport({ students, attendance }) {
  const [search, setSearch] = useState("");

  // Get all recorded attendance dates
  const attendanceDates = Object.keys(attendance).sort();

  // Calculate attendance statistics for each student
  const reportData = students.map((student) => {
    let present = 0;
    let absent = 0;

    attendanceDates.forEach((date) => {
      const status = attendance[date]?.[student.studentId];

      if (status === "Present") present++;
      else if (status === "Absent") absent++;
    });

    const totalDays = present + absent;

    const percentage =
      totalDays > 0
        ? ((present / totalDays) * 100).toFixed(2)
        : "0.00";

    return {
      ...student,
      present,
      absent,
      totalDays,
      percentage
    };
  });

  // Search by student name or ID
  const filteredReports = reportData.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.studentId.toLowerCase().includes(search.toLowerCase())
  );

  // Overall attendance statistics
  const totalPresent = reportData.reduce(
    (sum, student) => sum + student.present,
    0
  );

  const totalAbsent = reportData.reduce(
    (sum, student) => sum + student.absent,
    0
  );

  const totalAttendance = totalPresent + totalAbsent;

  const overallPercentage =
    totalAttendance > 0
      ? ((totalPresent / totalAttendance) * 100).toFixed(2)
      : "0.00";

  // Convert values safely into CSV cells
  function csvCell(value) {
    let text = String(value ?? "");

    if (/^[=+\-@\t\r]/.test(text)) {
      text = "'" + text;
    }

    return `"${text.replace(/"/g, '""')}"`;
  }

  // Download CSV file
  function downloadCSV(filename, rows) {
    const csvContent = rows
      .map((row) => row.map(csvCell).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // Export student attendance summary
  function exportSummary() {
    const headers = [
      "Student Name",
      "Student ID",
      "Course",
      "Present Days",
      "Absent Days",
      "Total Recorded Days",
      "Attendance Percentage"
    ];

    const rows = reportData.map((student) => [
      student.name,
      student.studentId,
      student.course,
      student.present,
      student.absent,
      student.totalDays,
      `${student.percentage}%`
    ]);

    downloadCSV("Attendance_Summary.csv", [headers, ...rows]);
  }

  // Export date-wise attendance
  function exportDailyAttendance() {
    const headers = [
      "Date",
      "Student Name",
      "Student ID",
      "Course",
      "Status"
    ];

    const rows = attendanceDates.flatMap((date) =>
      students.map((student) => [
        date,
        student.name,
        student.studentId,
        student.course,
        attendance[date]?.[student.studentId] || "Not Recorded"
      ])
    );

    downloadCSV("Daily_Attendance.csv", [headers, ...rows]);
  }

  return (
    <div className="attendance-report">
      <h1>Attendance Reports</h1>

      {/* Summary Cards */}
      <div className="report-summary">
        <div className="report-card">
          <h3>Total Students</h3>
          <h2>{students.length}</h2>
        </div>

        <div className="report-card">
          <h3>Attendance Dates</h3>
          <h2>{attendanceDates.length}</h2>
        </div>

        <div className="report-card">
          <h3>Total Present</h3>
          <h2>{totalPresent}</h2>
        </div>

        <div className="report-card">
          <h3>Total Absent</h3>
          <h2>{totalAbsent}</h2>
        </div>

        <div className="report-card">
          <h3>Overall Attendance</h3>
          <h2>{overallPercentage}%</h2>
        </div>
      </div>

      {/* Search */}
      <div className="report-search">
        <input
          type="text"
          placeholder="Search by student name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Individual Attendance */}
      <h2>Individual Student Attendance</h2>

      {/* CSV Export Buttons */}
      <div className="report-export-buttons">
        <button onClick={exportSummary}>
          Export Attendance Summary
        </button>

        <button onClick={exportDailyAttendance}>
          Export Daily Attendance
        </button>
      </div>

      <div className="report-table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Course</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Total Days</th>
              <th>Attendance %</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.name}</td>
                  <td>{student.studentId}</td>
                  <td>{student.course}</td>
                  <td>{student.present}</td>
                  <td>{student.absent}</td>
                  <td>{student.totalDays}</td>
                  <td>{student.percentage}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceReport;
