import React from "react";
import Card from "../../dashboard/components/Card";

const ProgressPage = ({ navigate }) => {
  return (
    <Card>
      <h2>Your Progress Report</h2>
      <p className="subtitle">
        Track your proficiency, points, and achievement badges.
      </p>

      {/* Progress Stats Box */}
      <div className="progress-stats-box">
        <h3 className="progress-score">
          Proficiency Score: 78%
        </h3>

        <p>Points Earned: 1,450</p>
        <p>Badges: 🥉 Beginner, ⭐ Alphabet Master</p>
      </div>

      {/* Chart Placeholder */}
      <div className="progress-chart">
        [Chart Placeholder: Progress Over Time]
      </div>

      <p className="back" onClick={() => navigate("DASHBOARD")}>
        ← Back to Dashboard
      </p>
    </Card>
  );
};

export default ProgressPage;