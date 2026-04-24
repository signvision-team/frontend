import React from 'react';
import Card from './Card';

const ProgressPage = ({ navigate }) => {
    return (
        <Card>
            <h2>Your Progress Report</h2>
            <p className="subtitle">Track your proficiency, points, and achievement badges.</p>
            
            <div style={{ background: '#1C2746', padding: '20px', borderRadius: '15px', marginBottom: '20px', textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-primary-cyan)' }}>Proficiency Score: 78%</h3>
                <p style={{ margin: 0 }}>Points Earned: 1,450</p>
                <p style={{ margin: 0 }}>Badges: 🥉 Beginner, ⭐ Alphabet Master</p>
            </div>
            
            {/* Placeholder for chart/graph */}
            <div style={{ height: '250px', background: '#0A0A26', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-subtle)' }}>
                [Chart Placeholder: Progress Over Time]
            </div>

            <p className="back" onClick={() => navigate('DASHBOARD')}>← Back to Dashboard</p>
        </Card>
    );
};

export default ProgressPage;