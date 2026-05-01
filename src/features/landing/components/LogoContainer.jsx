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
    <aside className="sidebar">
      <h2 className="sidebar-title">SignVision</h2>

      <nav>
        <ul className="sidebar-list">
          {menuItems.map((item) => {
            const isActive = currentView === item.view;

            return (
              <li key={item.view}>
                <button
                  onClick={() => navigate(item.view)}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;