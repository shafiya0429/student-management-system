function DashboardCard({ title, count }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <h2>{count}</h2>
    </div>
  );
}

export default DashboardCard;