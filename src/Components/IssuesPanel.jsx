import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, MessageSquare, User, Info } from 'lucide-react';

const mockIssues = [
  {
    id: '1',
    studentName: 'Sarah Johnson',
    teacherName: 'Prof. Miller',
    title: 'Detection not reading "Thank You" sign',
    description: 'The real-time module is struggling to differentiate the "Thank You" sign from "Good" during the Grade 10-B practice session.',
    category: 'Sign Recognition',
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-12-12',
    messages: 3,
  },
  {
    id: '2',
    studentName: 'Michael Chen',
    teacherName: 'Admin',
    title: 'Camera hardware error',
    description: 'Integrated camera on Lab PC #4 is not initializing when the student logs in.',
    category: 'Hardware',
    priority: 'high',
    status: 'open',
    createdAt: '2024-12-13',
    messages: 1,
  },
  {
    id: '3',
    studentName: 'Emily Rodriguez',
    teacherName: 'Ms. Clara',
    title: 'Request for custom IEP signs',
    description: 'Need to add specific medical signs to the curriculum for Emily’s specialized IEP path.',
    category: 'Curriculum',
    priority: 'medium',
    status: 'open',
    createdAt: '2024-12-13',
    messages: 0,
  },
  {
    id: '4',
    studentName: 'David Park',
    teacherName: 'Prof. Miller',
    title: 'User credentials reset',
    description: 'Student forgot login pattern. Reset requested for Grade 11 module access.',
    category: 'Account',
    priority: 'low',
    status: 'resolved',
    createdAt: '2024-12-11',
    messages: 5,
  },
];

export function IssuesPanel() {
  const [issues, setIssues] = useState(mockIssues);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const filteredIssues = issues.filter(issue => 
    filterStatus === 'all' || issue.status === filterStatus
  );

  const handleStatusChange = (issueId, newStatus) => {
    setIssues(issues.map(issue =>
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ));
    if (selectedIssue?.id === issueId) {
      setSelectedIssue({ ...selectedIssue, status: newStatus });
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertCircle size={16} />;
      case 'in-progress': return <Clock size={16} />;
      case 'resolved': return <CheckCircle2 size={16} />;
      default: return null;
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <div className="mb-8">
        <h1 className="admin-title">Support & Accessibility Desk</h1>
        <p className="admin-subtitle">Resolve technical and curriculum hurdles for students and faculty</p>
      </div>

      <div className="issues-grid">
        <div className="issues-list-container">
          <div className="admin-card">
            <div className="filter-tab-group">
              {['all', 'open', 'in-progress', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="issues-stack">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className={`issue-item ${selectedIssue?.id === issue.id ? 'selected' : ''}`}
                >
                  <div className="issue-item-header">
                    <div className="issue-main-info">
                      <h3>{issue.title}</h3>
                      <span className={`priority-badge ${getPriorityClass(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    <div className={`status-pill ${issue.status}`}>
                      {getStatusIcon(issue.status)}
                      <span>{issue.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <p className="issue-excerpt">{issue.description}</p>
                  <div className="issue-meta">
                    <span className="meta-user"><User size={14} /> {issue.studentName}</span>
                    <span className="meta-tag">{issue.category}</span>
                    <span className="meta-date">{issue.createdAt}</span>
                    {issue.messages > 0 && (
                      <span className="meta-msg"><MessageSquare size={14} /> {issue.messages}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="details-panel">
          {selectedIssue ? (
            <div className="admin-card sticky-card">
              <h3 className="detail-title">Ticket Details</h3>
              
              <div className="detail-sections">
                <div className="detail-row">
                  <label>Current Status</label>
                  <select
                    value={selectedIssue.status}
                    onChange={(e) => handleStatusChange(selectedIssue.id, e.target.value)}
                    className="admin-input full-width"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="info-box">
                  <div className="info-item">
                    <label>Assigned Student</label>
                    <p>{selectedIssue.studentName}</p>
                  </div>
                  <div className="info-item">
                    <label>Reporting Faculty</label>
                    <p>{selectedIssue.teacherName}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <label>Category</label>
                  <p className="text-white">{selectedIssue.category}</p>
                </div>

                <div className="detail-item">
                  <label>Technical Priority</label>
                  <span className={`priority-badge ${getPriorityClass(selectedIssue.priority)}`}>
                    {selectedIssue.priority}
                  </span>
                </div>

                <div className="detail-item">
                  <label>Post Response to Faculty</label>
                  <textarea
                    className="admin-input full-width"
                    rows={4}
                    placeholder="Provide troubleshooting steps or resolution..."
                  />
                </div>

                <button className="btn-admin-primary full-width">
                  Submit Resolution
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state admin-card">
              <Info size={48} className="text-gray-600 mb-3" />
              <p className="text-gray-400">Select a support ticket to view full logs and resolution tools</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}