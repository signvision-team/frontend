// src/components/ProgressDashboard.jsx

import React from 'react';
import { Users, TrendingUp, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: 'Jul', activeUsers: 185, newUsers: 12 },
  { month: 'Aug', activeUsers: 198, newUsers: 15 },
  { month: 'Sep', activeUsers: 210, newUsers: 18 },
  { month: 'Oct', activeUsers: 225, newUsers: 20 },
  { month: 'Nov', activeUsers: 235, newUsers: 16 },
  { month: 'Dec', activeUsers: 247, newUsers: 14 },
];

const departmentData = [
  { name: 'Engineering', value: 85, color: '#3B82F6' },
  { name: 'Design', value: 42, color: '#8B5CF6' },
  { name: 'Marketing', value: 38, color: '#EC4899' },
  { name: 'Sales', value: 35, color: '#10B981' },
  { name: 'HR', value: 22, color: '#F59E0B' },
  { name: 'Finance', value: 25, color: '#6366F1' },
];

const performanceData = [
  { name: 'Sarah Johnson', department: 'Engineering', tasksCompleted: 47, progress: 94 },
  { name: 'Michael Chen', department: 'Design', tasksCompleted: 42, progress: 88 },
  { name: 'Emily Rodriguez', department: 'Marketing', tasksCompleted: 39, progress: 85 },
  { name: 'David Park', department: 'Engineering', tasksCompleted: 35, progress: 78 },
  { name: 'Jessica Williams', department: 'HR', tasksCompleted: 44, progress: 91 },
];

export function ProgressDashboard() {
  return (
    <div className="admin-panel-wrapper">
      <div className="mb-8">
        <h1 className="admin-title">Overview Dashboard</h1>
        <p className="admin-subtitle">Monitor organization performance and user progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm text-green-400">+12 this month</span>
          </div>
          <h3 className="text-gray-400 mb-1">Total Users</h3>
          <p className="text-white text-lg">247</p>
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-sm text-green-400">93.5%</span>
          </div>
          <h3 className="text-gray-400 mb-1">Active Users</h3>
          <p className="text-white text-lg">231</p>
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-sm text-red-400">-2 from last week</span>
          </div>
          <h3 className="text-gray-400 mb-1">Pending Issues</h3>
          <p className="text-white text-lg">8</p>
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-green-400">+8.2%</span>
          </div>
          <h3 className="text-gray-400 mb-1">Avg. Performance</h3>
          <p className="text-white text-lg">87.2%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="admin-card p-6">
          <h3 className="text-white mb-4">User Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="month" stroke="#A0C0E0" />
              <YAxis stroke="#A0C0E0" />
              <Tooltip contentStyle={{ backgroundColor: '#0b1121', border: '1px solid #1e3a8a', color: 'white' }} />
              <Legend />
              <Line type="monotone" dataKey="activeUsers" stroke="#3B82F6" strokeWidth={2} name="Active Users" />
              <Line type="monotone" dataKey="newUsers" stroke="#10B981" strokeWidth={2} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card p-6">
          <h3 className="text-white mb-4">Users by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0b1121', border: '1px solid #1e3a8a', color: 'white' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="admin-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white">Top Performers This Month</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-400">Employee</th>
                <th className="text-left py-3 px-4 text-gray-400">Department</th>
                <th className="text-left py-3 px-4 text-gray-400">Tasks Completed</th>
                <th className="text-left py-3 px-4 text-gray-400">Progress</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((performer, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/10">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white">
                          {performer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="user-name-cell">{performer.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 user-name-cell">{performer.department}</td>
                  <td className="py-4 px-4 user-name-cell">{performer.tasksCompleted}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-600 rounded-full h-2 max-w-[120px]">
                        <div
                          className="bg-blue-400 h-2 rounded-full"
                          style={{ width: `${performer.progress}%` }}
                        />
                      </div>
                      <span className="text-sm user-name-cell">{performer.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card p-6">
        <h3 className="text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-4 border-b border-gray-700/50">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
            <div>
              <p className="text-white">New user added: Alex Thompson - Engineering</p>
              <p className="text-sm text-gray-400">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-4 border-b border-gray-700/50">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
            <div>
              <p className="text-white">Issue resolved: Password reset for Sarah Johnson</p>
              <p className="text-sm text-gray-400">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-4 border-b border-gray-700/50">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
            <div>
              <p className="text-white">Department updated: Michael Chen moved to Design Lead</p>
              <p className="text-sm text-gray-400">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
            <div>
              <p className="text-white">Bulk import completed: 8 new users added to Marketing</p>
              <p className="text-sm text-gray-400">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}