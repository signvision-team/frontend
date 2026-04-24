import React, { useState } from 'react';

// Components
import SignPage from './Components/SignPage.jsx';
import SignUp from './Components/SignUp.jsx';
import Dashboard from './Components/Dashboard.jsx';

// API
import { loginUser, signupUser } from './api/api';

import './App.css';

const VIEWS = {
    SIGN_IN: 'SIGN_IN',
    SIGN_UP_TYPE: 'SIGN_UP_TYPE',
    DASHBOARD: 'DASHBOARD',
    DETECTION: 'DETECTION',
    LEARN: 'LEARN',
    PROGRESS: 'PROGRESS',
    SETTINGS: 'SETTINGS',
    MEMBERS: 'MEMBERS',
    ADD_USER: 'ADD_USER',
    ISSUES: 'ISSUES',
    ANALYTICS: 'ANALYTICS',
};

const App = () => {
    const [currentView, setCurrentView] = useState(VIEWS.SIGN_IN);
    const [userType, setUserType] = useState("INDIVIDUAL");
    const [userData, setUserData] = useState(null);

    const navigate = (view) => setCurrentView(view);

    // =========================
    // 🔐 LOGIN
    // =========================
   // =========================
// 🔐 LOGIN
// =========================
const handleLogin = async (formData) => {
    try {
        const data = await loginUser(formData); // ✅ already JSON

        if (data.success) {
            setUserData(data.user);
            setUserType(data.user.userType);
            console.log("Login success:", data.user);
            return true;
        } else {
            alert(data.message || "Login failed");
            return false;
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Server error. Try again later.");
        return false;
    }
};

// =========================
// 📝 SIGNUP
// =========================
const handleSignUp = async (formData) => {
    try {
        const data = await signupUser(formData); // ✅ already JSON

        if (data.success) {
            console.log("Signup success");
            return true;
        } else {
            alert(data.message || "Signup failed");
            return false;
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("Server error. Try again later.");
        return false;
    }
};
    // =========================
    // 🧭 ROUTER
    // =========================
    const renderView = () => {
        switch (currentView) {

            case VIEWS.SIGN_IN:
                return (
                    <SignPage
                        navigate={navigate}
                        VIEWS={VIEWS}
                        setUserType={setUserType}
                        handleLogin={handleLogin}
                    />
                );

            case VIEWS.SIGN_UP_TYPE:
                return (
                    <SignUp
                        navigate={navigate}
                        VIEWS={VIEWS}
                        setUserType={setUserType}
                        handleSignUp={handleSignUp}
                    />
                );

            case VIEWS.DASHBOARD:
            case VIEWS.DETECTION:
            case VIEWS.LEARN:
            case VIEWS.PROGRESS:
            case VIEWS.SETTINGS:
            case VIEWS.MEMBERS:
            case VIEWS.ADD_USER:
            case VIEWS.ISSUES:
            case VIEWS.ANALYTICS:
                return (
                    <Dashboard
                        navigate={navigate}
                        currentView={currentView}
                        userType={userType}
                        setUserType={setUserType}
                        userData={userData}
                    />
                );

            default:
                return (
                    <SignPage
                        navigate={navigate}
                        VIEWS={VIEWS}
                        setUserType={setUserType}
                        handleLogin={handleLogin}
                    />
                );
        }
    };

    return (
        <div className="app-global-container">
            {renderView()}
        </div>
    );
};

export default App;