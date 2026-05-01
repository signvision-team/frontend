import React from "react";
import {
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* =======================
   DATA (can later come from API)
======================= */
const monthlyData = [
  { month: "Jul", activeUsers: 185, newUsers: 12 },
  { month: "Aug", activeUsers: 198, newUsers: 15 },
  { month: "Sep", activeUsers: 210, newUsers: 18 },
  { month: "Oct", activeUsers: 225, newUsers: 20 },
  { month: "Nov", activeUsers: 235, newUsers: 16 },
  { month: "Dec", activeUsers: 247, newUsers: 14 },
];

const departmentData = [
  { name: "Engineering", value: 85, color: "#3B82F6" },
  { name: "Design", value: 42, color: "#8B5CF6" },
  { name: "Marketing", value: 38, color: "#EC4899" },
  { name: "Sales", value: 35, color: "#10B981" },
  { name: "HR", value: 22, color: "#F59E0B" },
  { name: "Finance", value: 25, color: "#6366F1" },
];

const performanceData = [
  { name: "Sarah Johnson", department: "Engineering", tasksCompleted: 47, progress: 94 },
  { name: "Michael Chen", department: "Design", tasksCompleted: 42, progress: 88 },
  { name: "Emily Rodriguez", department: "Marketing", tasksCompleted: 39, progress: 85 },
  { name: "David Park", department: "Engineering", tasksCompleted: 35, progress: 78 },
  { name: "Jessica Williams", department: "HR", tasksCompleted: 44, progress: 91 },
];

/* =======================
   MAIN COMPONENT
======================= */
const ProgressDashboard = () => {
  return (
    <div className="admin-panel-wrapper">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="admin-title">Overview Dashboard</h1>
        <p className="admin-subtitle">
          Monitor organization performance and user progress
        </p>
      </div>

      {/* =======================
          STATS CARDS
      ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="admin-card p-6">
          <div className="flex justify-between mb-2">
            <Users className="text-blue-400" />
            <span className="text-sm text-green-400">+12 this month</span>
          </div>
          <h3 className="text-gray-400">Total Users</h3>
          <p className="text-white text-lg">247</p>
        </div>

        <div className="admin-card p-6">
          <div className="flex justify-between mb-2">
            <CheckCircle className="text-green-400" />
            <span className="text-sm text-green-400">93.5%</span>
          </div>
          <h3 className="text-gray-400">Active Users</h3>
          <p className="text-white text-lg">231</p>
        </div>

        <div className="admin-card p-6">
          <div className="flex justify-between mb-2">
            <Clock className="text-yellow-400" />
            <span className="text-sm text-red-400">-2 this week</span>
          </div>
          <h3 className="text-gray-400">Pending Issues</h3>
          <p className="text-white text-lg">8</p>
        </div>

        <div className="admin-card p-6">
          <div className="flex justify-between mb-2">
            <TrendingUp className="text-purple-400" />
            <span className="text-sm text-green-400">+8.2%</span>
          </div>
          <h3 className="text-gray-400">Avg Performance</h3>
          <p className="text-white text-lg">87.2%</p>
        </div>

      </div>

      {/* =======================
          CHARTS SECTION
      ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* LINE CHART */}
        <div className="admin-card p-6">
          <h3 className="text-white mb-4">User Growth Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />

              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#3B82F6"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="admin-card p-6">
          <h3 className="text-white mb-4">Users by Department</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {departmentData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* =======================
          TOP PERFORMERS TABLE
      ======================= */}
      <div className="admin-card p-6 mb-8">
        <h3 className="text-white mb-4 flex items-center gap-2">
          <BarChart3 size={18} /> Top Performers
        </h3>

        <table className="w-full admin-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Tasks</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody>
            {performanceData.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.department}</td>
                <td>{user.tasksCompleted}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-700 h-2 rounded">
                      <div
                        className="bg-blue-400 h-2 rounded"
                        style={{ width: `${user.progress}%` }}
                      />
                    </div>
                    <span>{user.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* =======================
          ACTIVITY FEED
      ======================= */}
      <div className="admin-card p-6">
        <h3 className="text-white mb-4">Recent Activity</h3>

        <div className="space-y-4 text-gray-300">

          <p>• New user added: Alex Thompson</p>
          <p>• Password reset completed for Sarah Johnson</p>
          <p>• Michael Chen promoted to Design Lead</p>
          <p>• Bulk import: 8 users added to Marketing</p>

        </div>
      </div>

    </div>
  );
};

export default ProgressDashboard;