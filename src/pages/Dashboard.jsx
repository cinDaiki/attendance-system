import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Dashboard() {
  const navigate = useNavigate();
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [time, setTime] = useState(new Date());
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchAttendanceHistory();
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  async function fetchAttendanceHistory() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setAttendanceHistory(data);
}


  async function fetchProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("AUTH USER ID:", user.id);

  if (!user) return;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  console.log(data);
  console.log(error);

  if (error) {
    console.error(error);
    return;
  }

  setProfile(data);
}

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/login");
  }

  async function handleTimeIn() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  // Check if user already timed in today
  const { data: existing, error: checkError } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  if (checkError) {
    alert(checkError.message);
    return;
  }

  if (existing) {
    alert("You have already timed in today.");
    return;
  }

  const { error } = await supabase.from("attendance").insert({
  user_id: user.id,
  date: today,
  time_in: new Date().toISOString(),
  status: "Present",
  work_location: "Office",
});

  if (error) {
    alert(error.message);
    return;
  }
  
  await fetchAttendanceHistory();

  alert("✅ Time In successful!");
}

  async function handleTimeOut() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  // Hanapin ang attendance ngayong araw
  const { data: attendance, error: fetchError } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  if (fetchError) {
    alert(fetchError.message);
    return;
  }

  if (!attendance) {
    alert("You need to Time In first.");
    return;
  }

  if (attendance.time_out) {
    alert("You have already timed out today.");
    return;
  }

  const { error } = await supabase
    .from("attendance")
    .update({
      time_out: new Date().toISOString(),
    })
    .eq("id", attendance.id);

  if (error) {
    alert(error.message);
    return;
  }
  await fetchTodayAttendance();
  await fetchAttendanceHistory();

  alert("✅ Time Out successful!");
}
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h1>Employee Dashboard</h1>

      <hr />

      <h2>Welcome, {profile?.name || "Employee"} 👋👋</h2>

      <p>
        <strong>Date:</strong>{" "}
        {time.toLocaleDateString()}
      </p>

      <p>
        <strong>Time:</strong>{" "}
        {time.toLocaleTimeString()}
      </p>

      <br />

      <button
        onClick={handleTimeIn}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
        }}
      >
        Time In
      </button>
      <button
        onClick={()=>{
        navigate("/profile")
        }}
        >
        My Profile
      </button>

      <button
        onClick={handleTimeOut}
        style={{
          padding: "10px 20px",
        }}
      >
        Time Out
      </button>

      <br />
      <br />

      <hr />
            <button
          onClick={() => navigate("/leave")}
      >
          Leave Request
      </button>

<h3>Attendance History</h3>

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
      <th>Date</th>
      <th>Time In</th>
      <th>Time Out</th>
      <th>Status</th>
    </tr>
  </thead>

  <tbody>
    {attendanceHistory.length === 0 ? (
      <tr>
        <td colSpan="4">No attendance history.</td>
      </tr>
    ) : (
      attendanceHistory.map((item) => (
        <tr key={item.id}>
          <td>{item.date}</td>

          <td>
            {item.time_in
              ? new Date(item.time_in).toLocaleTimeString()
              : "--"}
          </td>

          <td>
            {item.time_out
              ? new Date(item.time_out).toLocaleTimeString()
              : "--"}
          </td>

          <td>{item.status}</td>
        </tr>
      ))
    )}
  </tbody>
</table>

         

      <br />

      <button
        onClick={handleLogout}
        style={{
          background: "red",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;