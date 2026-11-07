import DashboardCard from "../components/DashboardCard";
import "./Dashboard.css";

function Dashboard({ students }) {

  const totalStudents = students.length;

  const marks = students.map(
    (student) => Number(student.marks)
  );

  const totalMarks = marks.reduce(
    (sum, mark) => sum + mark,
    0
  );

  const averageMarks =
    totalStudents > 0
      ? (totalMarks / totalStudents).toFixed(2)
      : 0;

  const highestMarks =
    totalStudents > 0 ? Math.max(...marks) : 0;

  const lowestMarks =
    totalStudents > 0 ? Math.min(...marks) : 0;

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>

      <div className="dashboard-cards">

        <DashboardCard
          title="Total Students"
          count={totalStudents}
        />

        <DashboardCard
          title="Average Marks"
          count={averageMarks}
        />

        <DashboardCard
          title="Highest Marks"
          count={highestMarks}
        />

        <DashboardCard
          title="Lowest Marks"
          count={lowestMarks}
        />

      </div>

    </div>
  );
}

export default Dashboard;
