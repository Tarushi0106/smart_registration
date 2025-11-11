import React from 'react';
import { getPasswordStrength } from '../utils/validators';

const PasswordStrengthMeter = ({ password }) => {
  const { strength, score, color } = getPasswordStrength(password);
  
  const getStrengthText = () => {
    switch (strength) {
      case 'Weak':
        return { 
          text: 'QUANTUM LEVEL: WEAK - ENHANCE ENCRYPTION', 
          color: 'text-neon-pink',
          glow: 'neon-pink-glow'
        };
      case 'Medium':
        return { 
          text: 'QUANTUM LEVEL: MEDIUM - ENCRYPTION STABLE', 
          color: 'text-yellow-400',
          glow: 'neon-purple-glow'
        };
      case 'Strong':
        return { 
          text: 'QUANTUM LEVEL: STRONG - MAXIMUM ENCRYPTION', 
          color: 'text-neon-blue',
          glow: 'neon-glow'
        };
      default:
        return { text: '', color: '', glow: '' };
    }
  };

  const strengthInfo = getStrengthText();

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-300">QUANTUM ENCRYPTION LEVEL</span>
        <span className={`text-sm font-bold ${strengthInfo.color} ${strengthInfo.glow}`}>
          {strength}
        </span>
      </div>
      
      <div className="strength-meter">
        <div 
          className="strength-fill"
          style={{ 
            width: `${(score / 6) * 100}%`,
            background: strength === 'Weak' 
              ? 'linear-gradient(90deg, #ff2a6d, #ff6b9d)'
              : strength === 'Medium'
              ? 'linear-gradient(90deg, #b967ff, #d896ff)'
              : 'linear-gradient(90deg, #00f3ff, #00ff88)'
          }}
        />
      </div>
      
      <p className={`text-xs font-bold ${strengthInfo.color}`}>
        {strengthInfo.text}
      </p>

      {/* Password requirements */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center space-x-1 ${password.length >= 8 ? 'text-neon-blue' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-neon-blue' : 'bg-gray-600'}`} />
          <span>8+ QUANTUM BITS</span>
        </div>
        <div className={`flex items-center space-x-1 ${/[A-Z]/.test(password) ? 'text-neon-blue' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-neon-blue' : 'bg-gray-600'}`} />
          <span>UPPERCASE PROTOCOL</span>
        </div>
        <div className={`flex items-center space-x-1 ${/[a-z]/.test(password) ? 'text-neon-blue' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-neon-blue' : 'bg-gray-600'}`} />
          <span>LOWERCASE PROTOCOL</span>
        </div>
        <div className={`flex items-center space-x-1 ${/\d/.test(password) ? 'text-neon-blue' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(password) ? 'bg-neon-blue' : 'bg-gray-600'}`} />
          <span>DIGITAL SEQUENCE</span>
        </div>
        <div className={`flex items-center space-x-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-neon-blue' : 'text-gray-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-neon-blue' : 'bg-gray-600'}`} />
          <span>SPECIAL ENCRYPTION</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;