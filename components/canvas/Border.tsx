import React from 'react';
import { Box } from '@mui/material';

interface BorderProps {
  position: 'top' | 'bottom' | 'left' | 'right';
}

const Border: React.FC<BorderProps> = ({ position }) => {
  let styles = {};

  const baseStyles = {
    backgroundColor: '#DC1C74',
    position: 'absolute',
  };

  const trapezoidSize = '10px';

  switch (position) {
    case 'top':
      styles = {
        ...baseStyles,
        top: 0,
        left: 0,
        right: 0,
        height: trapezoidSize,
        clipPath: 'polygon(2% 100%, 98% 100%, 100% 0%, 0% 0%)',
      };
      break;
    case 'bottom':
      styles = {
        ...baseStyles,
        bottom: 0,
        left: 0,
        right: 0,
        height: trapezoidSize,
        clipPath: 'polygon(0% 100%, 100% 100%, 98% 0%, 2% 0%)',
      };
      break;
    case 'left':
      styles = {
        ...baseStyles,
        top: 0,
        bottom: 0,
        left: 0,
        width: trapezoidSize,
        clipPath: 'polygon(100% 2%, 100% 98%, 0% 100%, 0% 0%)',
      };
      break;
    case 'right':
      styles = {
        ...baseStyles,
        top: 0,
        bottom: 0,
        right: 0,
        width: trapezoidSize,
        clipPath: 'polygon(0% 2%, 0% 98%, 100% 100%, 100% 0%)',
      };
      break;
    default:
      break;
  }

  return <Box sx={styles} />;
};

export default Border;
