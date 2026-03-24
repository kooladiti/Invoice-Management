import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import "../App.css";

function Dashboard() {

  const [courses, setCourses] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchInvoices();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch("http://localhost:2000/getcdata");
    const data = await res.json();
    setCourses(data.data || []);
  };

  const fetchInvoices = async () => {
    const res = await fetch("http://localhost:2000/getinvoice");
    const data = await res.json();
    setInvoices(data.data || []);
  };

  // ================= CALCULATIONS =================

  const totalCourses = courses.length;
  const totalInvoices = invoices.length;

  const grossRevenue = invoices.reduce(
    (sum, inv) => sum + Number(inv.courseFee || 0),
    0
  );

  const totalDiscount = invoices.reduce(
    (sum, inv) => sum + Number(inv.discount || 0),
    0
  );

  const netRevenue = grossRevenue - totalDiscount;

  const avgInvoice =
    totalInvoices > 0 ? (netRevenue / totalInvoices).toFixed(0) : 0;

  // ================= TOP COURSE =================
  const courseRevenue = courses.map(course => {
    const revenue = invoices
      .filter(inv => inv.course === course.courseName)
      .reduce((sum, inv) => sum + Number(inv.courseFee || 0), 0);

    return {
      name: course.courseName,
      revenue
    };
  });

  const topCourse = courseRevenue.sort((a, b) => b.revenue - a.revenue)[0];

  // ================= PIE DATA =================
  const pieData = [
    { name: "Net Revenue", value: netRevenue },
    { name: "Discount", value: totalDiscount }
  ];

  const COLORS = ["#2563eb", "#ef4444"];

  return (
    <div className="content-card">

      <h2 className="dashboard-title">Business Overview</h2>

      {/* ================= KPI CARDS ================= */}
      <div className="dashboard-grid">

        <div className="kpi-card">
          <h4>Total Revenue</h4>
          <h2>₹ {netRevenue.toLocaleString()}</h2>
          <span>After discount</span>
        </div>

        <div className="kpi-card">
          <h4>Gross Revenue</h4>
          <h2>₹ {grossRevenue.toLocaleString()}</h2>
          <span>Before discount</span>
        </div>

        <div className="kpi-card">
          <h4>Total Discount</h4>
          <h2>₹ {totalDiscount.toLocaleString()}</h2>
          <span>Total given</span>
        </div>

        <div className="kpi-card">
          <h4>Avg Invoice</h4>
          <h2>₹ {avgInvoice}</h2>
          <span>Per student</span>
        </div>

      </div>

      {/* ================= CHART SECTION ================= */}
      <div className="dashboard-charts">

        <div className="chart-card">
          <h4>Revenue vs Discount</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Course Revenue</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={courseRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= EXTRA INSIGHTS ================= */}
      <div className="dashboard-bottom">

        <div className="insight-card">
          <h4>Top Performing Course</h4>
          <h3>{topCourse ? topCourse.name : "N/A"}</h3>
          <p>
            ₹ {topCourse ? topCourse.revenue.toLocaleString() : 0} Revenue
          </p>
        </div>

        <div className="insight-card">
          <h4>Total Courses</h4>
          <h3>{totalCourses}</h3>
          <p>Total active programs</p>
        </div>

        <div className="insight-card">
          <h4>Total Invoices</h4>
          <h3>{totalInvoices}</h3>
          <p>Total enrolled students</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;