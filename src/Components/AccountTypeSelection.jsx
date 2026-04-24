import React, { useState } from "react";
import SignPage from "./SignPage"; // Individual Form
import SignUp from "./SignUp";     // Organization Form

const AccountTypeSelection = ({ navigate, VIEWS, setUserType }) => {
  const [step, setStep] = useState(0); 

  const selectIndividual = () => {
    setUserType("INDIVIDUAL");
    setStep(1);
  };

  const selectOrganization = () => {
    setUserType("ORGANIZATION");
    setStep(2);
  };

  return (
    <div className="landing-page-wrapper">
      
      {/* --- STATIC HEADER (Stays put) --- */}
      <div className="corner-logo-container">
        <img src="/svLogo.png" alt="SignVision" style={{ height: '150px' }} />
      </div>

      <div className="navbar">
        <div></div>
        <ul className="navbar-links">
          <li onClick={() => navigate(VIEWS.LANDING)}>Home</li>
          <li>Services</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* --- DYNAMIC CARD AREA --- */}
      <div className="hero-section">
        
        {/* STEP 0: SELECTION BUTTONS */}
        {step === 0 && (
          <div className="card-common account-card">
            <h2 className="account-title">Choose Account Type</h2>
            <p className="account-desc">Select the type of account you would like to create.</p>
            <div className="account-btn-box">
              <button className="cta-button account-action-btn" onClick={selectIndividual}>
                Individual
              </button>
              <button className="cta-button account-action-btn" onClick={selectOrganization}>
                Organization
              </button>
              <p className="back-link" onClick={() => navigate(VIEWS.WELCOME)}>← Back</p>
            </div>
          </div>
        )}

        {/* STEP 1: INDIVIDUAL SIGNUP (FIXED HERE) */}
        {step === 1 && (
          <SignPage 
            navigate={navigate} 
            VIEWS={VIEWS} 
            initialIsSignUp={true} 
            
            isEmbedded={true} 
            goBack={() => setStep(0)} 
          />
        )}

        {/* STEP 2: ORGANIZATION SIGNUP */}
        {step === 2 && (
          <SignUp 
            navigate={navigate} 
            VIEWS={VIEWS} 
            setUserType={setUserType} 
            goBack={() => setStep(0)} 
          />
        )}
      </div>
    </div>
  );
};

export default AccountTypeSelection;