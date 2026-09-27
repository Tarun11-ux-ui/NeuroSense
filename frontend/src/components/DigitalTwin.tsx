import React from "react";

interface DigitalTwinProps {
  risks: {
    head: number;      // 0 to 1
    leftArm: number;   // 0 to 1
    rightArm: number;  // 0 to 1
    torso: number;     // 0 to 1
    leftLeg: number;   // 0 to 1
    rightLeg: number;  // 0 to 1
  };
}

export default function DigitalTwin({ risks }: DigitalTwinProps) {
  // Helper to interpolate between a normal color (teal) and a risk color (red/orange)
  const getColor = (risk: number) => {
    // Normal: #10b981 (teal)
    // High risk: #ef4444 (red)
    // Moderate risk: #f59e0b (orange)
    
    if (risk < 0.3) return "rgba(16, 185, 129, 0.4)"; // Low risk (green)
    if (risk < 0.7) return "rgba(245, 158, 11, 0.6)"; // Medium risk (orange)
    return "rgba(239, 68, 68, 0.8)"; // High risk (red)
  };

  const getGlow = (risk: number) => {
    if (risk < 0.3) return "none";
    if (risk < 0.7) return "drop-shadow(0 0 8px rgba(245,158,11,0.5))";
    return "drop-shadow(0 0 12px rgba(239,68,68,0.7))";
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <svg 
        viewBox="0 0 200 400" 
        style={{ 
          maxWidth: "100%", 
          maxHeight: "350px",
          filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.1))"
        }}
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Base Wireframe - we use simple paths for a clean, futuristic look */}
        
        {/* Head */}
        <circle 
          cx="100" 
          cy="40" 
          r="25" 
          fill={getColor(risks.head)} 
          stroke="var(--primary)"
          strokeWidth="2"
          style={{ filter: getGlow(risks.head), transition: "all 0.5s ease" }}
        />
        
        {/* Torso */}
        <path 
          d="M 70 80 Q 100 70 130 80 L 125 180 Q 100 200 75 180 Z" 
          fill={getColor(risks.torso)} 
          stroke="var(--primary)"
          strokeWidth="2"
          style={{ filter: getGlow(risks.torso), transition: "all 0.5s ease" }}
        />

        {/* Left Arm (viewer's left) */}
        <path 
          d="M 65 85 Q 40 100 35 150 L 25 210 Q 30 220 40 215 L 60 160 Z" 
          fill={getColor(risks.leftArm)} 
          stroke="var(--primary)"
          strokeWidth="2"
          style={{ filter: getGlow(risks.leftArm), transition: "all 0.5s ease" }}
        />

        {/* Right Arm (viewer's right) */}
        <path 
          d="M 135 85 Q 160 100 165 150 L 175 210 Q 170 220 160 215 L 140 160 Z" 
          fill={getColor(risks.rightArm)} 
          stroke="var(--primary)"
          strokeWidth="2"
          style={{ filter: getGlow(risks.rightArm), transition: "all 0.5s ease" }}
        />

        {/* Left Leg (viewer's left) */}
        <path 
          d="M 75 185 Q 60 250 65 320 L 55 380 Q 70 390 75 380 L 95 300 Q 95 240 98 195 Z" 
          fill={getColor(risks.leftLeg)} 
          stroke="var(--primary)"
          strokeWidth="2"
          style={{ filter: getGlow(risks.leftLeg), transition: "all 0.5s ease" }}
        />

        {/* Right Leg (viewer's right) */}
        <path 
          d="M 125 185 Q 140 250 135 320 L 145 380 Q 130 390 125 380 L 105 300 Q 105 240 102 195 Z" 
          fill={getColor(risks.rightLeg)} 
          stroke="var(--primary)"
          strokeWidth="2"
          style={{ filter: getGlow(risks.rightLeg), transition: "all 0.5s ease" }}
        />
        
        {/* Futuristic joint nodes */}
        <circle cx="100" cy="80" r="4" fill="white" stroke="var(--primary)" strokeWidth="1" />
        <circle cx="65" cy="85" r="4" fill="white" stroke="var(--primary)" strokeWidth="1" />
        <circle cx="135" cy="85" r="4" fill="white" stroke="var(--primary)" strokeWidth="1" />
        <circle cx="35" cy="150" r="3" fill="white" stroke="var(--primary)" strokeWidth="1" />
        <circle cx="165" cy="150" r="3" fill="white" stroke="var(--primary)" strokeWidth="1" />
        <circle cx="85" cy="190" r="4" fill="white" stroke="var(--primary)" strokeWidth="1" />
        <circle cx="115" cy="190" r="4" fill="white" stroke="var(--primary)" strokeWidth="1" />
        <circle cx="65" cy="320" r="3" fill="white" stroke="var(--primary)" strokeWidth="1" />
        <circle cx="135" cy="320" r="3" fill="white" stroke="var(--primary)" strokeWidth="1" />

      </svg>
    </div>
  );
}
