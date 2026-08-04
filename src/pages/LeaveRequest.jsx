import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function LeaveRequest() {

    const [leaveType, setLeaveType] = useState("Vacation");
    const [reason, setReason] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [leaveHistory, setLeaveHistory] = useState([]);

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    async function fetchLeaveRequests() {

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("leave_requests")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error);
            return;
        }

        setLeaveHistory(data);
    }

    async function submitLeave() {

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { error } = await supabase
            .from("leave_requests")
            .insert({
                user_id: user.id,
                leave_type: leaveType,
                reason,
                start_date: startDate,
                end_date: endDate,
            });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Leave request submitted!");

        setReason("");
        setStartDate("");
        setEndDate("");

        fetchLeaveRequests();
    }

    return (
        <div style={{ maxWidth: 700, margin: "40px auto" }}>

            <h1>Leave Request</h1>

            <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
            >
                <option>Vacation</option>
                <option>Sick</option>
                <option>Emergency</option>
            </select>

            <br /><br />

            <textarea
                placeholder="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />

            <br /><br />

            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />

            <br /><br />

            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />

            <br /><br />

            <button onClick={submitLeave}>
                Submit Leave
            </button>

            <hr />

            <h2>My Leave Requests</h2>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    {leaveHistory.map((leave) => (

                        <tr key={leave.id}>

                            <td>{leave.leave_type}</td>

                            <td>{leave.reason}</td>

                            <td>{leave.start_date}</td>

                            <td>{leave.end_date}</td>

                            <td>{leave.status}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default LeaveRequest;