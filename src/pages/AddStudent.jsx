
import { useState, useEffect } from "react";
import "./AddStudent.css";

function AddStudent({
  onAddStudent,
  editingStudent,
  onUpdateStudent,
  onCancelEdit
}) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");

  // Load selected student details into form
  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setStudentId(editingStudent.studentId);
      setCourse(editingStudent.course);
      setMarks(editingStudent.marks);
    }
  }, [editingStudent]);

  function handleSubmit(e) {
    e.preventDefault();

    const student = {
      name,
      studentId,
      course,
      marks
    };

    if (editingStudent) {
      onUpdateStudent(student);
      alert("Student Updated Successfully!");
    } else {
      onAddStudent(student);
      alert("Student Added Successfully!");
    }

    clearForm();
  }

  function clearForm() {
    setName("");
    setStudentId("");
    setCourse("");
    setMarks("");
  }

  function cancelEdit() {
    clearForm();
    onCancelEdit();
  }

  return (
    <div className="student-form">
      <h1>
        {editingStudent ? "Edit Student" : "Add Student"}
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          disabled={!!editingStudent}
          required
        />

        <input
          type="text"
          placeholder="Enter Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Enter Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          min="0"
          max="100"
          required
        />

        <button type="submit">
          {editingStudent ? "Update Student" : "Add Student"}
        </button>

        {editingStudent && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default AddStudent;