import React from "react";
import "./AuthChoicePage.css";

const AuthChoicePage = ({ navigate, VIEWS }) => {
  return (
    <div className="authchoice-container">
      <div className="authchoice-box">
        <h2>Select an Option</h2>

        <button
          className="choice-btn"
          onClick={() => navigate(VIEWS.SIGN_IN)}
        >
          Sign In
        </button>

        <button
          className="choice-btn"
          onClick={() => navigate(VIEWS.SIGN_UP_TYPE)}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default AuthChoicePage;