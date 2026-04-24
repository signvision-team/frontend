import React from "react";

const DashboardIndividual = ({ navigate }) => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>My Progress</h3>
          <p className="big">Level 5</p>
          <span className="card-subtext">Top 10% of learners</span>
        </div>

        <div className="dashboard-card">
          <h3>Detections</h3>
          <p className="big">12</p>
          <span className="card-subtext">Translated today</span>
        </div>

        <div className="dashboard-card">
          <h3>Daily Streak</h3>
          <p className="big">🔥 7 Days</p>
          <span className="card-subtext">Keep it up!</span>
        </div>
      </div>

      <div className="dashboard-actions">
        {/* Updated Class Names */}
        <button className="btn-primary" onClick={() => navigate("DETECTION")}>
          Start Detection
        </button>

        <button className="btn-primary" onClick={() => navigate("LEARN")}>
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default DashboardIndividual;