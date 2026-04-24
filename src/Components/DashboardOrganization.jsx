import React from "react";
import { Users, GraduationCap, FileCheck, LifeBuoy, Settings } from 'lucide-react';

const DashboardOrganization = ({ navigate }) => {
  return (
    <div className="dashboard-content">
      
      {/* 1. Educational Stats Section */}
      <div className="dashboard-cards">
        <div className="dashboard-card stat-cyan">
          <div className="card-icon-header">
            <h3>Active Students</h3>
            <Users size={20} className="text-cyan-400" />
          </div>
          <p className="big">120</p>
          <span className="card-subtext">Enrolled in Program</span>
        </div>

        <div className="dashboard-card stat-purple">
          <div className="card-icon-header">
            <h3>Curriculum Progress</h3>
            <GraduationCap size={20} className="text-purple-400" />
          </div>
          <p className="big">74%</p>
          <span className="card-subtext">Avg. Completion Rate</span>
        </div>

        <div className="dashboard-card stat-blue">
          <div className="card-icon-header">
            <h3>Active Licenses</h3>
            <FileCheck size={20} className="text-blue-400" />
          </div>
          <p className="big">150/200</p>
          <span className="card-subtext">Resource Allocation</span>
        </div>

        <div className="dashboard-card stat-yellow">
          <div className="card-icon-header">
            <h3>Support Requests</h3>
            <LifeBuoy size={20} className="text-yellow-400" />
          </div>
          <p className="big">8</p>
          <span className="card-subtext">Awaiting Response</span>
        </div>
      </div>

      {/* 2. Educational Management Actions */}
      <div className="org-actions-grid">
        
        <button className="org-action-btn primary-gradient" onClick={() => navigate("MEMBERS")}>
          <div className="btn-icon-circle"><Users size={24} /></div>
          <div className="btn-text">
            <strong>Student Directory</strong>
            <span>Manage levels & IEPs</span>
          </div>
        </button>

        <button className="org-action-btn secondary-outline" onClick={() => navigate("ADD_USER")}>
          <div className="btn-icon-circle"><Users size={24} /></div>
          <div className="btn-text">
            <strong>Enroll Student</strong>
            <span>Add to curriculum</span>
          </div>
        </button>

        <button className="org-action-btn secondary-outline" onClick={() => navigate("ANALYTICS")}>
          <div className="btn-icon-circle"><GraduationCap size={24} /></div>
          <div className="btn-text">
            <strong>Academic Analytics</strong>
            <span>Progress tracking</span>
          </div>
        </button>

        <button className="org-action-btn secondary-outline" onClick={() => navigate("ISSUES")}>
          <div className="btn-icon-circle"><LifeBuoy size={24} /></div>
          <div className="btn-text">
            <strong>Support Desk</strong>
            <span>Accessibility help</span>
          </div>
        </button>

        <button className="org-action-btn danger-outline" onClick={() => navigate("SETTINGS")}>
          <div className="btn-icon-circle"><Settings size={24} /></div>
          <div className="btn-text">
            <strong>Portal Settings</strong>
            <span>System configuration</span>
          </div>
        </button>

      </div>
    </div>
  );
};

export default DashboardOrganization;