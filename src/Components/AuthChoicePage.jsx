import React from "react";
import "./AuthChoicePage.css";

const AuthChoicePage = ({ navigate }) => {
  return (
    <div className="authchoice-container">
      <div className="authchoice-box">
        <h2>Select an Option</h2>

        <button
          className="choice-btn"
          onClick={() => navigate("signin")}
        >
          Sign In
        </button>

        <button
          className="choice-btn"
          onClick={() => navigate("signup")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default AuthChoicePage;
