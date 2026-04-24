import React, { useState } from 'react';
import { Search, Mail, BookOpen, Accessibility, CheckCircle, XCircle, Edit, Trash2, Award } from 'lucide-react';

const mockStudents = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@school.edu',
    learningLevel: 'Beginner', // A1, A2, B1 etc.
    class: 'Grade 10-B',
    supportType: 'ASL Interpreter',
    status: 'active',
    progress: '85%',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@school.edu',
    learningLevel: 'Advanced',
    class: 'Grade 12-A',
    supportType: 'Hearing Aid Support',
    status: 'active',
    progress: '94%',
    joinDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@school.edu',
    learningLevel: 'Intermediate',
    class: 'Grade 9-C',
    supportType: 'Visual Aids Only',
    status: 'active',
    progress: '72%',
    joinDate: '2024-03-10',
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.p@school.edu',
    learningLevel: 'Beginner',
    class: 'Grade 11-B',
    supportType: 'Tactile Sign Language',
    status: 'inactive',
    progress: '45%',
    joinDate: '2023-11-05',
  },
];

export function UsersManagement() {
  const [users, setUsers] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || user.learningLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const getLevelBadgeClass = (level) => {
    switch(level) {
        case 'Beginner': return 'bg-blue-600/20 text-blue-400';
        case 'Intermediate': return 'bg-purple-600/20 text-purple-400';
        case 'Advanced': return 'bg-gold-600/20 text-yellow-500';
        default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <div className="mb-8">
        <h1 className="admin-title">Student Accessibility Portal</h1>
        <p className="admin-subtitle">Monitor student progress and manage specialized learning requirements</p>
      </div>

      <div className="admin-card">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student name or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 admin-input"
            />
          </div>
          
          <div className="flex gap-2">
            <select 
                className="admin-input bg-gray-800 border-gray-700 text-white px-4"
                onChange={(e) => setFilterLevel(e.target.value)}
            >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
            <button className="btn-admin-primary flex items-center gap-2">
                <BookOpen size={18}/> Export IEP Reports
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr className="border-b border-gray-700/50 text-gray-400">
                <th className="text-left py-3 px-4">Student</th>
                <th className="text-left py-3 px-4">Class</th>
                <th className="text-left py-3 px-4">Sign Level</th>
                <th className="text-left py-3 px-4">Support Needed</th>
                <th className="text-left py-3 px-4">Curriculum Progress</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700/20 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{user.class}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadgeClass(user.learningLevel)}`}>
                      {user.learningLevel}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Accessibility size={14} className="text-cyan-400"/>
                        {user.supportType}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                        <div className="bg-cyan-500 h-2 rounded-full" style={{ width: user.progress }}></div>
                    </div>
                    <span className="text-xs text-gray-400">{user.progress} Complete</span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        user.status === 'active' ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10'
                      }`}
                    >
                      {user.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {user.status === 'active' ? 'In Program' : 'On Leave'}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-cyan-400 transition-colors" title="Edit Student Profile">
                        <Edit size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-yellow-500 transition-colors" title="View Accomplishments">
                        <Award size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}