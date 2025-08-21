import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoSvg = styled.svg`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const LogoText = styled(motion.h1)`
  font-size: ${props => props.fontSize || '1.5rem'};
  font-weight: 700;
  color: ${props => props.color || '#1a202c'};
  margin: 0;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Logo = ({
    size = '40px',
    fontSize = '1.5rem',
    color = '#1a202c',
    showText = true,
    text = 'HealthCare',
    className
}) => {
    return (
        <LogoContainer
            className={className}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
        >
            <LogoSvg
                size={size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                </defs>

                {/* Background Circle */}
                <circle
                    cx="16"
                    cy="16"
                    r="15"
                    fill="url(#logoGradient)"
                    stroke="white"
                    strokeWidth="2"
                />

                {/* Healthcare Heart */}
                <path
                    d="M16 26c0 0-8-5-8-12 0-3 2-5 5-5 2 0 3 1 3 3 0-2 1-3 3-3 3 0 5 2 5 5 0 7-8 12-8 12z"
                    fill="white"
                    stroke="none"
                />

                {/* Medical Cross */}
                <rect x="14.5" y="10" width="3" height="12" fill="#4f46e5" rx="0.5" />
                <rect x="10" y="14.5" width="12" height="3" fill="#4f46e5" rx="0.5" />
            </LogoSvg>

            {showText && (
                <LogoText
                    fontSize={fontSize}
                    color={color}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {text}
                </LogoText>
            )}
        </LogoContainer>
    );
};

export default Logo;
