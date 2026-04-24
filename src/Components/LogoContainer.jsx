import React from "react";

const Sidebar = ({ navigate, currentView }) => {
  const menuItems = [
    { label: "Dashboard", view: "DASHBOARD" },
    { label: "Detection", view: "DETECTION" },
    { label: "Learn", view: "LEARN" },
    { label: "Progress", view: "PROGRESS" },
    { label: "Settings", view: "SETTINGS" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">SignVision</h2>
      <ul className="sidebar-list">
        {menuItems.map((item) => (
          <li
            key={item.view}
            onClick={() => navigate(item.view)}
            className={currentView === item.view ? "active" : ""}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
