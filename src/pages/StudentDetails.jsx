
import { useParams, useNavigate } from "react-router-dom";
import "./StudentDetails.css";

function StudentDetails({ students }) {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const student = students.find(
    (s) => s.studentId === studentId
  );

  if (!student) {
    return (
      <div className="student-details">
        <h2>Student Not Found</h2>
        <button onClick={() => navigate("/students")}>
          Back to Students
        </button>
      </div>
    );
  }

  const marks = Number(student.marks);

  const grade =
    marks >= 90 ? "A" :
    marks >= 80 ? "B" :
    marks >= 70 ? "C" :
    marks >= 60 ? "D" : "F";

  const result = marks >= 40 ? "Pass" : "Fail";

  return (
    <div className="student-details">
      <h1>Student Details</h1>

      <div className="details-card">
        <h2>{student.name}</h2>

        <p><strong>Student ID:</strong> {student.studentId}</p>
        <p><strong>Course:</strong> {student.course}</p>
        <p><strong>Marks:</strong> {marks}</p>
        <p><strong>Percentage:</strong> {marks}%</p>
        <p><strong>Grade:</strong> {grade}</p>
        <p><strong>Result:</strong> {result}</p>

        <button onClick={() => navigate("/students")}>
          Back to Student List
        </button>
      </div>
    </div>
  );
}

export default StudentDetails;
