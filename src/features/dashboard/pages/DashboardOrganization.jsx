import React from "react";
import { Users, GraduationCap, FileCheck, LifeBuoy, Settings, UserPlus } from "lucide-react";

const DashboardOrganization = ({ navigate = () => {}, userData }) => {

  const stats = [
    {
      title: "Active Students",
      value: "120",
      subtext: "Enrolled in Program",
      icon: <Users size={20} className="text-cyan-400" />,
      className: "stat-cyan",
    },
    {
      title: "Curriculum Progress",
      value: "74%",
      subtext: "Avg. Completion Rate",
      icon: <GraduationCap size={20} className="text-purple-400" />,
      className: "stat-purple",
    },
    {
      title: "Active Licenses",
      value: "150/200",
      subtext: "Resource Allocation",
      icon: <FileCheck size={20} className="text-blue-400" />,
      className: "stat-blue",
    },
    {
      title: "Support Requests",
      value: "8",
      subtext: "Awaiting Response",
      icon: <LifeBuoy size={20} className="text-yellow-400" />,
      className: "stat-yellow",
    },
  ];

  const actions = [
    {
      label: "Student Directory",
      desc: "Manage levels & IEPs",
      icon: <Users size={24} />,
      view: "MEMBERS",
      style: "primary-gradient",
    },
    {
      label: "Enroll Student",
      desc: "Add to curriculum",
      icon: <UserPlus size={24} />,
      view: "ADD_USER",
      style: "secondary-outline",
    },
    {
      label: "Academic Analytics",
      desc: "Progress tracking",
      icon: <GraduationCap size={24} />,
      view: "ANALYTICS",
      style: "secondary-outline",
    },
    {
      label: "Support Desk",
      desc: "Accessibility help",
      icon: <LifeBuoy size={24} />,
      view: "ISSUES",
      style: "secondary-outline",
    },
    {
      label: "Portal Settings",
      desc: "System configuration",
      icon: <Settings size={24} />,
      view: "SETTINGS",
      style: "danger-outline",
    },
  ];

  return (
    <div className="dashboard-content">

      {/* ✅ ORGANIZATION INFO (NEW - SAFE ADDITION) */}
      <div style={{ color: "white", marginBottom: "15px", fontSize: "14px", opacity: 0.8 }}>
        Organization ID: <strong>{userData?.organizationId || "Not Available"}</strong>
      </div>

      {/* STATS */}
      <div className="dashboard-cards">
        {stats.map((s, i) => (
          <div key={i} className={`dashboard-card ${s.className}`}>
            <div className="card-icon-header">
              <h3>{s.title}</h3>
              {s.icon}
            </div>
            <p className="big">{s.value}</p>
            <span className="card-subtext">{s.subtext}</span>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="org-actions-grid">
        {actions.map((a, i) => (
          <button
            key={i}
            className={`org-action-btn ${a.style}`}
            onClick={() => navigate(a.view)}
          >
            <div className="btn-icon-circle">{a.icon}</div>
            <div className="btn-text">
              <strong>{a.label}</strong>
              <span>{a.desc}</span>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

export default DashboardOrganization;