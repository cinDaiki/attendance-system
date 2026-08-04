import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
const cardStyle = {
  flex: 1,
  minWidth: "180px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  background: "#fff",
};


function AdminDashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
  employees: 0,
  present: 0,
  absent: 0,
  late: 0,
});
  

  useEffect(() => {
    fetchEmployees();
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
  const today = new Date().toISOString().split("T")[0];

  const { data: employees, error: empError } = await supabase
    .from("profiles")
    .select("*");

  if (empError) {
    console.error(empError);
    return;
  }

  const { data: attendance, error: attError } = await supabase
    .from("attendance")
    .select("*")
    .eq("date", today);

  if (attError) {
    console.error(attError);
    return;
  }

  setStats({
    employees: employees?.length || 0,
    present: attendance?.filter(a => a.status === "Present").length || 0,
    late: attendance?.filter(a => a.status === "Late").length || 0,
    absent: (employees?.length || 0) - (attendance?.length || 0),
  });
}

  async function fetchEmployees() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setEmployees(data);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto" }}>
      <h1>👨‍💼 Admin Dashboard</h1>

      <hr />

        <h2>Total Employees: {employees.length}</h2>

            <div
            style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px",
                flexWrap: "wrap",
            }}
            >
            <div style={cardStyle}>
                <h3>Total Employees</h3>
                <h1>{stats.employees}</h1>
            </div>

            <div style={cardStyle}>
                <h3>Present Today</h3>
                <h1>{stats.present}</h1>
            </div>

            <div style={cardStyle}>
                <h3>Absent</h3>
                <h1>{stats.absent}</h1>
            </div>

            <div style={cardStyle}>
                <h3>Late</h3>
                <h1>{stats.late}</h1>
            </div>
        </div>
                

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;