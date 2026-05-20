import React from 'react';

// 1. Make sure 'style' is caught here as a prop destructuring argument
const Card = ({ children, style }) => {
  return (
    <div 
      className="card-common" 
      style={{ 
        // 2. Change the fallback default background color here if you want it globally dark
        backgroundColor: "#1a1a2f", 
        borderRadius: "12px",
        padding: "20px",
        boxSizing: "border-box",
        ...style // 3. 🔥 This spread operator allows custom style overrides to work!
      }}
    >
      {children}
    </div>
  );
};

export default Card;