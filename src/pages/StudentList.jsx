
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentList.css";

function StudentList({
  students,
  onDeleteStudent,
  onEditStudent
}) {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;
  const navigate = useNavigate();

  // Get unique courses
  const courses = [
    ...new Set(students.map((student) => student.course))
  ];

  // Search and filter students
  let filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.studentId.toLowerCase().includes(search.toLowerCase()) ||
      student.course.toLowerCase().includes(search.toLowerCase());

    const matchesCourse =
      selectedCourse === "All" ||
      student.course === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  // Sort students by marks
  if (sortOrder === "ascending") {
    filteredStudents.sort(
      (a, b) => Number(a.marks) - Number(b.marks)
    );
  } else if (sortOrder === "descending") {
    filteredStudents.sort(
      (a, b) => Number(b.marks) - Number(a.marks)
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const startIndex = (currentPage - 1) * studentsPerPage;

  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  // Keep current page valid after filtering or deleting
  useEffect(() => {
    setCurrentPage((previousPage) =>
      Math.min(previousPage, Math.max(1, totalPages))
    );
  }, [totalPages]);

  // Reset to first page when search or filters change
  function handleSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleCourseChange(value) {
    setSelectedCourse(value);
    setCurrentPage(1);
  }

  function handleSortChange(value) {
    setSortOrder(value);
    setCurrentPage(1);
  }

  // Calculate grade
  function calculateGrade(marks) {
    const score = Number(marks);

    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";

    return "F";
  }

  // Calculate result
  function calculateResult(marks) {
    return Number(marks) >= 40 ? "Pass" : "Fail";
  }

  // Export filtered records to CSV
  function exportToCSV() {
    const headers = [
      "Student Name",
      "Student ID",
      "Course",
      "Marks",
      "Percentage",
      "Grade",
      "Result"
    ];

    const csvCell = (value) => {
      let text = String(value ?? "");

      if (/^[=+\-@\t\r]/.test(text)) {
        text = "'" + text;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = filteredStudents.map((student) => [
      student.name,
      student.studentId,
      student.course,
      student.marks,
      `${Number(student.marks)}%`,
      calculateGrade(student.marks),
      calculateResult(student.marks)
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Student_Records.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <div className="student-list">

      <h2>Student Records</h2>

      <div className="student-controls">

        <input
          type="text"
          className="search-input"
          placeholder="Search name, ID or course..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <select
          value={selectedCourse}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          <option value="All">All Courses</option>

          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="none">Sort by Marks</option>
          <option value="ascending">Lowest to Highest</option>
          <option value="descending">Highest to Lowest</option>
        </select>

        <button
          className="export-btn"
          onClick={exportToCSV}
        >
          Export CSV
        </button>

      </div>

      {filteredStudents.length === 0 ? (
        <p>No matching student records found.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Course</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.name}</td>
                  <td>{student.studentId}</td>
                  <td>{student.course}</td>
                  <td>{student.marks}</td>
                  <td>{Number(student.marks)}%</td>
                  <td>{calculateGrade(student.marks)}</td>
                  <td>{calculateResult(student.marks)}</td>

                  <td className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/students/${student.studentId}`)
                      }
                    >
                      View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => onEditStudent(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          `Are you sure you want to delete ${student.name}?`
                        );

                        if (confirmDelete) {
                          onDeleteStudent(student.studentId);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">

            <p>
              Showing {startIndex + 1}–
              {Math.min(startIndex + studentsPerPage, filteredStudents.length)}
              {" "}of {filteredStudents.length} students
            </p>

            <div className="pagination-buttons">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  className={
                    currentPage === page ? "active-page" : ""
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
              >
                Next
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentList;


